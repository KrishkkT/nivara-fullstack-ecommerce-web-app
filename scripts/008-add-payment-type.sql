-- Add payment_type column to orders table to track payment method (Online Payment via Razorpay)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'razorpay';

-- Update existing orders to set payment_type to razorpay for all orders
UPDATE orders 
SET payment_type = 'razorpay';