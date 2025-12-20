WEBHOOK SETUP INSTRUCTIONS
==========================

Webhook URL: https://www.nivarasilver.in/api/nivara/updates

How to set up in Shiprocket:
1. Log in to your Shiprocket account
2. Go to Settings > API > Webhooks
3. Click "Add Webhook"
4. Enter the following details:
   - Webhook URL: https://www.nivarasilver.in/api/nivara/updates
   - Event Types: Select all relevant events (especially shipment status updates)
   - Secret (optional): Set a secret for verification if needed
5. Save the webhook

How it works:
- When an order status changes in Shiprocket (e.g., shipped, out for delivery, delivered)
- Shiprocket sends a notification to your webhook URL
- Your system automatically:
  * Updates the order status in your database
  * Sends email notifications to customers when orders are shipped
  * Tracks shipment progress

The system is now fully automated - no manual intervention needed.

## Testing

To test the webhook functionality locally:

1. Deploy your application to make the webhook endpoint publicly accessible
2. Run the test script: `node scripts/test-webhook.cjs`
3. Check the console output for success or error messages

The test script will send a sample shipment notification to your webhook endpoint and verify that it responds correctly.