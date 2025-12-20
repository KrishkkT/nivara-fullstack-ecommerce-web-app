// Test Shiprocket API connectivity and order creation
// Save as test-shiprocket-api.js and run with: node test-shiprocket-api.js

const https = require('https');

// Note: Make sure to set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables
// On Windows: set SHIPROCKET_EMAIL=your_email && set SHIPROCKET_PASSWORD=your_password && node test-shiprocket-api.js
// On Linux/Mac: SHIPROCKET_EMAIL=your_email SHIPROCKET_PASSWORD=your_password node test-shiprocket-api.js

async function testShiprocketAPI() {
  try {
    console.log('Testing Shiprocket API connectivity...');
    
    // Test 1: Authentication
    console.log('\n1. Testing authentication...');
    const authResponse = await shiprocketAuth();
    console.log('Authentication successful!');
    console.log('Token:', authResponse.token ? `${authResponse.token.substring(0, 10)}...` : 'No token');
    
    // Test 2: Get pickup locations
    console.log('\n2. Testing pickup locations...');
    const pickupResponse = await shiprocketGet('/settings/company/pickup', authResponse.token);
    console.log('Pickup locations:', JSON.stringify(pickupResponse, null, 2));
    
    // Test 3: Get orders (optional)
    console.log('\n3. Testing orders fetch...');
    try {
      const ordersResponse = await shiprocketGet('/orders', authResponse.token);
      console.log('Orders fetch successful!');
      console.log('Sample order data:', ordersResponse.data ? ordersResponse.data.slice(0, 1) : 'No data');
    } catch (error) {
      console.log('Orders fetch failed (may be expected if no orders):', error.message);
    }
    
    console.log('\nAll tests completed successfully!');
    
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

function shiprocketGet(endpoint, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'apiv2.shiprocket.in',
      port: 443,
      path: '/v1/external' + endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
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
          resolve(jsonData);
        } catch (parseError) {
          reject(new Error(`Failed to parse response from ${endpoint}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Run the test
testShiprocketAPI();