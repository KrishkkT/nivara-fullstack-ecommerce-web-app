-- Test script to manually trigger order creation
-- This can be used to debug automatic order creation issues

-- First, check if we have any orders
SELECT id, order_number, user_id, total_amount, status 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if any orders have been synced to Shiprocket
SELECT * FROM shiprocket_orders LIMIT 5;

-- Check pickup locations
SELECT * FROM shiprocket_pickup_locations LIMIT 5;

-- Check a specific order with its items
SELECT o.order_number, o.total_amount, o.status, 
       oi.product_id, oi.quantity, oi.product_price,
       p.name as product_name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.order_number = 'NIVARA-1766170964445'  -- Replace with actual order number
ORDER BY o.created_at DESC
LIMIT 1;