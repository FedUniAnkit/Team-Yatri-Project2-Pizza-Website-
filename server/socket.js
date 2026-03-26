const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Room for staff members to receive order notifications
    socket.on('join_staff_room', () => {
      socket.join('staff_room');
      console.log(`Socket ${socket.id} joined staff_room`);
    });

    // Personal room for customers to receive their own order updates
    socket.on('join_customer_room', (customerId) => {
      socket.join(`customer_${customerId}`);
      console.log(`Socket ${socket.id} joined customer_${customerId}`);
    });

    // Room for order-specific messaging
    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Socket ${socket.id} joined room for order ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
