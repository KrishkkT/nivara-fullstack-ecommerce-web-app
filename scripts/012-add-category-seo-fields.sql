-- Add SEO fields to categories table for better search engine optimization
-- Run this script to update your categories table structure

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

-- Update existing categories with SEO data
UPDATE categories SET 
  meta_title = name || ' | NIVARA Silver Jewellery',
  meta_description = 'Explore our exquisite collection of ' || LOWER(name) || ' in 925 sterling silver. Handcrafted with precision and designed for elegance.',
  meta_keywords = LOWER(name) || ', silver jewellery, 925 sterling silver, handcrafted'
WHERE meta_title IS NULL;
