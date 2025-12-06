-- Replace weight column with design_number in products table
ALTER TABLE products DROP COLUMN IF EXISTS weight;
ALTER TABLE products ADD COLUMN IF NOT EXISTS design_number VARCHAR(100);

-- Also remove dimensions column as it was requested to be removed
ALTER TABLE products DROP COLUMN IF EXISTS dimensions;
