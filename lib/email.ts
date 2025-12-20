import nodemailer from 'nodemailer';

// Create transporter only if email configuration is provided
let transporter: nodemailer.Transporter | null = null;
let lastEnvCheck = 0;
const ENV_CHECK_INTERVAL = 60000; // Check environment variables every minute

// Function to initialize transporter with current environment variables
function initializeTransporter() {
  const now = Date.now();
  // Only recheck environment variables periodically to avoid unnecessary checks
  if (now - lastEnvCheck < ENV_CHECK_INTERVAL && transporter !== null) {
    return;
  }
  
  lastEnvCheck = now;

  // Check if we're using Gmail (preferred method)
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const fromEmail = process.env.FROM_EMAIL || "NIVARA <noreply@nivara.in>";
  
  if (gmailUser && gmailAppPassword) {
    // Gmail configuration
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });
    console.log("[v0] Gmail transporter initialized successfully");
    return;
  }
  
  // Fallback to generic SMTP configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  
  if (smtpHost && smtpPort && smtpUser && smtpPassword) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
    console.log("[v0] Generic SMTP transporter initialized successfully");
  } else {
    transporter = null;
    console.warn("[v0] Email configuration not complete. Email sending will be disabled.");
    console.warn("[v0] For Gmail: Set GMAIL_USER and GMAIL_APP_PASSWORD");
    console.warn("[v0] For generic SMTP: Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD");
  }
}

// Initialize transporter at module load
initializeTransporter();

