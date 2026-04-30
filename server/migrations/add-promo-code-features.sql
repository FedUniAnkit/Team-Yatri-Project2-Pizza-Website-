-- Migration: Add enhanced features to Promotions table
-- Date: 2026-04-28
-- Purpose: Add usage tracking and order requirements to promo codes

-- Add usage limit column
ALTER TABLE "Promotions" 
ADD COLUMN IF NOT EXISTS "usageLimit" INTEGER DEFAULT NULL;

-- Add usage count column
ALTER TABLE "Promotions" 
ADD COLUMN IF NOT EXISTS "usageCount" INTEGER DEFAULT 0;

-- Add minimum order amount column
ALTER TABLE "Promotions" 
ADD COLUMN IF NOT EXISTS "minimumOrderAmount" DECIMAL(10, 2) DEFAULT 0;

-- Add maximum discount amount column
ALTER TABLE "Promotions" 
ADD COLUMN IF NOT EXISTS "maxDiscountAmount" DECIMAL(10, 2) DEFAULT NULL;

-- Add comments to document the columns
COMMENT ON COLUMN "Promotions"."usageLimit" IS 'Maximum number of times this promo code can be used (NULL = unlimited)';
COMMENT ON COLUMN "Promotions"."usageCount" IS 'Number of times this promo code has been used';
COMMENT ON COLUMN "Promotions"."minimumOrderAmount" IS 'Minimum order amount required to use this promo code';
COMMENT ON COLUMN "Promotions"."maxDiscountAmount" IS 'Maximum discount amount for percentage-based promos (NULL = unlimited)';

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'Promotions' 
AND column_name IN ('usageLimit', 'usageCount', 'minimumOrderAmount', 'maxDiscountAmount');
