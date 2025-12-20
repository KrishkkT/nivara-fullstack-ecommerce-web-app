// Test script to verify Shiprocket webhook functionality
// Run this script to test the webhook endpoint

async function testWebhook() {
  console.log('=== Nivara Webhook Test Script ===');
  console.log('NOTE: This test requires the webhook endpoint to be publicly accessible.');
  console.log('If you are running this locally, the test will fail because Shiprocket');
  console.log('cannot reach your local development server.\n');
  try {
    const webhookUrl = `https://www.nivarasilver.in/api/nivara/updates`;
    
    console.log('Testing Shiprocket webhook endpoint...');
    console.log('Webhook URL:', webhookUrl);
    
    // Verify the URL doesn't contain restricted keywords
    const restrictedKeywords = ['shiprocket', 'kartrocket', 'sr', 'kr'];
    const containsRestrictedKeyword = restrictedKeywords.some(keyword => 
      webhookUrl.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (containsRestrictedKeyword) {
      console.warn('⚠️  Warning: Webhook URL contains restricted keywords. This may cause issues with Shiprocket.');
    } else {
      console.log('✅ Webhook URL complies with Shiprocket requirements (no restricted keywords)');
    }
    
    // Simulate a shipment status update event (realistic Shiprocket webhook payload)
    const testData = {
      awb: "SHIP123456789",
      shipment_id: 789012,
      order_id: "NIVARA-1766221372643",
      current_status: "SHIPPED",
      courier_name: "Delhivery",
      etd: "2025-12-25",
      // Note: rider_name and rider_contact are often not present in initial shipment events
      // They typically appear later when a rider is assigned
    };
    
    console.log('Sending test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('Webhook response status:', response.status);
    console.log('Webhook response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('Failed to test webhook:', error);
    
    // Check if the error is due to HTML response (endpoint not accessible)
    if (error.message && error.message.includes('Unexpected token')) {
      console.log('\n💡 TIP: The webhook endpoint returned HTML instead of JSON.');
      console.log('   This usually means the endpoint is not accessible or not deployed.');
      console.log('   To test this webhook, you need to:');
      console.log('   1. Deploy your application to make the webhook publicly accessible');
      console.log('   2. Ensure the endpoint https://www.nivarasilver.in/api/nivara/updates is reachable');
      console.log('   3. Then run this test script again');
    }
  }
}

// Run the test
testWebhook();