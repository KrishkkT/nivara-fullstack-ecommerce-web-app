// Script to manually trigger Shiprocket order creation for an existing order
// Run this from your project root: node scripts/test-shiprocket-creation.js

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function testShiprocketCreation() {
  try {
    // Replace with an actual order ID from your database
    const orderId = 1; // Change this to a real order ID
    
    console.log(`Testing Shiprocket order creation for order ID: ${orderId}`);
    
    // Make API call to trigger Shiprocket order creation
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shiprocket/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Success:', result);
    } else {
      console.error('Error:', result);
    }
  } catch (error) {
    console.error('Failed to test Shiprocket order creation:', error);
  }
}

// Run the test
testShiprocketCreation();