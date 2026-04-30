import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './StripePaymentForm';
import paymentService from '../services/paymentService';
import './StripeCheckout.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripeCheckout = ({ amount, orderId, onSuccess, onError, onCancel }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await paymentService.createPaymentIntent(amount, orderId);
        setClientSecret(response.clientSecret);
        setPaymentIntentId(response.paymentIntentId);
        setError(null);
      } catch (err) {
        console.error('Failed to create payment intent:', err);
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, orderId]);

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      if (orderId) {
        await paymentService.confirmPayment(paymentIntent.id, orderId);
      }
      onSuccess(paymentIntent);
    } catch (err) {
      console.error('Payment confirmation error:', err);
      onError(err);
    }
  };

  if (loading) {
    return (
      <div className="stripe-checkout-loading">
        <div className="loading-spinner"></div>
        <p>Initializing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stripe-checkout-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={onCancel} className="btn-cancel">Go Back</button>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#667eea',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="stripe-checkout-container">
      <div className="stripe-checkout-header">
        <h2>Secure Payment</h2>
        <p>Complete your payment to confirm your order</p>
      </div>
      
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm 
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onError={onError}
          />
        </Elements>
      )}

      <div className="stripe-checkout-footer">
        <button onClick={onCancel} className="btn-cancel-payment">
          Cancel Payment
        </button>
      </div>

      <div className="payment-security-info">
        <p>🔒 Your payment is secured by Stripe</p>
      </div>
    </div>
  );
};

export default StripeCheckout;
