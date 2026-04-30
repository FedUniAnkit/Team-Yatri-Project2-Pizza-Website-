-- Migration: Add emailSent to Messages table
-- Date: 2026-04-28
-- Purpose: Track whether email notification was sent to customer

-- Add emailSent column to Messages table
ALTER TABLE "Messages" 
ADD COLUMN IF NOT EXISTS "emailSent" BOOLEAN DEFAULT false;

-- Add comment to document the column
COMMENT ON COLUMN "Messages"."emailSent" IS 'Indicates if email notification was sent to customer';

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'Messages' 
AND column_name = 'emailSent';
