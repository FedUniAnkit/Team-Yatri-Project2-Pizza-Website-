import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';
import './MyOrders.css';

const STATUS_LABELS = {
  pending:   { label: 'Preparing Your Order', color: '#f39c12' },
  confirmed: { label: 'Confirmed',            color: '#3498db' },
  preparing: { label: 'Being Prepared',       color: '#9b59b6' },
  ready:     { label: 'Ready for Pickup',     color: '#1abc9c' },
  delivered: { label: 'Delivered',            color: '#27ae60' },
  cancelled: { label: 'Cancelled',            color: '#e74c3c' },
};

const MyOrders = () => {
  const socket = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();
        setOrders(response.data || []);
      } catch (err) {
        setError('Failed to fetch your order history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Live-update order status in the list
  useEffect(() => {
    if (!socket) return;
    const handleOrderUpdated = (updated) => {
      setOrders(prev => prev.map(o => o.id === updated.id ? { ...o, status: updated.status } : o));
    };
    socket.on('order_updated', handleOrderUpdated);
    return () => socket.off('order_updated', handleOrderUpdated);
  }, [socket]);

  if (loading) return <div className="my-orders-loading">Loading your orders...</div>;
  if (error)   return <div className="my-orders-error">{error}</div>;

  return (
    <div className="my-orders-container">
      <div className="my-orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your pizza orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">🍕</div>
          <h2>No orders yet</h2>
          <p>Looks like you haven't placed any orders yet.</p>
          <Link to="/menu" className="btn-order-now">Order Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: '#95a5a6' };
            const itemCount = Array.isArray(order.items) ? order.items.reduce((s, i) => s + i.quantity, 0) : 0;
            return (
              <div key={order.id} className="order-history-card">
                <div className="order-card-header">
                  <div>
                    <h3 className="order-number">#{order.orderNumber}</h3>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <span className="status-badge" style={{ background: statusInfo.color }}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="order-meta">
                    <span>🍕 {itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                    <span>💳 {order.paymentMethod?.charAt(0).toUpperCase() + order.paymentMethod?.slice(1)}</span>
                  </div>
                  {order.customerNotes && (
                    <p className="order-notes">📝 {order.customerNotes}</p>
                  )}
                </div>

                <div className="order-card-footer">
                  <span className="order-total">${parseFloat(order.totalAmount).toFixed(2)}</span>
                  <Link to={`/orders/${order.id}`} className="btn-view-order">View Details →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
