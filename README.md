<<<<<<< HEAD
# Pizza Order App - Komorebi

A comprehensive web-based pizza ordering system for Komorebi Pizza Shop with separate interfaces for customers, staff, and administrators.

## 🍕 Project Overview

This project replaces expensive third-party ordering apps with a custom solution that provides:
- **Cost savings** - No service fees to external platforms
- **Better control** - Custom discounts and promotions
- **Improved efficiency** - Streamlined order management
- **Enhanced customer experience** - Direct communication with the restaurant

## 👥 User Roles

### 1. **Admin Users**
- Create, deactivate, reactivate, and remove users
- Update user information and reset passwords
- Create, update, and delete website content
- Send emails to users
- Search, filter, and sort information
- View analytics dashboards (sales: weekly, monthly, yearly)
- Product analytics and reporting

### 2. **Staff Users**
- Sign-in/Sign-out functionality
- Reset their own passwords
- View and manage all orders
- View/add products to the system
- Confirm or cancel orders
- Save orders as PDF files
- Send messages to customers
- Receive notifications for new orders

### 3. **Registered Customers**
- Sign-in/Sign-out functionality
- Update personal information
- Browse all available products
- Modify products in cart
- View shopping cart
- Process payments securely
- Place, cancel, and confirm orders
- Send notes/messages to restaurant

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Chart.js** - Analytics visualization
- **Socket.io Client** - Real-time notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email functionality
- **Stripe** - Payment processing
- **Socket.io** - Real-time communication

## 📁 Project Structure

```
PPAP-main/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React Context
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Express Backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── services/        # Business logic
├── database/            # Database files
├── docs/               # Documentation
└── tests/              # Test files
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PPAP-main
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   ```bash
   cd ../server
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm start
   ```

## 📋 Development Roadmap

### Phase 1: Foundation (Week 1)
- [x] Project structure setup
- [x] Database models and configuration
- [x] Authentication system
- [ ] Basic API endpoints

### Phase 2: Core Backend (Week 2-3)
- [ ] User management APIs
- [ ] Product management APIs
- [ ] Order management APIs
- [ ] File upload functionality

### Phase 3: Frontend Development (Week 4-6)
- [ ] Authentication UI
- [ ] Customer interface
- [ ] Staff dashboard
- [ ] Admin panel

### Phase 4: Advanced Features (Week 7-8)
- [ ] Payment integration
- [ ] Real-time notifications
- [ ] Analytics dashboards
- [ ] Email system

### Phase 5: Testing & Deployment (Week 9-10)
- [ ] Testing suite
- [ ] Documentation
- [ ] Deployment setup
- [ ] User training materials

## 🔧 Available Scripts

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Client
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 📚 API Documentation

API documentation will be available at `/docs/api-documentation.md` once development is complete.

## 🤝 Contributing

This is an academic project for Komorebi Pizza Shop. Please follow the development roadmap and maintain code quality standards.

## 📄 License

This project is developed for educational purposes as part of a web development assignment.

## 📞 Support

For technical support or questions about the project, please refer to the user manual in `/docs/user-manual.md`.

---

**Project Status**: 🚧 In Development
**Last Updated**: August 2025
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> 17b6b78ae3a10d98668a230b1be3eac3aa41b877

// test comment
