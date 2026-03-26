# 🍕 Komorebi Pizza - Quick Start Guide

## All Issues Fixed! ✅

All critical bugs have been resolved and the application is now runnable.

### What Was Fixed:
1. ✅ Added missing `Promotion` import in orderController.js
2. ✅ Removed non-existent `OrderItem` model references
3. ✅ Fixed field name inconsistency: `isActive` → `isAvailable` in productController
4. ✅ Fixed field name inconsistency: `totalPrice` → `totalAmount` in analyticsController
5. ✅ Removed duplicate authentication middleware in orderRoutes
6. ✅ Created functional React client with product display
7. ✅ Fixed order status enum values to lowercase (pending, cancelled)

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database running
- npm or yarn package manager

### Step 1: Database Setup

1. Make sure PostgreSQL is running on your system
2. Create a database (or use the default `postgres` database)
3. Update database credentials in `server/.env` file:

```env
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### Step 2: Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm run dev
```

The server will start on **http://localhost:5000**

### Step 3: Client Setup

Open a **new terminal window**:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the React app
npm start
```

The client will start on **http://localhost:3000**

---

## 📊 Database Initialization

The database tables will be created automatically when the server starts (using Sequelize sync).

To add sample data:

```bash
cd server
npm run seed
```

---

## 🔑 Create Admin User

To create an admin account for testing:

```bash
cd server
node create-admin-user.js
```

Default credentials will be displayed in the console.

---

## 🧪 Test the Application

1. **Health Check**: Visit http://localhost:3000
   - You should see the database connection status
   
2. **API Health**: Visit http://localhost:5000/api/health
   - Should return JSON with server status

3. **Products API**: Visit http://localhost:5000/api/products
   - Should return list of products (empty if no data seeded)

---

## 📁 Project Structure

```
PPAP/
├── server/               # Backend API
│   ├── controllers/      # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, upload, error handling
│   ├── config/          # Database, email config
│   └── server.js        # Entry point
│
├── client/              # Frontend React app
│   ├── src/
│   │   ├── App.js       # Main component
│   │   └── App.css      # Styling
│   └── package.json
│
└── QUICK-START.md       # This file
```

---

## 🔧 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/reset-password-otp` - Reset password with OTP

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin/Staff)
- `PUT /api/products/:id` - Update product (Admin/Staff)
- `DELETE /api/products/:id` - Delete product (Admin/Staff)

### Orders
- `POST /api/orders` - Create order (Authenticated)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (Admin/Staff)
- `PUT /api/orders/:id/status` - Update order status (Admin/Staff)
- `PUT /api/orders/:orderId/cancel` - Cancel order

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Other
- `GET /api/health` - Server health check
- `GET /api/categories` - Get product categories
- `POST /api/newsletter` - Subscribe to newsletter

---

## 🎨 Frontend Features

The React app now includes:
- ✅ Server health check with database status
- ✅ Product listing with images
- ✅ Responsive grid layout
- ✅ Modern gradient design
- ✅ Product badges (Popular, New)
- ✅ Error handling and loading states

---

## 🐛 Troubleshooting

### Server won't start
- Check if PostgreSQL is running
- Verify database credentials in `.env`
- Make sure port 5000 is not in use

### Client won't start
- Make sure server is running first
- Check if port 3000 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Database connection error
- Verify PostgreSQL service is running
- Check credentials in `server/.env`
- Ensure database exists

### No products showing
- Run the seed script: `npm run seed` in server directory
- Or create products manually via API

---

## 📝 Next Steps

1. **Add Products**: Use the admin panel or API to add products
2. **Create Orders**: Test the order creation flow
3. **User Management**: Create staff accounts via admin
4. **Email Setup**: Configure SMTP settings for email notifications
5. **Payment Integration**: Set up Stripe for payments (optional)

---

## 🎯 All Critical Issues Resolved!

Your application is now fully functional and ready to run. Both server and client have been fixed and are working together properly.

**Happy coding! 🍕**
