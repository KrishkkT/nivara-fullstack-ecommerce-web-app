// Simple Shiprocket API test script
// Replace YOUR_SHIPROCKET_EMAIL_HERE and YOUR_SHIPROCKET_PASSWORD_HERE with your actual credentials
// Run with: node scripts/simple-shiprocket-test.js

const https = require('https');

// Replace these with your actual Shiprocket credentials
const SHIPROCKET_EMAIL = 'YOUR_SHIPROCKET_EMAIL_HERE';
const SHIPROCKET_PASSWORD = 'YOUR_SHIPROCKET_PASSWORD_HERE';

if (SHIPROCKET_EMAIL === 'YOUR_SHIPROCKET_EMAIL_HERE' || SHIPROCKET_PASSWORD === 'YOUR_SHIPROCKET_PASSWORD_HERE') {
  console.error('Please update the script with your actual Shiprocket credentials');
  process.exit(1);
}

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
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD
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