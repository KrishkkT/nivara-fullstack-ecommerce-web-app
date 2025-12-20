// Test script to verify Shiprocket webhook functionality
// Run this script to test the webhook endpoint

async function testWebhook() {
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
    
    // Simulate a shipment status update event
    const testData = {
      awb: "SHIP123456789",
      shipment_id: 789012,
      order_id: "NIVARA-1766221372643",
      current_status: "SHIPPED",
      rider_name: "John Doe",
      rider_contact: "9876543210"
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
  }
}

// Run the test
testWebhook();