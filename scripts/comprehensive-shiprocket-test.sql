-- Comprehensive test to verify Shiprocket integration
-- Run this in your Neon database console
-- Instructions:
-- 1. Replace 'YOUR_ORDER_NUMBER' with an actual order number from your database
-- 2. Run each query separately to diagnose Shiprocket integration issues

-- 1. Check if we have any orders that should be synced to Shiprocket
SELECT 
    o.id, 
    o.order_number, 
    o.total_amount, 
    o.status, 
    o.payment_method,
    u.full_name as customer_name,
    u.email as customer_email,
    a.address_line1,
    a.city,
    a.state,
    a.postal_code
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN addresses a ON o.shipping_address_id = a.id
WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered', 'pending')
AND o.order_number NOT IN (
    SELECT order_id 
    FROM shiprocket_orders 
    WHERE order_id IS NOT NULL
)
ORDER BY o.created_at DESC
LIMIT 10;

-- 2. Check the structure of a recent order with items
SELECT 
    o.order_number,
    o.total_amount,
    o.status,
    oi.product_id,
    oi.quantity,
    oi.product_price,
    p.name as product_name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered', 'pending')
ORDER BY o.created_at DESC
LIMIT 10;

-- 3. Check pickup locations in our database
SELECT * FROM shiprocket_pickup_locations LIMIT 5;

-- 4. Check if we have any synced Shiprocket orders
SELECT 
    so.*,
    o.total_amount,
    u.full_name as customer_name
FROM shiprocket_orders so
JOIN orders o ON so.order_id = o.order_number
JOIN users u ON o.user_id = u.id
ORDER BY so.created_at DESC
LIMIT 10;

-- 5. Check a specific order with its items
-- Replace 'YOUR_ORDER_NUMBER' with an actual order number from your database
SELECT 
    o.order_number,
    o.total_amount,
    o.status,
    oi.product_id,
    oi.quantity,
    oi.product_price,
    p.name as product_name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.order_number = 'YOUR_ORDER_NUMBER'  -- Replace with actual order number
ORDER BY o.created_at DESC
LIMIT 1;

-- 6. Check if we have proper environment variables set
-- (This would need to be checked in your Vercel environment settings)