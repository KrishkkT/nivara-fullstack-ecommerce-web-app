// Script to manually trigger Shiprocket order creation for an existing order
// Run this from your project root: node scripts/manual-shiprocket-trigger.js

const { createShiprocketOrderAutomatically } = require('../app/actions/orders');

async function triggerShiprocketOrder() {
  try {
    // Replace these with actual values from your database
    const orderId = 123; // Replace with actual order ID
    const orderNumber = 'NIVARA-1766215577059'; // Replace with actual order number
    
    // Minimal order data object (you would get this from your database)
    const orderData = {
      shippingAddressId: null,
      shippingAddress: {
        address_line1: "208,Nanu prema Market Near Tower",
        address_line2: "",
        city: "Navsari",
        state: "Gujarat",
        postal_code: "396445",
        country: "India"
      },
      paymentMethod: "prepaid",
      totalAmount: 100,
      items: [
        {
          productId: 1,
          quantity: 1,
          price: 100
        }
      ]
    };
    
    console.log(`Triggering Shiprocket order creation for order #${orderNumber} (ID: ${orderId})`);
    
    // Call the function
    await createShiprocketOrderAutomatically(orderId, orderNumber, orderData);
    
    console.log('Successfully triggered Shiprocket order creation');
  } catch (error) {
    console.error('Failed to trigger Shiprocket order creation:', error);
  }
}

// Run the function
triggerShiprocketOrder();