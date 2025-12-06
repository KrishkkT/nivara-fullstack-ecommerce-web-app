-- Add payment_type column to orders table to track payment method (COD or Razorpay)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'cod';

-- Update existing orders to set payment_type based on razorpay_order_id
UPDATE orders 
SET payment_type = CASE 
  WHEN razorpay_order_id IS NOT NULL AND razorpay_order_id != '' THEN 'razorpay'
  ELSE 'cod'
END;
