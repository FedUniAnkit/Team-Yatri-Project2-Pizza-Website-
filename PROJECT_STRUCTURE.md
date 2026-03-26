# 🍕 Komorebi Pizza - Clean Project Structure

**Last Updated:** March 22, 2026  
**Status:** Production Ready ✅

---

## 📁 Project Structure

```
PPAP/
├── 📄 .env                          # Environment variables (git-ignored)
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # Main project documentation
├── 📄 PROJECT_STATUS.md             # Current project status
├── 📄 QUICK-START.md                # Quick start guide
├── 📄 FIXES_COMPLETED.md            # Recent fixes documentation
├── 📄 FUNCTIONALITY_TEST_REPORT.md  # Test results report
├── 📄 package.json                  # Root package config
├── 📄 package-lock.json             # Root dependencies lock
│
├── 📂 client/                       # React Frontend Application
│   ├── 📄 package.json              # Frontend dependencies
│   ├── 📄 package-lock.json         # Frontend lock file
│   ├── 📄 README.md                 # Frontend documentation
│   ├── 📄 .gitignore                # Frontend git ignore
│   │
│   ├── 📂 public/                   # Static public assets
│   │   ├── index.html               # HTML template
│   │   ├── favicon.ico              # Site favicon
│   │   ├── logo192.png              # PWA logo
│   │   ├── logo512.png              # PWA logo
│   │   ├── manifest.json            # PWA manifest
│   │   └── robots.txt               # SEO robots file
│   │
│   ├── 📂 src/                      # React source code
│   │   ├── 📄 index.js              # App entry point
│   │   ├── 📄 index.css             # Global styles
│   │   ├── 📄 App.js                # Main App component
│   │   ├── 📄 App.css               # App styles
│   │   ├── 📄 reportWebVitals.js    # Performance monitoring
│   │   │
│   │   ├── 📂 assets/               # Images, fonts, etc. (70+ files)
│   │   │   ├── logo.jpg
│   │   │   ├── pizza-*.jpg
│   │   │   ├── burger-*.jpg
│   │   │   ├── pasta-*.jpg
│   │   │   └── ... (all images)
│   │   │
│   │   ├── 📂 components/           # Reusable components
│   │   │   ├── 📂 common/           # Shared components
│   │   │   │   ├── Navbar.js        # Navigation bar
│   │   │   │   ├── Navbar.css
│   │   │   │   ├── Footer.js        # Footer component
│   │   │   │   ├── Footer.css
│   │   │   │   ├── ProtectedRoute.js
│   │   │   │   └── NotificationHandler.js
│   │   │   │
│   │   │   ├── 📂 chat/             # Chat components
│   │   │   │   ├── ChatBox.js
│   │   │   │   └── ChatBox.css
│   │   │   │
│   │   │   └── 📂 user/             # User components
│   │   │       └── UserSettings.css
│   │   │
│   │   ├── 📂 context/              # React Context providers
│   │   │   ├── AuthContext.js       # Authentication state
│   │   │   ├── CartContext.js       # Shopping cart state
│   │   │   └── SocketContext.js     # WebSocket connection
│   │   │
│   │   ├── 📂 pages/                # Page components
│   │   │   ├── Home.js              # Homepage
│   │   │   ├── Home.css
│   │   │   ├── Menu.js              # Menu page
│   │   │   ├── Menu.css
│   │   │   ├── Cart.js              # Shopping cart
│   │   │   ├── Cart.css
│   │   │   ├── Checkout.js          # Checkout page
│   │   │   ├── Checkout.css
│   │   │   ├── NotFound.js          # 404 page
│   │   │   ├── NotFound.css
│   │   │   ├── Unauthorized.js      # 403 page
│   │   │   │
│   │   │   ├── 📂 auth/             # Authentication pages
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   │   ├── ForgotPassword.js
│   │   │   │   ├── ResetPassword.js
│   │   │   │   ├── RequirePasswordReset.js
│   │   │   │   ├── RequirePasswordReset.css
│   │   │   │   └── Auth.css
│   │   │   │
│   │   │   ├── 📂 customer/         # Customer dashboard
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Dashboard.css
│   │   │   │   ├── MyOrders.js
│   │   │   │   ├── MyOrders.css
│   │   │   │   ├── OrderDetails.js
│   │   │   │   └── OrderDetails.css
│   │   │   │
│   │   │   ├── 📂 staff/            # Staff dashboard
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── StaffOrders.js
│   │   │   │   ├── StaffOrders.css
│   │   │   │   ├── StaffOrderDetail.js
│   │   │   │   ├── StaffOrderDetail.css
│   │   │   │   ├── StaffProducts.js
│   │   │   │   └── StaffProducts.css
│   │   │   │
│   │   │   ├── 📂 admin/            # Admin dashboard
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── AdminDashboard.css
│   │   │   │   ├── AdminUsers.js
│   │   │   │   ├── AdminUsers.css
│   │   │   │   ├── AdminPromotions.js
│   │   │   │   ├── AdminPromotions.css
│   │   │   │   ├── AdminAnalytics.js
│   │   │   │   ├── AdminAnalytics.css
│   │   │   │   ├── AdminContent.js
│   │   │   │   ├── AdminContent.css
│   │   │   │   ├── AdminNewsletter.js
│   │   │   │   └── AdminNewsletter.css
│   │   │   │
│   │   │   └── 📂 user/             # User settings
│   │   │       ├── Settings.js
│   │   │       └── UserSettings.css
│   │   │
│   │   └── 📂 services/             # API service layer
│   │       ├── api.js               # Axios instance
│   │       ├── authService.js       # Auth API calls
│   │       ├── productService.js    # Product API calls
│   │       ├── orderService.js      # Order API calls
│   │       ├── userService.js       # User API calls
│   │       ├── promotionService.js  # Promotion API calls
│   │       ├── contentService.js    # Content API calls
│   │       ├── messageService.js    # Message API calls
│   │       ├── newsletterService.js # Newsletter API calls
│   │       └── analyticsService.js  # Analytics API calls
│   │
│   └── 📂 node_modules/             # Frontend dependencies (git-ignored)
│
├── 📂 server/                       # Node.js Backend Application
│   ├── 📄 package.json              # Backend dependencies
│   ├── 📄 package-lock.json         # Backend lock file
│   ├── 📄 server.js                 # Main server file
│   ├── 📄 socket.js                 # Socket.IO configuration
│   ├── 📄 .env                      # Environment variables (git-ignored)
│   ├── 📄 .env.example              # Environment template
│   │
│   ├── 📂 config/                   # Configuration files
│   │   ├── database.js              # Sequelize database config
│   │   ├── email.js                 # Nodemailer email config
│   │   └── auth.js                  # JWT auth config
│   │
│   ├── 📂 models/                   # Sequelize models
│   │   ├── index.js                 # Model associations
│   │   ├── User.js                  # User model
│   │   ├── Product.js               # Product model
│   │   ├── Order.js                 # Order model
│   │   ├── Category.js              # Category model
│   │   ├── Promotion.js             # Promotion model
│   │   ├── Message.js               # Message model
│   │   ├── ContentBlock.js          # CMS content model
│   │   ├── NewsletterSubscription.js # Newsletter model
│   │   └── CustomizationOption.js   # Customization model
│   │
│   ├── 📂 controllers/              # Route controllers
│   │   ├── authController.js        # Authentication logic
│   │   ├── userController.js        # User management
│   │   ├── productController.js     # Product management
│   │   ├── orderController.js       # Order management
│   │   ├── categoryController.js    # Category management
│   │   ├── promotionController.js   # Promotion management
│   │   ├── messageController.js     # Messaging logic
│   │   ├── contentController.js     # CMS content
│   │   ├── newsletterController.js  # Newsletter management
│   │   └── analyticsController.js   # Analytics & reports
│   │
│   ├── 📂 routes/                   # API routes
│   │   ├── auth.js                  # /api/auth routes
│   │   ├── userRoutes.js            # /api/users routes
│   │   ├── productRoutes.js         # /api/products routes
│   │   ├── orderRoutes.js           # /api/orders routes
│   │   ├── categoryRoutes.js        # /api/categories routes
│   │   ├── promotionRoutes.js       # /api/promotions routes
│   │   ├── messageRoutes.js         # /api/messages routes
│   │   ├── contentRoutes.js         # /api/content routes
│   │   ├── newsletter.js            # /api/newsletter routes
│   │   ├── analyticsRoutes.js       # /api/analytics routes
│   │   └── uploadRoutes.js          # /api/upload routes
│   │
│   ├── 📂 middleware/               # Express middleware
│   │   ├── auth.js                  # Authentication & authorization
│   │   ├── errorHandler.js          # Error handling
│   │   └── upload.js                # File upload (multer)
│   │
│   ├── 📂 utils/                    # Utility functions
│   │   └── emailService.js          # Email templates & sending
│   │
│   ├── 📂 email-templates/          # EJS email templates
│   │   ├── password-reset.ejs       # Password reset email
│   │   ├── password-reset-by-admin.ejs # Admin password reset
│   │   ├── otp-email.ejs            # OTP verification email
│   │   ├── staff-invitation.ejs     # Staff invitation email
│   │   ├── order-confirmation.ejs   # Order confirmation
│   │   └── newsletter.ejs           # Newsletter template
│   │
│   ├── 📂 seeders/                  # Database seeders
│   │   └── sampleData.js            # Sample data script
│   │
│   ├── 📂 scripts/                  # Utility scripts
│   │   └── seedCategories.js        # Seed categories
│   │
│   ├── 📂 migrations/               # Database migrations
│   │   ├── 001-add-staff-fields.js
│   │   └── 002-create-categories-table.js
│   │
│   ├── 📂 uploads/                  # User uploaded files (git-ignored)
│   │
│   └── 📂 node_modules/             # Backend dependencies (git-ignored)
│
└── 📂 docs/                         # Documentation
    ├── POSTGRESQL_SETUP.md          # PostgreSQL setup guide
    ├── SETUP.md                     # General setup guide
    ├── README-DEVELOPMENT.md        # Development guide
    ├── api-documentation.md         # API documentation
    ├── installation-guide.md        # Installation guide
    └── user-manual.md               # User manual
```

