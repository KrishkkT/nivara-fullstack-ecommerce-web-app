-- Test script to verify Shiprocket integration fixes
-- Run this in your Neon database console

-- Check if we have any orders that failed to sync
SELECT o.id, o.order_number, o.total_amount, o.status, u.full_name, u.email
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.id NOT IN (
    SELECT CAST(SUBSTRING(order_id, 8) AS INTEGER) 
    FROM shiprocket_orders 
    WHERE order_id LIKE 'NIVARA-%'
)
AND o.status != 'pending'
ORDER BY o.created_at DESC
LIMIT 5;

-- Check the structure of a recent order
SELECT o.order_number, o.total_amount, o.status,
       oi.product_id, oi.quantity, oi.product_price,
       p.name as product_name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.order_number = 'NIVARA-1766170964445'  -- Replace with actual order number
ORDER BY o.created_at DESC
LIMIT 1;

-- Check if we have pickup locations
SELECT * FROM shiprocket_pickup_locations LIMIT 3;

-- Check if we have any synced orders
SELECT * FROM shiprocket_orders LIMIT 3;