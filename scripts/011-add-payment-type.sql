-- Add payment_type column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'razorpay';

-- Update existing orders
UPDATE orders SET payment_type = 'razorpay'
WHERE payment_type IS NULL OR payment_type = 'cod';
