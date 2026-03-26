import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import orderService from '../services/orderService';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    paymentMethod: 'cash',
    customerNotes: '',
    promotionCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setIsProcessing(true);

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        ...(item.customization ? { customization: item.customization } : {}),
      })),
      deliveryAddress: {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      paymentMethod: formData.paymentMethod,
      customerNotes: formData.customerNotes.trim() || null,
      promotionCode: formData.promotionCode.trim() || null,
    };

    try {
      const response = await orderService.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully! Preparing your order...');
      navigate(`/orders/${response.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious pizzas before checking out!</p>
          <Link to="/menu" className="btn-primary-checkout">Browse Our Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Review your order and complete your purchase</p>
      </div>

      <div className="checkout-content">
        {/* LEFT: Form */}
        <form onSubmit={handleSubmit} className="checkout-form">

          <div className="form-section">
            <h2 className="section-title">📍 Delivery Address</h2>
            <div className="form-group-checkout">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="e.g. 123 Main Street"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group-checkout">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Adelaide"
                  required
                />
              </div>
              <div className="form-group-checkout">
                <label>Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">💳 Payment Method</h2>
            <div className="payment-options">
              {[
                { value: 'cash', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' },
                { value: 'card', label: '💳 Pay by Card', desc: 'Credit or debit card at the door' },
                { value: 'online', label: '🌐 Online Payment', desc: 'Secure online payment' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`payment-option ${formData.paymentMethod === opt.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={formData.paymentMethod === opt.value}
                    onChange={handleChange}
                  />
                  <div className="payment-option-info">
                    <span className="payment-label">{opt.label}</span>
                    <span className="payment-desc">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">📝 Special Instructions (Optional)</h2>
            <div className="form-group-checkout">
              <label>Notes for the restaurant</label>
              <textarea
                name="customerNotes"
                value={formData.customerNotes}
                onChange={handleChange}
                placeholder="e.g. Extra napkins, no onions, ring the doorbell..."
                rows={3}
                maxLength={500}
              />
              <small className="char-count">{formData.customerNotes.length}/500</small>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">🏷️ Promo Code (Optional)</h2>
            <div className="promo-row">
              <input
                type="text"
                name="promotionCode"
                value={formData.promotionCode}
                onChange={handleChange}
                placeholder="Enter promo code"
              />
            </div>
          </div>

          <button
            type="submit"
            className="place-order-btn"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span>⏳ Placing Order...</span>
            ) : (
              <span>✅ Place Order — ${cartTotal.toFixed(2)}</span>
            )}
          </button>
        </form>

        {/* RIGHT: Order Summary */}
        <div className="order-summary-checkout">
          <h2>🧾 Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-info">
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-qty">x{item.quantity}</span>
                </div>
                <span className="summary-item-price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row muted">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="summary-total-checkout">
            <strong>Total</strong>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
          <Link to="/cart" className="edit-cart-link">← Edit Cart</Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