// Email template for order notifications to admins
export function generateOrderNotificationEmail(
  order: any,
  customer: any,
  items: any[],
  shippingAddress: any
): string {
  const itemsHtml = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">
        ${item.product_name}
        ${item.quantity > 1 ? `<br/><small>Quantity: ${item.quantity}</small>` : ""}
      </td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(
        Number(item.product_price) * item.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">New Order Received</h1>
        
        <p>A new order has been placed on your website.</p>
        
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString("en-IN")}</p>
        <p><strong>Customer:</strong> ${customer.full_name} (${customer.email})</p>
        <p><strong>Phone:</strong> ${customer.phone || "Not provided"}</p>
        <p><strong>Payment Method:</strong> Online Payment</p>
        
        <h2 style="color: #B29789; border-bottom: 2px solid #B29789; padding-bottom: 5px;">Shipping Address</h2>
        <p>
          ${(shippingAddress?.address_line1 || '') ? `${shippingAddress.address_line1}<br>` : ''}
          ${(shippingAddress?.address_line2 || '') ? `${shippingAddress.address_line2}<br>` : ''}
          ${[(shippingAddress?.city || ''), (shippingAddress?.state || ''), (shippingAddress?.postal_code || '')].filter(Boolean).join(', ')}<br>
          ${shippingAddress?.country || 'India'}
        </p>
        
        <h2 style="color: #B29789; border-bottom: 2px solid #B29789; padding-bottom: 5px;">Order Items</h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Total Amount</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${Number(
                order.total_amount
              ).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com"}/admin/orders/${
    order.id
  }" 
             style="display: inline-block; padding: 10px 20px; background-color: #B29789; color: white; text-decoration: none; border-radius: 4px;">
            View Order Details
          </a>
        </p>
      </div>
    </body>
    </html>
  `
}

// Email utility function to send emails
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  // Re-initialize transporter to ensure we have latest environment variables
  initializeTransporter();
  
  // If transporter is not configured, silently return
  if (!transporter) {
    console.warn("[v0] SMTP configuration not complete. Email sending will be disabled.");
    console.warn("[v0] Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD environment variables");
    return { success: true, message: "Email service not configured" }
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL || "NIVARA <noreply@nivara.in>",
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    })
    
    console.log("[v0] Email sent successfully to:", Array.isArray(to) ? to.join(', ') : to);
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("[v0] Email sending failed:", error);
    // Return success even if email fails to avoid breaking the user experience
    return { success: true, error: "Email sending failed" }
  }
}

// Generate HTML email template for customer order confirmation
export function generateCustomerOrderConfirmationEmail(order: any, customer: any, items: any[], shippingAddress: any): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.product_name}</div>
        <div>Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.product_price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')
  
  // Safely handle shipping address
  let shippingAddressHtml = '';
  if (shippingAddress) {
    shippingAddressHtml = `
      <p><strong>Shipping Address:</strong></p>
      <div style="margin: 10px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;">
        <div>${shippingAddress?.address_line1 || ''}</div>
        ${(shippingAddress?.address_line2 || '') ? `<div>${shippingAddress.address_line2}</div>` : ''}
        <div>${[shippingAddress?.city || '', shippingAddress?.state || '', shippingAddress?.postal_code || ''].filter(Boolean).join(', ')}</div>
        <div>${shippingAddress?.country || 'India'}</div>
      </div>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Order Confirmation</h1>
        
        <p>Dear ${customer.full_name || 'Customer'},</p>
        
        <p>Thank you for your order! We're preparing your items for shipment.</p>
        
        <p><strong>Order Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Order Number:</strong> ${order.order_number || ''}</li>
          <li><strong>Order Date:</strong> ${order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : ''}</li>
          <li><strong>Total Amount:</strong> ₹${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</li>
        </ul>
        
        <p><strong>Items Ordered:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        ${shippingAddressHtml}
        
        <p>We'll notify you when your order has been shipped.</p>
        
        <p>Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for shipment notification
export function generateShipmentNotificationEmail(order: any, items: any[], shippingAddress: any, shipmentInfo: { awb_code?: string; courier_name?: string; etd?: string }): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.product_name}</div>
        <div>Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.product_price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')
  
  // Safely handle shipping address
  let shippingAddressHtml = '';
  if (shippingAddress) {
    shippingAddressHtml = `
      <p><strong>Shipping Address:</strong></p>
      <div style="margin: 10px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;">
        <div>${shippingAddress?.address_line1 || ''}</div>
        ${(shippingAddress?.address_line2 || '') ? `<div>${shippingAddress.address_line2}</div>` : ''}
        <div>${[shippingAddress?.city || '', shippingAddress?.state || '', shippingAddress?.postal_code || ''].filter(Boolean).join(', ')}</div>
        <div>${shippingAddress?.country || 'India'}</div>
      </div>
    `;
  }
  
  // Shipment information
  let shipmentInfoHtml = '';
  if (shipmentInfo.awb_code || shipmentInfo.courier_name) {
    shipmentInfoHtml = `
      <p><strong>Shipment Details:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        ${shipmentInfo.awb_code ? `<li><strong>Tracking Number:</strong> ${shipmentInfo.awb_code}</li>` : ''}
        ${shipmentInfo.courier_name ? `<li><strong>Courier:</strong> ${shipmentInfo.courier_name}</li>` : ''}
        ${shipmentInfo.etd ? `<li><strong>Estimated Delivery:</strong> ${new Date(shipmentInfo.etd).toLocaleDateString('en-IN')}</li>` : ''}
      </ul>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Order Has Been Shipped!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Your Order Has Been Shipped!</h1>
        
        <p>Dear Customer,</p>
        
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <p><strong>Order Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Order Number:</strong> ${order.order_number || ''}</li>
          <li><strong>Order Date:</strong> ${order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : ''}</li>
          <li><strong>Total Amount:</strong> ₹${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</li>
        </ul>
        
        ${shipmentInfoHtml}
        
        <p><strong>Items Shipped:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        ${shippingAddressHtml}
        
        <p>You can track your shipment using the tracking number above. You should receive your order soon.</p>
        
        <p>Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for shipping confirmation
export function generateShippingConfirmationEmail(order: any, customer: any, items: any[], shippingAddress: any): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.product_name}</div>
        <div>Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.product_price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')
  
  // Safely handle shipping address
  let shippingAddressHtml = '';
  if (shippingAddress) {
    shippingAddressHtml = `
      <p><strong>Shipping Address:</strong></p>
      <div style="margin: 10px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;">
        <div>${shippingAddress?.address_line1 || ''}</div>
        ${(shippingAddress?.address_line2 || '') ? `<div>${shippingAddress.address_line2}</div>` : ''}
        <div>${[shippingAddress?.city || '', shippingAddress?.state || '', shippingAddress?.postal_code || ''].filter(Boolean).join(', ')}</div>
        <div>${shippingAddress?.country || 'India'}</div>
      </div>
    `;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Shipped</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Your Order Has Been Shipped!</h1>
        
        <p>Dear ${customer.full_name || 'Customer'},</p>
        
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <p><strong>Order Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Order Number:</strong> ${order.order_number || ''}</li>
          <li><strong>Order Date:</strong> ${order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : ''}</li>
          <li><strong>Total Amount:</strong> ₹${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</li>
        </ul>
        
        <p><strong>Items Shipped:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        ${shippingAddressHtml}
        
        <p>You should receive your order soon. Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for admin shipping notification
export function generateAdminShippingNotificationEmail(order: any, customer: any, items: any[]): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.product_name}</div>
        <div>Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.product_price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Shipped Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Order Marked as Shipped</h1>
        
        <p>An order has been marked as shipped in the admin panel.</p>
        
        <p><strong>Order Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Customer:</strong> ${customer.full_name} (${customer.email})</li>
          <li><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</li>
          <li><strong>Total Amount:</strong> ₹${parseFloat(order.total_amount).toFixed(2)}</li>
        </ul>
        
        <p><strong>Items:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <p>You can view and manage this order in the admin panel.</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for cancellation confirmation
export function generateCancellationConfirmationEmail(order: any, customer: any, items: any[]): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.product_name}</div>
        <div>Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.product_price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Cancelled</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Order Cancelled</h1>
        
        <p>Dear ${customer.full_name},</p>
        
        <p>Your order #${order.order_number} has been cancelled.</p>
        
        <p><strong>Order Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</li>
          <li><strong>Total Amount:</strong> ₹${parseFloat(order.total_amount).toFixed(2)}</li>
        </ul>
        
        <p><strong>Cancelled Items:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <p>A refund will be processed according to our refund policy. Please allow 5-7 business days for the refund to appear in your account.</p>
        
        <p>If you have any questions, please contact our customer support team.</p>
        
        <p>Thank you for considering our store.</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for admin cancellation notification
export function generateAdminCancellationNotificationEmail(order: any, customer: any, items: any[]): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.product_name}</div>
        <div>Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.product_price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Cancelled Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Order Cancelled by Admin</h1>
        
        <p>An order has been cancelled by an administrator.</p>
        
        <p><strong>Order Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Customer:</strong> ${customer.full_name} (${customer.email})</li>
          <li><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</li>
          <li><strong>Total Amount:</strong> ₹${parseFloat(order.total_amount).toFixed(2)}</li>
        </ul>
        
        <p><strong>Cancelled Items:</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <p>You can view this order in the admin panel.</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for admin notification about new user registration
export function generateNewUserNotificationEmail(user: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New User Registration</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">New User Registration</h1>
        
        <p>A new user has registered on your website.</p>
        
        <p><strong>User Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Name:</strong> ${user.full_name}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          ${user.phone ? `<li><strong>Phone:</strong> ${user.phone}</li>` : ''}
          <li><strong>Registration Date:</strong> ${new Date().toLocaleString('en-IN')}</li>
        </ul>
        
        <p>You can view and manage user accounts in the admin panel.</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for welcome email
export function generateWelcomeEmail(user: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to NIVARA</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Welcome to NIVARA!</h1>
        
        <p>Dear ${user.full_name},</p>
        
        <p>Welcome to NIVARA! We're thrilled to have you join our community of jewelry enthusiasts.</p>
        
        <p>Your account has been successfully created. You can now:</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Browse our exquisite collection of jewelry</li>
          <li>Save your favorite items to your wishlist</li>
          <li>Track your orders</li>
          <li>Manage your shipping addresses</li>
        </ul>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our customer support team.</p>
        
        <p>Happy shopping!</p>
        
        <p>Warm regards,<br>The NIVARA Team</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for shipment creation notification
export function generateShipmentCreationEmail(order: any, customer: any, waybill: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Shipment Created</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Your Order Has Been Shipped!</h1>
        
        <p>Dear ${customer.full_name},</p>
        
        <p>Great news! Your order #${order.order_number} has been shipped and is on its way to you.</p>
        
        <p><strong>Shipment Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Waybill Number:</strong> ${waybill}</li>
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</li>
        </ul>
        
        <p>You can track your shipment using the waybill number above or by visiting our <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com"}/shipping/track">order tracking page</a>.</p>
        
        <p>Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for admin shipment creation notification
export function generateAdminShipmentCreationEmail(order: any, customer: any, waybill: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Shipment Created</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">New Shipment Created</h1>
        
        <p>A new shipment has been created in the admin panel.</p>
        
        <p><strong>Shipment Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Waybill Number:</strong> ${waybill}</li>
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Customer:</strong> ${customer.full_name} (${customer.email})</li>
          <li><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</li>
        </ul>
        
        <p>You can manage this shipment in the admin panel.</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for shipment cancellation notification
export function generateShipmentCancellationEmail(order: any, customer: any, waybill: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Shipment Cancelled</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Shipment Cancelled</h1>
        
        <p>Dear ${customer.full_name},</p>
        
        <p>Your shipment for order #${order.order_number} has been cancelled.</p>
        
        <p><strong>Shipment Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Waybill Number:</strong> ${waybill}</li>
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</li>
        </ul>
        
        <p>A refund will be processed according to our refund policy. Please allow 5-7 business days for the refund to appear in your account.</p>
        
        <p>If you have any questions, please contact our customer support team.</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for admin shipment cancellation notification
export function generateAdminShipmentCancellationEmail(order: any, customer: any, waybill: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Shipment Cancelled</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Shipment Cancelled</h1>
        
        <p>A shipment has been cancelled by an administrator.</p>
        
        <p><strong>Shipment Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Waybill Number:</strong> ${waybill}</li>
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Customer:</strong> ${customer.full_name} (${customer.email})</li>
          <li><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</li>
        </ul>
        
        <p>You can view this order in the admin panel.</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for NDR notification to customer
export function generateNdrNotificationEmail(order: any, customer: any, waybill: string, remarks: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Action Required for Your Shipment</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">Action Required for Your Shipment</h1>
        
        <p>Dear ${customer.full_name},</p>
        
        <p>There was an issue delivering your order #${order.order_number}.</p>
        
        <p><strong>Shipment Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Waybill Number:</strong> ${waybill}</li>
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Issue:</strong> ${remarks}</li>
        </ul>
        
        <p>Please contact our customer support team to resolve this issue or update your delivery information.</p>
        
        <p>You can reach us at support@nivara.in or call us at +91-XXXXXXXXXX.</p>
      </div>
    </body>
    </html>
  `
}

// Generate HTML email template for admin NDR notification
export function generateAdminNdrNotificationEmail(order: any, customer: any, waybill: string, remarks: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>NDR Alert - Action Required</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">NDR Alert - Action Required</h1>
        
        <p>An NDR (Not Delivered Response) alert has been received for a shipment.</p>
        
        <p><strong>Shipment Details:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Waybill Number:</strong> ${waybill}</li>
          <li><strong>Order Number:</strong> ${order.order_number}</li>
          <li><strong>Customer:</strong> ${customer.full_name} (${customer.email})</li>
          <li><strong>Issue:</strong> ${remarks}</li>
        </ul>
        
        <p>Please take appropriate action in the admin panel.</p>
      </div>
    </body>
    </html>
  `
}
