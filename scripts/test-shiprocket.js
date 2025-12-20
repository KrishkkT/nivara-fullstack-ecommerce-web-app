// Simple test script to manually test Shiprocket order creation
// Save this as test-shiprocket.js and run with: node test-shiprocket.js

const { createOrder, getPickupLocations } = require('./lib/logistics/shiprocket');

async function testShiprocket() {
  try {
    console.log('Testing Shiprocket integration...');
    
    // Test getting pickup locations
    console.log('Fetching pickup locations...');
    const pickupLocations = await getPickupLocations();
    console.log('Pickup locations:', JSON.stringify(pickupLocations, null, 2));
    
    // Test creating a sample order
    console.log('Creating test order...');
    const testData = {
      order_id: "TEST-" + Date.now(),
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "work", // Use your actual pickup location name
      billing_customer_name: "Test Customer",
      billing_last_name: "",
      billing_address: "208,Nanu prema Market Near Tower",
      billing_address_2: "",
      billing_city: "Navsari",
      billing_state: "Gujarat",
      billing_country: "India",
      billing_pincode: "396445",
      billing_email: "test@example.com",
      billing_phone: "1234567890",
      shipping_is_billing: true,
      order_items: [
        {
          name: "Test Product",
          sku: "TEST-SKU-123",
          price: 100,
          quantity: 1,
          hsn: ""
        }
      ],
      payment_method: "Prepaid",
      sub_total: 100,
      length: 15,
      breadth: 10,
      height: 5,
      weight: 0.5
    };
    
    console.log('Sending order data:', JSON.stringify(testData, null, 2));
    const result = await createOrder(testData);
    console.log('Order creation result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testShiprocket();