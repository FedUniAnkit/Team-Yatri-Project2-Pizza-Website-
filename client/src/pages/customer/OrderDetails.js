import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import './OrderDetails.css';

const STATUS_LABELS = {
  pending:   { label: 'Preparing Your Order', color: '#f39c12', icon: '⏳' },
  confirmed: { label: 'Confirmed',            color: '#3498db', icon: '✅' },
  preparing: { label: 'Being Prepared',       color: '#9b59b6', icon: '👨‍🍳' },
  ready:     { label: 'Ready for Pickup',     color: '#1abc9c', icon: '🛍️' },
  delivered: { label: 'Delivered',            color: '#27ae60', icon: '🎉' },
  cancelled: { label: 'Cancelled',            color: '#e74c3c', icon: '❌' },
};

const NON_CANCELLABLE = ['delivered', 'cancelled'];

const OrderDetails = () => {
  const { id } = useParams();
  const socket = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        setError('Could not fetch order details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Auto-refresh when this order is updated via socket
  useEffect(() => {
    if (!socket) return;
    const handleOrderUpdated = (updated) => {
      if (updated.id === id) setOrder(updated);
    };
    socket.on('order_updated', handleOrderUpdated);
    return () => socket.off('order_updated', handleOrderUpdated);
  }, [socket, id]);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    setConfirmCancel(false);
    try {
      const response = await orderService.cancelOrder(id);
      setOrder(response.data);
      toast.success('Order cancelled successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel the order.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return <div className="od-loading">Loading order details...</div>;
  if (error)   return <div className="od-error">{error}</div>;
  if (!order)  return <div className="od-error">Order not found.</div>;

  const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: '#95a5a6', icon: '📦' };
  const canCancel  = !NON_CANCELLABLE.includes(order.status);
  const items      = Array.isArray(order.items) ? order.items : [];
  const addr       = order.deliveryAddress || {};

  return (
    <div className="order-details-container">

      {/* Header */}
      <div className="od-header">
        <div>
          <h1>Order #{order.orderNumber}</h1>
          <p className="od-date">{new Date(order.createdAt).toLocaleString('en-AU', { dateStyle: 'long', timeStyle: 'short' })}</p>
        </div>
        <span className="od-status-badge" style={{ background: statusInfo.color }}>
          {statusInfo.icon} {statusInfo.label}
        </span>
      </div>

      {/* Cancellation reason (if cancelled by staff) */}
      {order.status === 'cancelled' && order.cancellationReason && (
        <div className="od-cancel-reason">
          <strong>Cancellation reason:</strong> {order.cancellationReason}
        </div>
      )}

      {/* Order items */}
      <div className="od-section">
        <h2>🍕 Items Ordered</h2>
        <div className="od-items">
          {items.map((item, idx) => (
            <div key={idx} className="od-item">
              <div className="od-item-info">
                <span className="od-item-name">{item.name}</span>
                <span className="od-item-qty">x{item.quantity}</span>
                {item.customization && (
                  <span className="od-item-custom">
                    {[
                      item.customization.size?.name && `Size: ${item.customization.size.name}`,
                      item.customization.crust?.displayName && `Crust: ${item.customization.crust.displayName}`,
                      item.customization.extraToppings?.length > 0 && `+${item.customization.extraToppings.map(t => t.displayName).join(', ')}`,
                      item.customization.removedIngredients?.length > 0 && `No: ${item.customization.removedIngredients.join(', ')}`,
                      item.customization.specialInstructions && `Note: ${item.customization.specialInstructions}`,
                    ].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>
              <span className="od-item-price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="od-total">
            <strong>Total</strong>
            <strong>${parseFloat(order.totalAmount).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Delivery + Payment */}
      <div className="od-meta-grid">
        <div className="od-section">
          <h2>📍 Delivery Address</h2>
          <p>{addr.street}</p>
          <p>{addr.city}{addr.postalCode ? `, ${addr.postalCode}` : ''}</p>
        </div>
        <div className="od-section">
          <h2>💳 Payment</h2>
          <p>{order.paymentMethod?.charAt(0).toUpperCase() + order.paymentMethod?.slice(1)}</p>
          <p className={`od-pay-status pay-${order.paymentStatus}`}>{order.paymentStatus}</p>
        </div>
      </div>

      {/* Customer notes (S3-5) */}
      {order.customerNotes && (
        <div className="od-section">
          <h2>📝 Your Notes</h2>
          <p className="od-notes">{order.customerNotes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="od-actions">
        <Link to="/my-orders" className="od-btn-secondary">← Back to My Orders</Link>
        {canCancel && !confirmCancel && (
          <button
            className="od-btn-cancel"
            onClick={() => setConfirmCancel(true)}
            disabled={isCancelling}
          >
            🚫 Cancel Order
          </button>
        )}
        {canCancel && confirmCancel && (
          <>
            <span style={{fontSize:'0.88rem',color:'#e74c3c',fontWeight:600}}>Confirm cancellation?</span>
            <button className="od-btn-cancel" onClick={handleCancelOrder} disabled={isCancelling}>
              {isCancelling ? 'Cancelling…' : 'Yes, Cancel'}
            </button>
            <button className="od-btn-secondary" onClick={() => setConfirmCancel(false)}>No, Keep</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
