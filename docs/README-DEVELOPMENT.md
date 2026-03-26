# 🍕 Pizza Order App - Development Setup Guide

## Quick Start (Automated)

### Option 1: Run the automated setup script
```powershell
# Run this in PowerShell (as Administrator recommended)
PowerShell -ExecutionPolicy Bypass -File quick-setup.ps1
```

### Option 2: Use the batch file
```cmd
# Double-click or run in Command Prompt
start-dev.bat
```

## Manual Setup

### 1. Install Node.js
- Visit: https://nodejs.org/
- Download the **LTS version** (recommended)
- Run the installer
- Restart your terminal/PowerShell

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install --legacy-peer-deps
```

### 3. Environment Setup
The `.env` file has been automatically created in the `server` directory with default values.

**Important:** Update these values in `server/.env`:
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Change to a secure random string
- `SESSION_SECRET` - Change to a secure random string

### 4. Database Setup
Choose one option:

#### Option A: Local PostgreSQL
1. Install PostgreSQL from: https://www.postgresql.org/download/
2. Create database: `pizza_order_app`
3. Update `server/.env` with your credentials
4. Run: `cd server && npm run seed`

#### Option B: Cloud Database (Easier)
1. **Supabase** (Free): https://supabase.com
2. **ElephantSQL** (Free): https://www.elephantsql.com
3. Get connection URL and update `server/.env`

### 5. Start Development Servers

#### Method 1: Automated (Recommended)
```powershell
PowerShell -ExecutionPolicy Bypass -File quick-setup.ps1
```

#### Method 2: Manual
```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend Server  
cd client
npm start
```

## Access Your App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Default Login Credentials

- **Admin**: admin@komorebi.com / admin123
- **Staff**: staff@komorebi.com / staff123
- **Customer**: customer@example.com / customer123

## Troubleshooting

### Node.js Not Found
```powershell
# Try automated installation
PowerShell -ExecutionPolicy Bypass -File install-nodejs.ps1
```

### Port Already in Use
- Backend (5000): Change `PORT` in `server/.env`
- Frontend (3000): It will prompt for alternative port

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check credentials in `server/.env`
3. Ensure database `pizza_order_app` exists

## Project Structure

```
PPAP-main/
├── client/          # React frontend
├── server/          # Node.js backend
├── database/        # Database schemas
├── docs/           # Documentation
├── start-dev.bat   # Windows batch startup
├── quick-setup.ps1 # PowerShell setup script
└── install-nodejs.ps1 # Node.js installer
```

## Development Commands

```bash
# Backend
npm run dev      # Start with nodemon
npm run start    # Start production
npm run seed     # Seed sample data

# Frontend  
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## Next Steps

1. Install Node.js (if not done)
2. Run setup script: `quick-setup.ps1`
3. Open http://localhost:3000
4. Start developing! 🚀

---

**Need help?** Check the detailed setup guide in `client/POSTGRESQL_SETUP.md`
