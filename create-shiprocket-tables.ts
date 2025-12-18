import { sql } from '@/lib/db';

async function createShiprocketTables() {
  try {
    console.log('Creating Shiprocket tables...');
    
    // Create shiprocket_orders table
    await sql`
      CREATE TABLE IF NOT EXISTS shiprocket_orders (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
        shiprocket_order_id BIGINT UNIQUE NOT NULL,
        shipment_id BIGINT NULL,
        awb_code VARCHAR(50) NULL,
        status VARCHAR(50) DEFAULT 'placed',
        event_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create shiprocket_pickup_locations table
    await sql`
      CREATE TABLE IF NOT EXISTS shiprocket_pickup_locations (
        id SERIAL PRIMARY KEY,
        shiprocket_location_id INTEGER UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) DEFAULT 'India',
        pin_code VARCHAR(20) NOT NULL,
        "primary" BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create shiprocket_couriers table
    await sql`
      CREATE TABLE IF NOT EXISTS shiprocket_couriers (
        id SERIAL PRIMARY KEY,
        courier_id INTEGER UNIQUE NOT NULL,
        courier_name VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create shiprocket_tracking_events table
    await sql`
      CREATE TABLE IF NOT EXISTS shiprocket_tracking_events (
        id SERIAL PRIMARY KEY,
        shiprocket_order_id BIGINT NOT NULL,
        awb_code VARCHAR(50),
        event_type VARCHAR(50) NOT NULL,
        status VARCHAR(50),
        location VARCHAR(255),
        timestamp TIMESTAMP,
        remarks TEXT,
        raw_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_order ON shiprocket_orders(order_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_shiprocket_id ON shiprocket_orders(shiprocket_order_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_shipment_id ON shiprocket_orders(shipment_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_awb ON shiprocket_orders(awb_code);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_status ON shiprocket_orders(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_pickup_locations_primary ON shiprocket_pickup_locations("primary");`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_pickup_locations_location_id ON shiprocket_pickup_locations(shiprocket_location_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_couriers_status ON shiprocket_couriers(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_tracking_events_awb ON shiprocket_tracking_events(awb_code);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_tracking_events_order ON shiprocket_tracking_events(shiprocket_order_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_shiprocket_tracking_events_type ON shiprocket_tracking_events(event_type);`;
    
    console.log('✅ Shiprocket tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating Shiprocket tables:', error);
  }
}

createShiprocketTables();