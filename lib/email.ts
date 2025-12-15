import nodemailer from 'nodemailer';

// Create transporter only if email configuration is provided
let transporter: nodemailer.Transporter | null = null;

// Check if required environment variables are present
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const fromEmail = process.env.FROM_EMAIL || "NIVARA <noreply@nivara.in>";

if (smtpHost && smtpPort && smtpUser && smtpPassword) {
  transporter = nodemailer.createTransporter({
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });
} else {
  console.warn("[v0] SMTP configuration not complete. Email sending will be disabled.");
}

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
          ${shippingAddress.address_line1}<br>
          ${shippingAddress.address_line2 ? `${shippingAddress.address_line2}<br>` : ""}
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}<br>
          ${shippingAddress.country}
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
  // If transporter is not configured, log the email content and return
  if (!transporter) {
    console.warn("[v0] Email service not configured. Skipping email send.")
    console.log("[v0] Email content:", { to, subject, html })
    return { success: true, message: "Email service not configured" }
  }

  try {
    const result = await transporter.sendMail({
      from: fromEmail,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    })
    
    console.log("[v0] Email sent successfully:", result.messageId)
    return result
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    throw error
  }
}

// Generate HTML email template for customer order confirmation
export function generateCustomerOrderConfirmationEmail(order: any, customer: any, items: any[], shippingAddress: any): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">
        ${item.product_name}
        ${item.quantity > 1 ? `<br/><small>Quantity: ${item.quantity}</small>` : ''}
      </td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(Number(item.product_price) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

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
        
        <p>Thank you for your order! We've received your order and are processing it.</p>
        
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString('en-IN')}</p>
        <p><strong>Payment Method:</strong> Online Payment</p>
        
        <h2 style="color: #B29789; border-bottom: 2px solid #B29789; padding-bottom: 5px;">Shipping Address</h2>
        <p>
          ${shippingAddress?.address_line1 || ''}<br>
          ${shippingAddress?.address_line2 ? `${shippingAddress.address_line2}<br>` : ''}
          ${(shippingAddress?.city || '') + (shippingAddress?.state ? `, ${shippingAddress.state}` : '') + (shippingAddress?.postal_code ? ` ${shippingAddress.postal_code}` : '')}<br>
          ${shippingAddress?.country || ''}
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
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${Number(order.total_amount).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <p style="margin-top: 20px;">
          We'll notify you when your order has been shipped. If you have any questions, please contact us.
        </p>
        
        <p>Thank you for shopping with NIVARA!</p>
        
        <p style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com'}/orders/${order.id}" 
             style="display: inline-block; padding: 10px 20px; background-color: #B29789; color: white; text-decoration: none; border-radius: 4px;">
            View Order Details
          </a>
        </p>
      </div>
    </body>
    </html>
  `;
}