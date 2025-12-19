-- Drop the existing shiprocket_orders table and recreate with correct schema
DROP TABLE IF EXISTS shiprocket_orders;

-- Table for storing Shiprocket order mappings
CREATE TABLE shiprocket_orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL, -- This should match the order_number in orders table
  shiprocket_order_id BIGINT UNIQUE NOT NULL,
  shipment_id BIGINT NULL,
  awb_code VARCHAR(50) NULL,
  status VARCHAR(50) DEFAULT 'placed',
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_order ON shiprocket_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_shiprocket_id ON shiprocket_orders(shiprocket_order_id);
CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_shipment_id ON shiprocket_orders(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_awb ON shiprocket_orders(awb_code);
CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_status ON shiprocket_orders(status);

-- Update the existing shiprocket_pickup_locations table to add missing fields
ALTER TABLE shiprocket_pickup_locations 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_shiprocket_pickup_locations_primary ON shiprocket_pickup_locations("primary");
CREATE INDEX IF NOT EXISTS idx_shiprocket_pickup_locations_location_id ON shiprocket_pickup_locations(shiprocket_location_id);
CREATE INDEX IF NOT EXISTS idx_shiprocket_couriers_status ON shiprocket_couriers(status);
CREATE INDEX IF NOT EXISTS idx_shiprocket_tracking_events_awb ON shiprocket_tracking_events(awb_code);
CREATE INDEX IF NOT EXISTS idx_shiprocket_tracking_events_order ON shiprocket_tracking_events(shiprocket_order_id);
CREATE INDEX IF NOT EXISTS idx_shiprocket_tracking_events_type ON shiprocket_tracking_events(event_type);