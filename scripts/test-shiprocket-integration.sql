-- Test script to verify Shiprocket integration
-- This script will help verify that automatic order creation is working

-- First, let's check if we have any pickup locations
SELECT * FROM shiprocket_pickup_locations LIMIT 5;

-- Check if we have any existing Shiprocket orders
SELECT * FROM shiprocket_orders LIMIT 5;

-- Check the structure of our orders table
SELECT * FROM orders LIMIT 1;

-- Check the structure of our order_items table
SELECT * FROM order_items LIMIT 1;

-- Check if we have users with addresses
SELECT u.full_name, u.email, a.* 
FROM users u 
JOIN addresses a ON u.id = a.user_id 
LIMIT 5;