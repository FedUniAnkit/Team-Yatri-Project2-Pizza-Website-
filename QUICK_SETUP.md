# Quick Setup Guide - Recent Features

## Database Migration Required? 

| Feature | Database Update? | Action Required |
|---------|-----------------|-----------------|
| 🔵 **Stripe Payment Gateway** | ✅ **YES** | Run migration SQL |
| 🟢 **Staff Email Notifications** | ❌ **NO** | No action needed |

---

## Quick Migration Command

### If you have existing data:

```bash
# Navigate to project root
cd c:\Users\sunth\PPAP

# Run migration
psql -U postgres -d your_database_name -f server/migrations/add-stripe-payment-intent-id.sql
```

### If starting fresh (⚠️ DELETES ALL DATA):

```bash
# Recreate database
psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS your_database_name;"
psql -U postgres -d postgres -c "CREATE DATABASE your_database_name;"
psql -U postgres -d your_database_name -f schema.sql

# Seed sample data
cd server
npm run seed
```

---

## Environment Variables Setup

### Server (.env)
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (for staff notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Client (.env)
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## Verification Steps

### 1. Verify Database Migration
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'Orders' AND column_name = 'stripePaymentIntentId';
```
Should return: `stripePaymentIntentId`

### 2. Test Stripe Payment
1. Add items to cart
2. Go to checkout
3. Select "Online Payment"
4. Use test card: `4242 4242 4242 4242`
5. Complete payment

### 3. Test Staff Notifications
1. Ensure you have a staff user: `role = 'staff'` or `'admin'`
2. Place an order as a customer
3. Check staff email inbox for notification

---

## What Was Added?

### Stripe Payment Gateway
- ✅ Payment controller and routes
- ✅ Stripe checkout components (React)
- ✅ Payment service (client)
- ✅ Database column: `stripePaymentIntentId`
- ✅ Webhook handler
- ✅ Documentation: `STRIPE_SETUP.md`

### Staff Email Notifications
- ✅ Email template: `staff-new-order.ejs`
- ✅ Email service function
- ✅ Order controller integration
- ✅ Documentation: `STAFF_NOTIFICATIONS.md`

---

## Documentation Files

- 📄 `STRIPE_SETUP.md` - Complete Stripe integration guide
- 📄 `STAFF_NOTIFICATIONS.md` - Staff notification details
- 📄 `DATABASE_MIGRATION_GUIDE.md` - Detailed migration instructions
- 📄 `QUICK_SETUP.md` - This file

---

## Need Help?

1. **Database issues**: See `DATABASE_MIGRATION_GUIDE.md`
2. **Stripe setup**: See `STRIPE_SETUP.md`
3. **Email notifications**: See `STAFF_NOTIFICATIONS.md`
