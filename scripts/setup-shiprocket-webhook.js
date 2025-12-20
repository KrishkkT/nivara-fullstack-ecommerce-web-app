// Script to set up Shiprocket webhook
// Run this script to configure webhooks in your Shiprocket account

require('dotenv').config();

async function setupShiprocketWebhook() {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/shiprocket/webhooks`;
    
    console.log('Setting up Shiprocket webhook...');
    console.log('Webhook URL:', webhookUrl);
    
    // In a real implementation, you would make an API call to Shiprocket to register the webhook
    // For now, we'll just provide instructions
    
    console.log(`
    
INSTRUCTIONS TO SET UP SHIPROCKET WEBHOOK:

1. Log in to your Shiprocket account
2. Go to Settings > API > Webhooks
3. Click "Add Webhook"
4. Enter the following details:
   - Webhook URL: ${webhookUrl}
   - Event Types: Select all relevant events (especially shipment_dispatched)
   - Secret (optional): Set a secret for verification
5. Save the webhook

The webhook will now send notifications to your application when:
- Orders are shipped
- Shipment status changes
- Other events occur

Your application will automatically:
- Send email notifications to customers when orders are shipped
- Update order statuses in your database
- Track shipment progress

    `);
    
  } catch (error) {
    console.error('Failed to set up Shiprocket webhook:', error);
  }
}

// Run the setup
setupShiprocketWebhook();