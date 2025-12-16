-- Migration script to update existing users to have 'customer' role by default
-- This ensures backward compatibility for existing users

-- Update existing users to have 'customer' role if role is NULL or empty
UPDATE users 
SET role = 'customer' 
WHERE role IS NULL OR role = '' OR role NOT IN ('admin', 'customer');

-- Alter table to set default role to 'customer'
ALTER TABLE users 
ALTER COLUMN role SET DEFAULT 'customer';

-- Add constraint to ensure role is either 'admin' or 'customer'
ALTER TABLE users 
ADD CONSTRAINT valid_role CHECK (role IN ('admin', 'customer'));