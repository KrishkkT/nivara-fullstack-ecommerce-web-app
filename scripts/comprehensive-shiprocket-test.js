// Comprehensive test to verify Shiprocket integration
// Run this from your project root: node scripts/comprehensive-shiprocket-test.js

require('dotenv').config();
const { sql } = require('@/lib/db');

async function testShiprocketIntegration() {
  try {
    console.log('=== Shiprocket Integration Test ===\n');
    
    // 1. Check environment variables
    console.log('1. Checking environment variables...');
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error('❌ NEXT_PUBLIC_BASE_URL is not set');
      return;
    }
    console.log('✅ NEXT_PUBLIC_BASE_URL is set');
    
    if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
      console.error('❌ SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD is not set');
      return;
    }
    console.log('✅ SHIPROCKET credentials are set\n');
    
    // 2. Check database connectivity and structure
    console.log('2. Checking database structure...');
    
    // Check orders table structure
    const ordersSample = await sql`SELECT * FROM orders LIMIT 1`;
    console.log('✅ Orders table accessible');
    
    // Check order_items table structure
    const orderItemsSample = await sql`SELECT * FROM order_items LIMIT 1`;
    console.log('✅ Order items table accessible');
    
    // Check for unsynced orders
    const unsyncedOrders = await sql`
      SELECT o.id, o.order_number, o.status, o.payment_status, o.created_at
      FROM orders o
      LEFT JOIN shiprocket_orders sro ON o.order_number = sro.order_id
      WHERE o.status IN ('paid', 'processing') AND sro.order_id IS NULL
      ORDER BY o.created_at DESC
      LIMIT 3
    `;
    
    console.log(`✅ Found ${unsyncedOrders.length} unsynced orders\n`);
    
    if (unsyncedOrders.length > 0) {
      console.log('3. Testing Shiprocket order creation for unsynced orders...');
      
      for (const order of unsyncedOrders) {
        console.log(`\nTesting order #${order.order_number} (ID: ${order.id})`);
        
        try {
          // Make API call to trigger Shiprocket order creation
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shiprocket/create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: order.id })
          });
          
          const result = await response.json();
          
          if (response.ok) {
            console.log(`✅ Successfully triggered Shiprocket creation for order #${order.order_number}`);
          } else {
            console.error(`❌ Failed to trigger Shiprocket creation for order #${order.order_number}:`, result.error);
          }
        } catch (error) {
          console.error(`❌ Error testing order #${order.order_number}:`, error.message);
        }
      }
    } else {
      console.log('3. No unsynced orders found - all orders are properly synced\n');
    }
    
    console.log('=== Test Complete ===');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testShiprocketIntegration();