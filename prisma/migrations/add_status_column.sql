-- Add status column to Mailing table
ALTER TABLE "Mailing" 
ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pending';

-- Update any existing records to have status='pending'
UPDATE "Mailing" 
SET "status" = 'pending' 
WHERE "status" IS NULL; 