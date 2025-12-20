-- Script to manually trigger Shiprocket sync for existing orders
-- Run this in your Neon database console

-- First, let's find orders that haven't been synced to Shiprocket yet
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

-- To manually trigger sync for a specific order, you would need to call your backend API
-- This would typically be done through a server-side function or API endpoint

-- Check the structure of a specific order
-- Replace 'YOUR_ORDER_NUMBER' with an actual order number
SELECT 
    o.order_number,
    o.total_amount,
    o.status,
    oi.product_id,
    oi.quantity,
    oi.product_price,
    p.name as product_name,
    p.sku as product_sku
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.order_number = 'YOUR_ORDER_NUMBER'  -- Replace with actual order number
ORDER BY o.created_at DESC
LIMIT 1;