---

## 🗂️ File Organization

### **Root Level**
- Configuration files (`.env`, `.gitignore`)
- Documentation (README, guides, reports)
- Package management (`package.json`)

### **Client Folder**
- Complete React application
- All frontend code, assets, and components
- Self-contained with own dependencies

### **Server Folder**
- Complete Node.js/Express backend
- Database models, controllers, routes
- Email templates and utilities
- Self-contained with own dependencies

### **Docs Folder**
- All setup and development guides
- API documentation
- User manuals

---

## 🧹 Cleaned Up Files

### **Removed:**
- ❌ Duplicate `src/` folder (was duplicate of `client/src/`)
- ❌ Temporary SQL files (`add-otp-columns.sql`, `add-staff-columns.sql`, etc.)
- ❌ Temporary setup scripts (`install-nodejs.ps1`, `quick-setup.ps1`, `start-dev.bat`)
- ❌ Duplicate seed files (`seed-data.sql`, `komorebi-menu-seed-data.sql`, `complete-database-schema.sql`)
- ❌ Temporary JS files (`add-otp-columns-simple.js`, `create-admin-user.js`)
- ❌ Workspace files (`pizzaweb.code-workspace`)
- ❌ Template files (`.env.template` - kept `.env.example`)

### **Organized:**
- ✅ Moved setup guides to `docs/` folder
- ✅ Kept only essential documentation in root
- ✅ Maintained clean separation of client/server code

---

## 📊 Project Statistics

- **Total Files:** ~200 source files (excluding node_modules)
- **Frontend Components:** 40+ React components
- **Backend Routes:** 11 route modules
- **Database Models:** 9 models
- **API Endpoints:** 50+ endpoints
- **Documentation:** 10+ markdown files

---

## 🚀 Quick Commands

### **Development**
```bash
# Start backend server
cd server
npm run dev

# Start frontend (in new terminal)
cd client
npm start

# Seed database
cd server
npm run seed
```

### **Production**
```bash
# Build frontend
cd client
npm run build

# Start backend
cd server
npm start
```

---

## ✅ Project Status

- **Code Quality:** Clean, organized, no duplicates ✅
- **Documentation:** Complete and up-to-date ✅
- **Dependencies:** All installed and working ✅
- **Database:** Seeded with sample data ✅
- **Tests:** All functionality verified ✅
- **Ready for:** Development & Production ✅

---

**Last Cleanup:** March 22, 2026  
**Project State:** Production Ready 🎉
