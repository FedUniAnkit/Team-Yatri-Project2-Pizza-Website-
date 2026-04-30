const { Message, Order, User } = require('../models');
const { getIO } = require('../socket');
const emailService = require('../utils/emailService');

// @desc    Get all messages for a specific order
// @route   GET /api/messages/:orderId
// @access  Private
const getMessagesForOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const messages = await Message.findAll({
      where: { orderId },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'name', 'role'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    // Security check: Ensure the user is part of the order or an admin/staff
    const order = await Order.findByPk(orderId);
    if (req.user.id !== order.customerId && req.user.role === 'customer') {
        return res.status(403).json({ success: false, message: 'Not authorized to view these messages' });
    }

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Send a new message
// @route   POST /api/messages/:orderId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { content, receiverId } = req.body;
    const senderId = req.user.id;

    if (!content || !receiverId) {
        return res.status(400).json({ success: false, message: 'Message content and receiver are required.' });
    }

    const newMessage = await Message.create({
      orderId,
      senderId,
      receiverId,
      content,
    });

    const messageWithSender = await Message.findByPk(newMessage.id, {
        include: [{ model: User, as: 'Sender', attributes: ['id', 'name', 'role'] }],
    });

    // Send email notification if staff is messaging a customer
    try {
      const sender = await User.findByPk(senderId);
      const receiver = await User.findByPk(receiverId);
      const order = await Order.findByPk(orderId);

      // Send email if staff/admin is messaging a customer
      if ((sender.role === 'staff' || sender.role === 'admin') && receiver.role === 'customer') {
        await emailService.sendStaffMessageToCustomer(receiver, sender, order, content);
        await newMessage.update({ emailSent: true });
        console.log(`Email notification sent to customer ${receiver.email} for order ${order.orderNumber}`);
      }
      // Send email if customer is replying to staff/admin
      if (sender.role === 'customer' && (receiver.role === 'staff' || receiver.role === 'admin')) {
        await emailService.sendCustomerReplyToStaff(receiver, sender, order, content);
        await newMessage.update({ emailSent: true });
        console.log(`Customer reply email sent to staff ${receiver.email} for order ${order.orderNumber}`);
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email sending fails
    }

    // Emit the message via Socket.IO to the specific order room
    const io = getIO();
    io.to(`order_${orderId}`).emit('new_message', messageWithSender);

    res.status(201).json({ success: true, data: messageWithSender });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = { getMessagesForOrder, sendMessage };
