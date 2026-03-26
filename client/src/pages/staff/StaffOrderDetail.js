import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import './StaffOrderDetail.css';

const STATUS_CONFIG = {
  pending:   { label: 'Preparing Your Order', color: '#f39c12', icon: '⏳' },
  confirmed: { label: 'Confirmed',            color: '#3498db', icon: '✅' },
  preparing: { label: 'Being Prepared',       color: '#9b59b6', icon: '👨‍🍳' },
  ready:     { label: 'Ready for Pickup',     color: '#1abc9c', icon: '🛍️' },
  delivered: { label: 'Delivered',            color: '#27ae60', icon: '🎉' },
  cancelled: { label: 'Cancelled',            color: '#e74c3c', icon: '❌' },
};

const StaffOrderDetail = () => {
  const { id } = useParams();
  const socket = useSocket();
  const [order, setOrder]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showCancel, setShowCancel]   = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
    } catch (err) {
      setError('Could not fetch order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  // Auto-refresh when this order is updated via socket
  useEffect(() => {
    if (!socket) return;
    const handleOrderUpdated = (updated) => {
      if (updated.id === id) setOrder(updated);
    };
    socket.on('order_updated', handleOrderUpdated);
    return () => socket.off('order_updated', handleOrderUpdated);
  }, [socket, id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(`Status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`);
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleStaffCancel = async () => {
    if (!cancelReason.trim()) { toast.error('Reason is required.'); return; }
    setSubmitting(true);
    try {
      await orderService.cancelOrderByStaff(id, cancelReason);
      toast.success('Order cancelled and customer notified.');
      setShowCancel(false);
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="sod-loading">Loading order details...</div>;
  if (error)   return <div className="sod-error">{error}</div>;
  if (!order)  return <div className="sod-error">Order not found.</div>;

  const cfg       = STATUS_CONFIG[order.status] || { label: order.status, color: '#95a5a6', icon: '📦' };
  const items     = Array.isArray(order.items) ? order.items : [];
  const addr      = order.deliveryAddress || {};
  const isFinal   = ['delivered', 'cancelled'].includes(order.status);

  return (
    <div className="sod-container">

      {/* Header */}
      <div className="sod-header">
        <div className="sod-header-left">
          <Link to="/staff/orders" className="sod-back">← All Orders</Link>
          <h1>Order #{order.orderNumber}</h1>
          <p className="sod-date">
            Placed {new Date(order.createdAt).toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
        <span className="sod-status-badge" style={{ background: cfg.color }}>
          {cfg.icon} {cfg.label}
        </span>
      </div>

      {/* Cancellation reason */}
      {order.status === 'cancelled' && order.cancellationReason && (
        <div className="sod-cancel-reason">
          <strong>Cancellation reason:</strong> {order.cancellationReason}
        </div>
      )}

      <div className="sod-grid">

        {/* Items */}
        <div className="sod-section sod-items-section">
          <h2>🍕 Order Items</h2>
          <div className="sod-items">
            {items.map((item, idx) => (
              <div key={idx} className="sod-item">
                <div className="sod-item-info">
                  <span className="sod-item-name">{item.name}</span>
                  <span className="sod-item-unit">${parseFloat(item.price).toFixed(2)} each</span>
                  {item.customization && (
                    <span className="sod-item-custom">
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
                <div className="sod-item-right">
                  <span className="sod-item-qty">×{item.quantity}</span>
                  <span className="sod-item-total">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="sod-order-total">
              <strong>Order Total</strong>
              <strong>${parseFloat(order.totalAmount).toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="sod-right-col">

          {/* Customer */}
          <div className="sod-section">
            <h2>👤 Customer</h2>
            <p><strong>{order.customer?.name || 'N/A'}</strong></p>
            <p>{order.customer?.email || ''}</p>
          </div>

          {/* Delivery */}
          <div className="sod-section">
            <h2>📍 Delivery Address</h2>
            <p>{addr.street || '—'}</p>
            <p>{addr.city}{addr.postalCode ? `, ${addr.postalCode}` : ''}</p>
          </div>

          {/* Payment */}
          <div className="sod-section">
            <h2>💳 Payment</h2>
            <p className="sod-payment-method">
              {order.paymentMethod?.charAt(0).toUpperCase() + order.paymentMethod?.slice(1)}
            </p>
            <p className={`sod-pay-status pay-${order.paymentStatus}`}>{order.paymentStatus}</p>
          </div>

          {/* Customer notes (S3-5) */}
          {order.customerNotes && (
            <div className="sod-section">
              <h2>📝 Customer Notes</h2>
              <p className="sod-notes">{order.customerNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Staff Actions */}
      {!isFinal && (
        <div className="sod-actions">
          <h2>⚙️ Actions</h2>
          <div className="sod-action-row">
            {/* S3-8: Confirm */}
            {order.status === 'pending' && (
              <button className="sod-btn sod-btn-confirm" onClick={() => handleStatusChange('confirmed')}>
                ✅ Confirm Order
              </button>
            )}
            {/* Progress through workflow */}
            {order.status === 'confirmed' && (
              <button className="sod-btn sod-btn-prepare" onClick={() => handleStatusChange('preparing')}>
                👨‍🍳 Mark as Preparing
              </button>
            )}
            {order.status === 'preparing' && (
              <button className="sod-btn sod-btn-ready" onClick={() => handleStatusChange('ready')}>
                🛍️ Mark as Ready
              </button>
            )}
            {order.status === 'ready' && (
              <button className="sod-btn sod-btn-deliver" onClick={() => handleStatusChange('delivered')}>
                🎉 Mark as Delivered
              </button>
            )}
            {/* S3-9: Cancel with reason (pending only) */}
            {order.status === 'pending' && (
              <button className="sod-btn sod-btn-cancel" onClick={() => { setShowCancel(true); setCancelReason(''); }}>
                ❌ Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cancel modal (S3-9) */}
      {showCancel && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancel(false)}>
          <div className="cancel-modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Order #{order.orderNumber}</h3>
            <p>Provide a reason. The customer will be notified by email.</p>
            <textarea
              className="cancel-reason-input"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="e.g. Item out of stock, kitchen closed..."
              rows={4}
              maxLength={500}
            />
            <small>{cancelReason.length}/500</small>
            <div className="cancel-modal-actions">
              <button className="sod-btn sod-btn-back" onClick={() => setShowCancel(false)}>Back</button>
              <button
                className="sod-btn sod-btn-cancel"
                onClick={handleStaffCancel}
                disabled={submitting || !cancelReason.trim()}
              >
                {submitting ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOrderDetail;
