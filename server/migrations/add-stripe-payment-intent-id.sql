-- Migration: Add stripePaymentIntentId to Orders table
-- Date: 2026-04-28
-- Purpose: Support Stripe payment gateway integration

-- Add stripePaymentIntentId column to Orders table
ALTER TABLE "Orders" 
ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" VARCHAR(255);

-- Add index for faster lookups by Stripe payment intent ID
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent 
ON "Orders"("stripePaymentIntentId");

-- Add comment to document the column
COMMENT ON COLUMN "Orders"."stripePaymentIntentId" IS 'Stripe payment intent ID for online payments';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Orders' 
AND column_name = 'stripePaymentIntentId';
