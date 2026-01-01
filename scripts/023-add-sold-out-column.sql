-- Add is_sold_out column to products table
ALTER TABLE products ADD COLUMN is_sold_out BOOLEAN DEFAULT false;