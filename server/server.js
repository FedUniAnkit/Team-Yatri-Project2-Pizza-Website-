const express = require('express');
const http = require('http');
const path = require('path');
const { initSocket } = require('./socket');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/database');
require('./models'); // Initialize models and associations
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const promotionRoutes = require('./routes/promotionRoutes');
const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const newsletterRoutes = require('./routes/newsletter');
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const promoCodeRoutes = require('./routes/promoCodeRoutes');
const promoBannerRoutes = require('./routes/promoBannerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Global crash handlers - log before exit so Render shows the error
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message, err.stack);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// Connect to database
connectDB();

// Security middleware (allow cross-origin resource policy so frontend (3000) can load images from API (5000))
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com'],
      scriptSrcElem: ["'self'", 'https://js.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
      connectSrc: ["'self'", 'https://api.stripe.com', 'https://m.stripe.network'],
      imgSrc: ["'self'", 'data:', 'https://*.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    )) {
      return callback(null, true);
    }
    
    console.log('CORS blocked for origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting - DISABLED FOR DEVELOPMENT
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000 // Higher limit for development
// });
// app.use(limiter);

// Stripe webhook route (must be before body parsing middleware)
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }), paymentRoutes);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.text({ limit: '50mb' }));
app.use(express.raw({ limit: '50mb' }));

// Static files - serve uploads with absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/promo-banner', promoBannerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);

// Simple ping route to verify /api/upload is reachable
app.get('/api/upload/ping', (req, res) => res.json({ success: true, message: 'upload base ok' }));
console.log('[BOOT] Mounting /api/upload routes...');
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check route with DB connectivity status
app.get('/api/health', async (req, res) => {
  let dbStatus = {
    connected: false,
    error: null
  };

  try {
    await sequelize.authenticate({
      // short timeout safeguard; if not supported, default driver timeout applies
      // Note: pg does not use this option directly; kept for future compatibility
    });
    dbStatus.connected = true;
  } catch (err) {
    dbStatus.connected = false;
    dbStatus.error = err?.message || 'Unknown DB error';
  }

  res.json({ 
    success: true, 
    message: 'Pizza Order API is running!',
    timestamp: new Date().toISOString(),
    db: dbStatus
  });
});

// Error handling middleware
app.use(errorHandler);

// SPA fallback - serve index.html for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // Don't handle API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // Handle 404 in development
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

server.listen(PORT, () => {
  console.log(`🍕 Pizza Order Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});