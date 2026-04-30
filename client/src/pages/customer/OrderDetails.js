import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import messageService from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await messageService.getMessages(id);
      setMessages(response.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

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
    fetchMessages();
  }, [id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-refresh when this order is updated via socket
  useEffect(() => {
    if (!socket) return;
    const handleOrderUpdated = (updated) => {
      if (updated.id === id) setOrder(updated);
    };
    socket.on('order_updated', handleOrderUpdated);
    const handleNewMessage = (msg) => {
      if (msg.orderId === id || msg.orderId?.toString() === id) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('new_message', handleNewMessage);
    socket.emit('join_order', id);
    return () => {
      socket.off('order_updated', handleOrderUpdated);
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, id]);

  const handleSendReply = async () => {
    if (!newMessage.trim()) return;
    setSendingMsg(true);
    try {
      // Find a staff/admin to reply to (use the last staff who messaged, or first available)
      const staffMsg = [...messages].reverse().find(m => m.Sender?.role === 'staff' || m.Sender?.role === 'admin');
      const receiverId = staffMsg?.senderId || staffMsg?.Sender?.id;
      if (!receiverId) {
        toast.error('No staff member to reply to yet.');
        setSendingMsg(false);
        return;
      }
      await messageService.sendMessage(id, {
        content: newMessage.trim(),
        receiverId,
      });
      setNewMessage('');
      fetchMessages();
      toast.success('Reply sent!');
    } catch (err) {
      toast.error('Failed to send reply.');
    } finally {
      setSendingMsg(false);
    }
  };

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

      {/* Messages Section */}
      {messages.length > 0 && (
        <div className="od-section od-messages-section">
          <h2>💬 Messages</h2>
          
          <div className="od-messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`od-message ${msg.Sender?.role === 'customer' ? 'od-msg-mine' : 'od-msg-staff'}`}
              >
                <div className="od-msg-header">
                  <strong>{msg.Sender?.name || 'Unknown'}</strong>
                  <span className="od-msg-role">{msg.Sender?.role === 'customer' ? 'You' : 'Staff'}</span>
                  <span className="od-msg-time">
                    {new Date(msg.createdAt).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <p className="od-msg-content">{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="od-message-input">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a reply to staff..."
              rows={2}
              maxLength={1000}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <div className="od-message-actions">
              <small>{newMessage.length}/1000</small>
              <button
                className="od-btn-reply"
                onClick={handleSendReply}
                disabled={sendingMsg || !newMessage.trim()}
                >
                {sendingMsg ? 'Sending...' : '💬 Reply'}
              </button>
            </div>
          </div>
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
