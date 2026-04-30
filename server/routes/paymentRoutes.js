const express = require('express');
const { createPaymentIntent, confirmPayment, handleWebhook } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/create-payment-intent', authenticate, createPaymentIntent);

router.post('/confirm-payment', authenticate, confirmPayment);

router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
