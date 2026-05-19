const { Order, User, Promotion, Product } = require('../models');
const { getIO } = require('../socket');
const { sequelize } = require('../config/database');
const emailService = require('../utils/emailService');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
  const { items, promotionCode, deliveryAddress, customerNotes, paymentMethod } = req.body;
  const customerId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Your cart is empty.' });
  }

  const transaction = await sequelize.transaction();

  try {
    const productIds = items.map(item => item.productId || item.id);
    const productsInDb = await Product.findAll({ where: { id: productIds } }, { transaction });

    if (productsInDb.length !== productIds.length) {
      return res.status(404).json({ success: false, message: 'One or more products in your cart could not be found.' });
    }

    const productMap = new Map(productsInDb.map(p => [p.id, p]));
    let subtotal = 0;
    const orderItems = items.map(item => {
      const productId = item.productId || item.id;
      const product = productMap.get(productId);
      subtotal += product.price * item.quantity;
      return { ...item, productId, price: product.price }; // Use server-side price
    });

    let promotionId = null;
    let discountAmount = 0;

    if (promotionCode) {
      const promotion = await Promotion.findOne({ 
        where: { code: promotionCode.toUpperCase(), isActive: true } 
      }, { transaction });

      if (promotion) {
        // Validate promo code
        const now = new Date();
        
        // Check date validity
        if (promotion.startDate && new Date(promotion.startDate) > now) {
          await transaction.rollback();
          return res.status(400).json({ success: false, message: 'This promo code is not yet valid.' });
        }
        if (promotion.endDate && new Date(promotion.endDate) < now) {
          await transaction.rollback();
          return res.status(400).json({ success: false, message: 'This promo code has expired.' });
        }
        
        // Check usage limit
        if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
          await transaction.rollback();
          return res.status(400).json({ success: false, message: 'This promo code has reached its usage limit.' });
        }
        
        // Check minimum order amount
        if (subtotal < parseFloat(promotion.minimumOrderAmount)) {
          await transaction.rollback();
          return res.status(400).json({ 
            success: false, 
            message: `Minimum order amount of $${promotion.minimumOrderAmount} required to use this promo code.` 
          });
        }
        
        promotionId = promotion.id;
        
        // Calculate discount
        if (promotion.discountType === 'percentage') {
          discountAmount = subtotal * (parseFloat(promotion.amount) / 100);
          // Apply max discount cap if set
          if (promotion.maxDiscountAmount && discountAmount > parseFloat(promotion.maxDiscountAmount)) {
            discountAmount = parseFloat(promotion.maxDiscountAmount);
          }
        } else {
          discountAmount = parseFloat(promotion.amount);
        }
        
        // Ensure discount doesn't exceed order amount
        if (discountAmount > subtotal) {
          discountAmount = subtotal;
        }
        
        // Increment usage count
        await promotion.increment('usageCount', { transaction });
      } else {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: 'Invalid promo code.' });
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);

    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderNumber = `ORD-${timestamp}-${random}`;

    const newOrder = await Order.create({
      customerId,
      orderNumber,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      customerNotes,
      paymentMethod: paymentMethod || 'cash',
      promotionId,
    }, { transaction });

    await transaction.commit();

    // Notify staff room of the new order via WebSocket
    const io = getIO();
    io.to('staff_room').emit('new_order', newOrder);

    // Send response immediately - don't wait for emails
    res.status(201).json({ success: true, data: newOrder });

    // Send emails in the background (non-blocking)
    setImmediate(async () => {
      try {
        const customer = await User.findByPk(customerId);
        if (customer) {
          const orderDataForEmail = {
            ...newOrder.get({ plain: true }),
            items: newOrder.items, 
          };
          await emailService.sendOrderConfirmationEmail(customer, orderDataForEmail);
        }
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }

      try {
        const { Op } = require('sequelize');
        const staffMembers = await User.findAll({
          where: {
            role: ['staff', 'admin'],
            isActive: true,
            id: { [Op.ne]: customerId } // Exclude the customer who placed the order
          }
        });
        
        if (staffMembers && staffMembers.length > 0) {
          const customer = await User.findByPk(customerId);
          const orderDataForEmail = {
            ...newOrder.get({ plain: true }),
            items: newOrder.items,
          };
          await emailService.sendNewOrderNotificationToStaff(staffMembers, orderDataForEmail, customer);
        }
      } catch (emailError) {
        console.error('Failed to send staff notification emails:', emailError);
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order.', error: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { customerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Customer, Staff, Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { association: 'customer', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure customer can only see their own orders
    if (req.user.role === 'customer' && order.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('getOrderById error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin/Staff
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { 
          association: 'customer',
          attributes: ['id', 'name', 'email'] 
        }
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Staff
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByPk(req.params.id, { include: ['customer'] });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Send email notification when order is confirmed (S3-8)
    if (status === 'confirmed' && previousStatus !== 'confirmed' && order.customer) {
      try {
        await emailService.sendEmail(
          order.customer.email,
          `Order #${order.orderNumber} Confirmed - Komorebi Pizza`,
          'order-status-update',
          {
            name: order.customer.name,
            orderNumber: order.orderNumber,
            status: 'Confirmed',
            statusMessage: 'Your order has been confirmed and is being prepared. We\'ll have it ready for you soon!',
            orderTotal: parseFloat(order.totalAmount).toFixed(2),
          }
        );
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }
    }

    // Notify via socket
    const io = getIO();
    io.to('staff_room').emit('order_updated', order);
    io.to(`customer_${order.customerId}`).emit('order_updated', order);

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Cancel an order by customer
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if the user owns the order
    if (order.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to cancel this order' });
    }

    // S3-6: Cancellation allowed only for orders that are not "Finished" (delivered/cancelled)
    const nonCancellableStatuses = ['confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (nonCancellableStatuses.includes(order.status)) {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled once it has been accepted or prepared. Current status: ${order.status}` });
    }

    order.status = 'cancelled';
    order.cancelledBy = req.user.id;
    order.cancellationReason = 'Cancelled by customer';
    await order.save();

    // Notify staff
    const io = getIO();
    io.to('staff_room').emit('order_updated', order);

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Cancel an order by staff with reason (S3-9)
// @route   PUT /api/orders/:orderId/staff-cancel
// @access  Private/Admin/Staff
const cancelOrderByStaff = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ success: false, message: 'Cancellation reason is required.' });
    }

    const order = await Order.findByPk(orderId, { include: ['customer'] });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const nonCancellableStatuses = ['confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (nonCancellableStatuses.includes(order.status)) {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled once it has been accepted or prepared. Current status: ${order.status}` });
    }

    order.status = 'cancelled';
    order.cancelledBy = req.user.id;
    order.cancellationReason = reason;
    await order.save();

    // Send cancellation email to customer (S3-9)
    if (order.customer) {
      try {
        await emailService.sendEmail(
          order.customer.email,
          `Order #${order.orderNumber} Cancelled - Komorebi Pizza`,
          'order-status-update',
          {
            name: order.customer.name,
            orderNumber: order.orderNumber,
            status: 'Cancelled',
            statusMessage: `Your order has been cancelled by our staff. Reason: ${reason}`,
            orderTotal: parseFloat(order.totalAmount).toFixed(2),
          }
        );
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
      }
    }

    // Notify via socket
    const io = getIO();
    io.to('staff_room').emit('order_updated', order);
    io.to(`customer_${order.customerId}`).emit('order_updated', order);

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Staff cancel order error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Initiate order modification by cancelling and returning items
// @route   PUT /api/orders/:orderId/modify
// @access  Private
const initiateOrderModification = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.customerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to modify this order' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Order cannot be modified. Status: ${order.status}` });
    }

    order.status = 'cancelled';
    order.cancellationReason = 'Cancelled by customer for modification';
    order.cancelledBy = req.user.id;
    await order.save();

    // Return the JSONB items so the frontend can repopulate the cart
    res.status(200).json({ success: true, data: order.items });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  cancelOrderByStaff,
  initiateOrderModification,
};
