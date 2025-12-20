// Test Shiprocket serviceability check
// Replace YOUR_SHIPROCKET_EMAIL_HERE and YOUR_SHIPROCKET_PASSWORD_HERE with your actual credentials
// Run with: node scripts/test-serviceability.js

const https = require('https');

// Replace these with your actual Shiprocket credentials
const SHIPROCKET_EMAIL = 'trulykrish20@gmail.com';
const SHIPROCKET_PASSWORD = 'MFN5^Ec%wE1$UU^sBk^6Xr@sNJNs3TRs';

if (SHIPROCKET_EMAIL === 'YOUR_SHIPROCKET_EMAIL_HERE' || SHIPROCKET_PASSWORD === 'YOUR_SHIPROCKET_PASSWORD_HERE') {
  console.error('Please update the script with your actual Shiprocket credentials');
  process.exit(1);
}

async function testServiceability() {
  try {
    console.log('Testing Shiprocket serviceability check...');
    
    // Authenticate first
    console.log('\n1. Authenticating...');
    const authResponse = await shiprocketAuth();
    console.log('Authentication successful!');
    
    // Test serviceability check with correct format
    console.log('\n2. Testing serviceability check...');
    const serviceabilityData = {
      pickup_postcode: '396445', // Your pickup location postcode
      delivery_postcode: '364002', // Sample delivery postcode
      weight: 0.5,
      cod: 0 // Prepaid - this is the correct format for Shiprocket
    };
    
    console.log('Serviceability data:', JSON.stringify(serviceabilityData, null, 2));
    
    const serviceabilityResponse = await shiprocketGet(
      '/courier/serviceability?' + new URLSearchParams(serviceabilityData).toString(), 
      authResponse.token
    );
    console.log('Serviceability response:', JSON.stringify(serviceabilityResponse, null, 2));
    
    console.log('\nTest completed successfully!');
    
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
testServiceability();