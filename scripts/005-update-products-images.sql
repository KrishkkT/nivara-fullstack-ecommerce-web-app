-- Update product images with better placeholder queries
UPDATE products SET 
  image_url = '/placeholder.svg?height=600&width=600'
WHERE category_id = 1;

UPDATE products SET 
  image_url = '/placeholder.svg?height=600&width=600'
WHERE category_id = 2;

UPDATE products SET 
  image_url = '/placeholder.svg?height=600&width=600'
WHERE category_id = 3;

UPDATE products SET 
  image_url = '/placeholder.svg?height=600&width=600'
WHERE category_id = 4;

-- Set all products to active with good stock
UPDATE products SET is_active = true, stock_quantity = 50 WHERE stock_quantity < 10;
