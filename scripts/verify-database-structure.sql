-- Test to check if products table has sku column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'sku';

-- Check the structure of products table
SELECT * FROM products LIMIT 1;

-- Check the structure of order_items table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- Sample data from order_items table
SELECT * FROM order_items LIMIT 1;

-- Check the structure of orders table
SELECT * FROM orders LIMIT 1;

-- Check if we have any Shiprocket orders
SELECT * FROM shiprocket_orders LIMIT 5;

-- Check for orders that haven't been synced to Shiprocket yet
SELECT o.id, o.order_number, o.status, o.payment_status, o.created_at
FROM orders o
LEFT JOIN shiprocket_orders sro ON o.order_number = sro.order_id
WHERE o.status IN ('paid', 'processing') AND sro.order_id IS NULL
ORDER BY o.created_at DESC
LIMIT 10;