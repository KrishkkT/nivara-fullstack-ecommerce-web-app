// Test script to manually trigger Shiprocket order creation
// Run this in your Neon database console

-- First, find a recent order that hasn't been synced to Shiprocket
SELECT o.id, o.order_number, o.total_amount, o.status, u.full_name, u.email, u.phone
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.id NOT IN (SELECT CAST(SUBSTRING(order_id, 8) AS INTEGER) FROM shiprocket_orders WHERE order_id LIKE 'NIVARA-%')
ORDER BY o.created_at DESC
LIMIT 1;

-- Check if the order has items
SELECT oi.*, p.name as product_name, p.price as product_price
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 123; -- Replace 123 with the actual order ID from above

-- Check shipping address for the order
SELECT a.*
FROM addresses a
JOIN orders o ON a.id = o.shipping_address_id
WHERE o.id = 123; -- Replace 123 with the actual order ID

-- Check if we have pickup locations configured
SELECT * FROM shiprocket_pickup_locations LIMIT 5;