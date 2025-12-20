-- Test to check if products table has sku column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'sku';

-- Check the structure of products table
SELECT * FROM products LIMIT 1;

-- Check the structure of order_items table
SELECT * FROM order_items LIMIT 1;

-- Check if we have any Shiprocket orders
SELECT * FROM shiprocket_orders LIMIT 5;