import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100x100?text=🍕';
    if (imagePath.startsWith('http')) return imagePath;
    const base = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
    return `${base}${imagePath}`;
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div>
          <h1>Your Cart</h1>
          {cartItems.length > 0 && (
            <p className="cart-subtitle">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
          )}
        </div>
        {cartItems.length > 0 && (
          <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious pizzas to get started!</p>
          <Link to="/menu" className="cart-browse-btn">Browse Our Menu</Link>
        </div>
      ) : (
        <div className="cart-content">
          {/* Items list */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-unit">${parseFloat(item.price).toFixed(2)} each</p>
                  {item.customization && (
                    <p className="cart-item-custom">
                      {[
                        item.customization.size?.name && `Size: ${item.customization.size.name}`,
                        item.customization.crust?.displayName && `Crust: ${item.customization.crust.displayName}`,
                        item.customization.extraToppings?.length > 0 && `+${item.customization.extraToppings.map(t => t.displayName).join(', ')}`,
                        item.customization.removedIngredients?.length > 0 && `No: ${item.customization.removedIngredients.join(', ')}`,
                        item.customization.specialInstructions && `Note: ${item.customization.specialInstructions}`,
                      ].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >🗑️ Remove</button>
                </div>

                <div className="cart-item-total">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-lines">
              {cartItems.map(item => (
                <div key={item.id} className="summary-line">
                  <span className="summary-line-name">{item.name} ×{item.quantity}</span>
                  <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row green">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout →</Link>
            <Link to="/menu" className="continue-btn">← Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
