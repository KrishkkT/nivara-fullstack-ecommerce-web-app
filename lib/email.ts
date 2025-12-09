import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

// Create a transporter using SMTP
const createTransporter = () => {
  try {
    // For Gmail SMTP
    if (process.env.EMAIL_PROVIDER === 'gmail' && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('[v0] Using Gmail SMTP configuration');
      return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }
    
    // For Outlook/Hotmail SMTP
    if (process.env.EMAIL_PROVIDER === 'outlook' && process.env.OUTLOOK_USER && process.env.OUTLOOK_PASSWORD) {
      console.log('[v0] Using Outlook SMTP configuration');
      return nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.OUTLOOK_USER,
          pass: process.env.OUTLOOK_PASSWORD,
        },
      });
    }
    
    // For custom SMTP (like SendGrid, Mailgun, etc.)
    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      console.log('[v0] Using custom SMTP configuration');
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
    
    console.log('[v0] No email provider configured');
    // Fallback to console logging if no email configuration is provided
    return null;
  } catch (error) {
    console.error('[v0] Error creating email transporter:', error);
    return null;
  }
};

// Send email function using nodemailer
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    // If no transporter is configured, fallback to console logging
    if (!transporter) {
      console.log("=== EMAIL NOTIFICATION (FALLBACK MODE) ===");
      console.log("Subject:", options.subject);
      console.log("To:", options.to);
      console.log("=========================");
      return true;
    }
    
    // Configure email data
    const mailOptions = {
      from: process.env.FROM_EMAIL || `"NIVARA Store" <${process.env.GMAIL_USER || 'noreply@nivara.com'}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };
    
    console.log('[v0] Attempting to send email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    // Verify connection configuration
    await transporter.verify();
    console.log('[v0] Server is ready to take our messages');
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('[v0] Email sent successfully. Message ID:', info.messageId);
    return true;
  } catch (error: any) {
    console.error("[v0] Email sending error occurred:", error.message);
    console.error("[v0] Error details:", error);
    // Log environment variables (without sensitive data)
    console.log('[v0] Email config:', {
      EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
      GMAIL_USER: process.env.GMAIL_USER,
      FROM_EMAIL: process.env.FROM_EMAIL,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT
    });
    return false;
  }
}

// Generate HTML email template for order notifications
export function generateOrderNotificationEmail(order: any, customer: any, items: any[], shippingAddress: any): string {
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
      <title>New Order Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #B29789;">New Order Received</h1>
        
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString('en-IN')}</p>
        <p><strong>Payment Method:</strong> ${order.payment_type === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
        
        <h2 style="color: #B29789; border-bottom: 2px solid #B29789; padding-bottom: 5px;">Customer Information</h2>
        <p><strong>Name:</strong> ${customer.full_name || ''}</p>
        <p><strong>Email:</strong> ${customer.email || ''}</p>
        ${customer.phone ? `<p><strong>Phone:</strong> ${customer.phone}</p>` : ''}
        
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
        
        <p style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.com'}/admin/orders/${order.id}" 
             style="display: inline-block; padding: 10px 20px; background-color: #B29789; color: white; text-decoration: none; border-radius: 4px;">
            View Order Details
          </a>
        </p>
      </div>
    </body>
    </html>
  `;
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
        <p><strong>Payment Method:</strong> ${order.payment_type === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
        
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