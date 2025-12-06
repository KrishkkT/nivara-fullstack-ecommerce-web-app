-- Remove stock_quantity column from products table
ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;
