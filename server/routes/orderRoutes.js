const express = require('express');
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, cancelOrderByStaff, initiateOrderModification } = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes in this file are protected
router.use(authenticate);

router.route('/')
  .post(authenticate, createOrder)
  .get(authenticate, authorize('admin', 'staff'), getAllOrders);

router.route('/my-orders')
  .get(authenticate, getMyOrders);

router.route('/:id')
  .get(authenticate, getOrderById);

router.route('/:id/status')
  .put(authenticate, authorize('admin', 'staff'), updateOrderStatus);

router.route('/:orderId/cancel')
  .put(authenticate, cancelOrder);

// Staff/Admin: Cancel order with reason (S3-9)
router.route('/:orderId/staff-cancel')
  .put(authenticate, authorize('admin', 'staff'), cancelOrderByStaff);

// Customer: Modify their own order
router.route('/:orderId/modify')
  .put(authenticate, initiateOrderModification);

module.exports = router;
