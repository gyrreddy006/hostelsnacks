/*
  # Add user profile information

  1. Changes
    - Add phone_number and address columns to users table
    - Add name column to users table
    - Add constraints for phone number format

  2. Security
    - No changes to RLS policies required
*/

DO $$ 
BEGIN
  -- Add name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'name'
  ) THEN
    ALTER TABLE users ADD COLUMN name text;
  END IF;

  -- Add phone_number column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE users ADD COLUMN phone_number text;
    -- Add constraint for phone number format (optional)
    ALTER TABLE users ADD CONSTRAINT valid_phone_number 
    CHECK (phone_number IS NULL OR phone_number ~ '^\+?[0-9]{10,15}$');
  END IF;

  -- Add address column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'address'
  ) THEN
    ALTER TABLE users ADD COLUMN address text;
  END IF;
END $$;