-- Create addresses table for saved customer addresses
CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(100),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  street_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Add contact details to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_id INTEGER REFERENCES addresses(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_id INTEGER REFERENCES addresses(id);
