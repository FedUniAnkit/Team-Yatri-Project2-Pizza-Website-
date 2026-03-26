import { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const STATUS_MESSAGES = {
  confirmed: '✅ Your order has been confirmed!',
  preparing: '👨‍🍳 Your order is being prepared.',
  ready:     '🛍️ Your order is ready for pickup!',
  delivered: '🎉 Your order has been delivered!',
  cancelled: '❌ Your order has been cancelled.',
};

const NotificationHandler = () => {
  const socket = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    // Staff: new order placed
    const handleNewOrder = (order) => {
      toast.info(`🍕 New order #${order.orderNumber} has been placed!`, {
        onClick: () => navigate('/staff/orders'),
        autoClose: 8000,
      });
    };

    // All roles: order status updated
    const handleOrderUpdated = (order) => {
      if (user?.role === 'customer') {
        const msg = STATUS_MESSAGES[order.status];
        if (msg) {
          toast[order.status === 'cancelled' ? 'error' : 'success'](
            `${msg} Order #${order.orderNumber}`,
            {
              onClick: () => navigate(`/orders/${order.id}`),
              autoClose: 8000,
            }
          );
        }
      } else if (user?.role === 'staff' || user?.role === 'admin') {
        toast.info(`Order #${order.orderNumber} updated to "${order.status}".`, {
          onClick: () => navigate(`/staff/orders/${order.id}`),
          autoClose: 5000,
        });
      }
    };

    socket.on('new_order',     handleNewOrder);
    socket.on('order_updated', handleOrderUpdated);

    return () => {
      socket.off('new_order',     handleNewOrder);
      socket.off('order_updated', handleOrderUpdated);
    };
  }, [socket, user, navigate]);

  return null;
};

export default NotificationHandler;
