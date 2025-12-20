// Test manual order creation in Shiprocket
// Save as test-create-order.js and run with: node test-create-order.js

const https = require('https');

// Note: Make sure to set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables
// On Windows: set SHIPROCKET_EMAIL=your_email && set SHIPROCKET_PASSWORD=your_password && node test-create-order.js
// On Linux/Mac: SHIPROCKET_EMAIL=your_email SHIPROCKET_PASSWORD=your_password node test-create-order.js

async function testCreateOrder() {
  try {
    console.log('Testing manual order creation in Shiprocket...');
    
    // Authenticate first
    console.log('\n1. Authenticating...');
    const authResponse = await shiprocketAuth();
    console.log('Authentication successful!');
    
    // Create a test order
    console.log('\n2. Creating test order...');
    const orderData = {
      "order_id": "TEST-" + Date.now(),
      "order_date": new Date().toISOString().split('T')[0],
      "pickup_location": "work", // Make sure this matches your pickup location name
      "billing_customer_name": "Test Customer",
      "billing_last_name": "",
      "billing_address": "208,Nanu prema Market Near Tower",
      "billing_address_2": "",
      "billing_city": "Navsari",
      "billing_pincode": "396445",
      "billing_state": "Gujarat",
      "billing_country": "India",
      "billing_email": "test@example.com",
      "billing_phone": "1234567890",
      "shipping_is_billing": true,
      "order_items": [
        {
          "name": "Test Product",
          "sku": "TEST-SKU-123",
          "units": 1,
          "selling_price": 100,
          "discount": 0,
          "tax": 0,
          "hsn": ""
        }
      ],
      "payment_method": "Prepaid",
      "sub_total": 100,
      "length": 15,
      "breadth": 10,
      "height": 5,
      "weight": 0.5
    };
    
    console.log('Order data:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await shiprocketPost('/orders/create/adhoc', orderData, authResponse.token);
    console.log('Order creation response:', JSON.stringify(orderResponse, null, 2));
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

function shiprocketAuth() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL || 'trulykrish20@gmail.com',
      password: process.env.SHIPROCKET_PASSWORD || 'MFN5^Ec%wE1$UU^sBk^6Xr@sNJNs3TRs'
    });

    const options = {
      hostname: 'apiv2.shiprocket.in',
      port: 443,
      path: '/v1/external/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.token) {
            resolve(jsonData);
          } else {
            reject(new Error('Authentication failed: ' + JSON.stringify(jsonData)));
          }
        } catch (parseError) {
          reject(new Error('Failed to parse auth response: ' + data));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

function shiprocketPost(endpoint, data, token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'apiv2.shiprocket.in',
      port: 443,
      path: '/v1/external' + endpoint,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse response from ${endpoint}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run the test
testCreateOrder();