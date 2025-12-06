-- Add payment_type column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'cod';

-- Update existing orders
UPDATE orders SET payment_type = 
  CASE 
    WHEN razorpay_order_id IS NOT NULL THEN 'razorpay'
    ELSE 'cod'
  END
WHERE payment_type IS NULL OR payment_type = 'cod';
