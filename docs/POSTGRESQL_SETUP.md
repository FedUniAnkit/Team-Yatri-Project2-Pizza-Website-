# 🐘 PostgreSQL Setup Guide for Pizza Order App

## PostgreSQL Installation & Setup

### Option 1: Install PostgreSQL Locally (Recommended)

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or later
   - Run the installer

2. **During Installation**
   - Set password for `postgres` user (remember this!)
   - Default port: 5432
   - Install pgAdmin (database management tool)

3. **Create Database**
   ```sql
   -- Connect to PostgreSQL as postgres user
   CREATE DATABASE pizza_order_app;
   CREATE USER pizza_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE pizza_order_app TO pizza_user;
   ```

### Option 2: Use PostgreSQL Cloud Service

**Supabase (Free Tier)**
1. Visit: https://supabase.com
2. Create account and new project
3. Get connection details from Settings > Database

**ElephantSQL (Free Tier)**
1. Visit: https://www.elephantsql.com
2. Create account and new instance
3. Copy connection URL

## Environment Configuration

Create `.env` file in `/server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_NAME=pizza_order_app
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432

# For cloud databases, you can also use:
# DATABASE_URL=postgresql://username:password@host:port/database

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Email Configuration (optional for now)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Other settings...
CLIENT_URL=http://localhost:3000
```

## Quick Start Commands

1. **Install Dependencies** (already done)
   ```bash
   cd server && npm install
   cd ../client && npm install --legacy-peer-deps
   ```

2. **Setup Environment**
   ```bash
   cd server
   copy .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Start PostgreSQL Service**
   - Windows: Start via Services or pgAdmin
   - The service should auto-start after installation

4. **Seed Sample Data**
   ```bash
   cd server
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend  
   cd client
   npm start
   ```

## Database Schema

PostgreSQL will automatically create these tables:
- **Users** - Authentication and user profiles
- **Products** - Menu items with JSONB for sizes/ingredients
- **Orders** - Order management with JSONB for items/addresses

## Advantages of PostgreSQL

✅ **ACID Compliance** - Better data integrity
✅ **Advanced JSON Support** - JSONB for flexible data
✅ **Better Performance** - Optimized queries and indexing
✅ **Scalability** - Handles large datasets efficiently
✅ **SQL Standards** - Familiar query language
✅ **Rich Data Types** - Arrays, JSON, UUID support

## Sample Data Included

- **Admin**: admin@komorebi.com / admin123
- **Staff**: staff@komorebi.com / staff123  
- **Customer**: customer@example.com / customer123
- **7 Sample Products**: Pizzas, appetizers, drinks, desserts

## Troubleshooting

**Connection Issues:**
- Verify PostgreSQL service is running
- Check credentials in .env file
- Ensure database exists
- Check firewall settings

**Permission Issues:**
- Grant proper privileges to database user
- Check pg_hba.conf for authentication settings

**Port Conflicts:**
- Default PostgreSQL port is 5432
- Change DB_PORT in .env if needed

## Next Steps

Once PostgreSQL is set up and running:
1. Start both development servers
2. Visit http://localhost:3000
3. Test login with demo credentials
4. Begin implementing core features

Your Pizza Order App is now powered by PostgreSQL! 🍕🐘
