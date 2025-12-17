-- Table for storing Delhivery waybills
CREATE TABLE IF NOT EXISTS delhivery_waybills (
  id SERIAL PRIMARY KEY,
  waybill_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'available', -- available, used, expired
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP NULL,
  expiry_date TIMESTAMP NULL
);

-- Table for storing Delhivery shipment tracking data
CREATE TABLE IF NOT EXISTS delhivery_shipments (
  id SERIAL PRIMARY KEY,
  waybill_number VARCHAR(50) UNIQUE NOT NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'created',
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing warehouse information
CREATE TABLE IF NOT EXISTS delhivery_warehouses (
  id SERIAL PRIMARY KEY,
  warehouse_name VARCHAR(100) NOT NULL,
  warehouse_code VARCHAR(50) UNIQUE NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  phone VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_delhivery_waybills_status ON delhivery_waybills(status);
CREATE INDEX IF NOT EXISTS idx_delhivery_waybills_created ON delhivery_waybills(created_at);
CREATE INDEX IF NOT EXISTS idx_delhivery_shipments_waybill ON delhivery_shipments(waybill_number);
CREATE INDEX IF NOT EXISTS idx_delhivery_shipments_order ON delhivery_shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_delhivery_shipments_status ON delhivery_shipments(status);
CREATE INDEX IF NOT EXISTS idx_delhivery_warehouses_code ON delhivery_warehouses(warehouse_code);
CREATE INDEX IF NOT EXISTS idx_delhivery_warehouses_active ON delhivery_warehouses(is_active);