import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import './StaffOrders.css';

const STATUS_CONFIG = {
  pending:   { label: 'Preparing',       color: '#f39c12' },
  confirmed: { label: 'Confirmed',       color: '#3498db' },
  preparing: { label: 'Being Prepared',  color: '#9b59b6' },
  ready:     { label: 'Ready',           color: '#1abc9c' },
  delivered: { label: 'Delivered',       color: '#27ae60' },
  cancelled: { label: 'Cancelled',       color: '#e74c3c' },
};

const StaffOrders = () => {
  const socket = useSocket();
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [filterStatus, setFilter]     = useState('');
  const [cancelModal, setCancelModal] = useState(null); // { orderId, orderNumber }
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Live-update the list when orders arrive or change
  useEffect(() => {
    if (!socket) return;
    const handleNewOrder = (order) => {
      setOrders(prev => [order, ...prev.filter(o => o.id !== order.id)]);
    };
    const handleOrderUpdated = (order) => {
      setOrders(prev => prev.map(o => o.id === order.id ? order : o));
    };
    socket.on('new_order',     handleNewOrder);
    socket.on('order_updated', handleOrderUpdated);
    return () => {
      socket.off('new_order',     handleNewOrder);
      socket.off('order_updated', handleOrderUpdated);
    };
  }, [socket]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const openCancelModal = (order) => {
    setCancelModal({ orderId: order.id, orderNumber: order.orderNumber });
    setCancelReason('');
  };

  const handleStaffCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please enter a cancellation reason.');
      return;
    }
    setSubmitting(true);
    try {
      await orderService.cancelOrderByStaff(cancelModal.orderId, cancelReason);
      toast.success('Order cancelled and customer notified.');
      setCancelModal(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayed = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders;

  return (
    <div className="staff-orders-container">
      <div className="staff-orders-header">
        <h1>Order Management</h1>
        <span className="order-count">{displayed.length} order{displayed.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Status filter (S3-7) */}
      <div className="orders-filter-bar">
        <span className="filter-label">Filter by status:</span>
        {['', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(s => (
          <button
            key={s}
            className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === '' ? 'All' : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      {loading && <div className="so-loading">Loading orders...</div>}
      {error   && <div className="so-error">{error}</div>}

      {!loading && !error && (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date &amp; Time</th>
                <th>Items</th>
                <th>Total</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan="8" className="no-orders-row">No orders found.</td></tr>
              ) : displayed.map(order => {
                const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: '#95a5a6' };
                const itemCount = Array.isArray(order.items) ? order.items.reduce((s, i) => s + i.quantity, 0) : 0;
                const isFinal = ['delivered','cancelled'].includes(order.status);
                return (
                  <tr key={order.id} className={`order-row order-row-${order.status}`}>
                    <td className="order-num-cell">
                      <span className="order-num">{order.orderNumber}</span>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{order.customer?.name || 'N/A'}</span>
                        <span className="customer-email">{order.customer?.email || ''}</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(order.createdAt).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="center">{itemCount}</td>
                    <td className="total-cell">${parseFloat(order.totalAmount).toFixed(2)}</td>
                    <td className="notes-cell">
                      {order.customerNotes
                        ? <span title={order.customerNotes} className="has-notes">📝</span>
                        : <span className="no-notes">—</span>}
                    </td>
                    <td>
                      {isFinal ? (
                        <span className="status-pill" style={{ background: cfg.color }}>{cfg.label}</span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className="status-select"
                          style={{ borderColor: cfg.color }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([val, c]) => (
                            <option key={val} value={val}>{c.label}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="actions-cell">
                      {/* S3-8: Quick confirm */}
                      {order.status === 'pending' && (
                        <button
                          className="so-btn so-btn-confirm"
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                        >✅ Confirm</button>
                      )}
                      {/* S3-9: Cancel with reason (pending only) */}
                      {order.status === 'pending' && (
                        <button
                          className="so-btn so-btn-cancel"
                          onClick={() => openCancelModal(order)}
                        >❌ Cancel</button>
                      )}
                      <Link to={`/staff/orders/${order.id}`} className="so-btn so-btn-details">
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel with Reason Modal (S3-9) */}
      {cancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setCancelModal(null)}>
          <div className="cancel-modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Order #{cancelModal.orderNumber}</h3>
            <p>Please provide a reason for cancellation. The customer will be notified by email.</p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="e.g. Item out of stock, kitchen closed, etc."
              rows={4}
              maxLength={500}
              className="cancel-reason-input"
            />
            <small>{cancelReason.length}/500</small>
            <div className="cancel-modal-actions">
              <button className="so-btn so-btn-details" onClick={() => setCancelModal(null)}>
                Back
              </button>
              <button
                className="so-btn so-btn-cancel"
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

export default StaffOrders;
