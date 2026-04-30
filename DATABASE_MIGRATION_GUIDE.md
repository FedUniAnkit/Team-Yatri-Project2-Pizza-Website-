# Database Migration Guide

## Overview

This guide covers the database changes needed for the recent feature implementations.

## Features and Database Requirements

### ✅ Task 1: Stripe Payment Gateway Integration
**Database Update Required: YES**

### ❌ Task 2: Staff Email Notifications
**Database Update Required: NO** (uses existing columns)

---

## Migration for Stripe Payment Gateway

### What Changed?

Added a new column to the `Orders` table to store Stripe payment intent IDs.

### Column Details

- **Table**: `Orders`
- **Column**: `stripePaymentIntentId`
- **Type**: `VARCHAR(255)`
- **Nullable**: `YES`
- **Purpose**: Store Stripe payment intent ID for tracking online payments

### Migration Options

You have **two options** to update your database:

---

## Option 1: Run Migration SQL File (Recommended)

### For Existing Database

If you already have data in your database, use the migration file:

```bash
# Navigate to server directory
cd server

# Run the migration
psql -U your_username -d your_database_name -f migrations/add-stripe-payment-intent-id.sql
```

**Or using environment variables:**

```bash
psql -U $DB_USER -d $DB_NAME -f migrations/add-stripe-payment-intent-id.sql
```

### What the Migration Does

1. Adds `stripePaymentIntentId` column to Orders table
2. Creates an index for faster lookups
3. Adds documentation comment
4. Verifies the column was added successfully

### Migration File Location

```
server/migrations/add-stripe-payment-intent-id.sql
```

---

## Option 2: Recreate Database from Schema (Clean Install)

### ⚠️ WARNING: This will DELETE all existing data!

If you're starting fresh or don't need existing data:

```bash
# Drop and recreate the database
psql -U your_username -d postgres -c "DROP DATABASE IF EXISTS your_database_name;"
psql -U your_username -d postgres -c "CREATE DATABASE your_database_name;"

# Run the updated schema
psql -U your_username -d your_database_name -f schema.sql

# Optionally, seed with sample data
cd server
npm run seed
```

---

## Verification

### Check if Migration Succeeded

Run this SQL query to verify the column exists:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Orders' 
AND column_name = 'stripePaymentIntentId';
```

**Expected Output:**
```
     column_name      | data_type | is_nullable
----------------------+-----------+-------------
 stripePaymentIntentId | character varying | YES
```

### Check the Index

```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'Orders' 
AND indexname = 'idx_orders_stripe_payment_intent';
```

**Expected Output:**
```
          indexname           |                    indexdef
------------------------------+------------------------------------------------
 idx_orders_stripe_payment_intent | CREATE INDEX idx_orders_stripe_payment_intent...
```

---

## Manual Migration (Alternative)

If you prefer to run the SQL commands manually:

```sql
-- Add the column
ALTER TABLE "Orders" 
ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" VARCHAR(255);

-- Add the index
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent 
ON "Orders"("stripePaymentIntentId");

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Orders' 
AND column_name = 'stripePaymentIntentId';
```

---

## Staff Email Notifications - No Migration Needed

The staff email notification feature uses existing database columns:

### Existing Columns Used:
- `Users.role` - Already supports 'staff' and 'admin'
- `Users.isActive` - Already exists
- `Users.email` - Already exists
- `Users.name` - Already exists

### No Changes Required ✅

---

## Database Schema Updates

The main schema file has been updated:
- **File**: `schema.sql`
- **Changes**: Added `stripePaymentIntentId` column and index

If you're setting up a new database, just run the updated `schema.sql` file.

---

## Rollback (If Needed)

If you need to rollback the Stripe payment integration:

```sql
-- Remove the index
DROP INDEX IF EXISTS idx_orders_stripe_payment_intent;

-- Remove the column
ALTER TABLE "Orders" 
DROP COLUMN IF EXISTS "stripePaymentIntentId";
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Backup your database
- [ ] Test migration on a staging/development database first
- [ ] Run the migration during low-traffic hours
- [ ] Verify the migration succeeded
- [ ] Test creating orders with online payment
- [ ] Monitor application logs for errors
- [ ] Have rollback plan ready

---

## Troubleshooting

### Error: "column already exists"

This is safe to ignore. The migration uses `IF NOT EXISTS` to prevent errors.

### Error: "permission denied"

Make sure your database user has ALTER TABLE permissions:

```sql
GRANT ALTER ON TABLE "Orders" TO your_username;
```

### Error: "relation does not exist"

Make sure you're connected to the correct database and the Orders table exists.

---

## Summary

### What You Need to Do:

1. **For Stripe Payment Gateway:**
   - Run the migration: `psql -U $DB_USER -d $DB_NAME -f server/migrations/add-stripe-payment-intent-id.sql`
   - OR recreate database with updated schema.sql

2. **For Staff Email Notifications:**
   - Nothing! No database changes needed.

3. **Verify:**
   - Check that `stripePaymentIntentId` column exists in Orders table
   - Test placing an order with online payment
   - Test staff email notifications

---

## Support

If you encounter issues:
1. Check PostgreSQL logs
2. Verify database connection settings
3. Ensure you have proper permissions
4. Review the error messages carefully
