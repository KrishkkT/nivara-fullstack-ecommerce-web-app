-- Fix image_url column length to support base64 data URLs
-- This allows for longer image URLs including base64-encoded images

ALTER TABLE products ALTER COLUMN image_url TYPE TEXT;
ALTER TABLE categories ALTER COLUMN image_url TYPE TEXT;
