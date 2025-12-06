module.exports = [
"[project]/Downloads/nivara-e-commerce-website/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/@neondatabase/serverless/index.mjs [app-rsc] (ecmascript)");
;
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
}),
"[project]/Downloads/nivara-e-commerce-website/lib/email.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Simple email utility for sending notifications
 * This is a placeholder implementation that can be expanded to use
 * services like SendGrid, Nodemailer, or other email providers
 */ __turbopack_context__.s([
    "generateOrderNotificationEmail",
    ()=>generateOrderNotificationEmail,
    "sendEmail",
    ()=>sendEmail
]);
async function sendEmail(options) {
    try {
        // In a real implementation, you would integrate with an email service here
        // For example, with SendGrid:
        /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: options.to,
      from: process.env.FROM_EMAIL || 'noreply@nivara.com',
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    */ // For now, we'll just log the email content
        console.log("=== EMAIL NOTIFICATION ===");
        console.log("To:", options.to);
        console.log("Subject:", options.subject);
        console.log("Body:", options.html);
        console.log("=========================");
        // Return true to indicate success
        return true;
    } catch (error) {
        console.error("[v0] Email sending error:", error);
        return false;
    }
}
function generateOrderNotificationEmail(order, customer, items, shippingAddress) {
    const itemsHtml = items.map((item)=>`
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
        <p><strong>Name:</strong> ${customer.full_name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        ${customer.phone ? `<p><strong>Phone:</strong> ${customer.phone}</p>` : ''}
        
        <h2 style="color: #B29789; border-bottom: 2px solid #B29789; padding-bottom: 5px;">Shipping Address</h2>
        <p>
          ${shippingAddress.address_line1}<br>
          ${shippingAddress.address_line2 ? `${shippingAddress.address_line2}<br>` : ''}
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
}),
"[project]/Downloads/nivara-e-commerce-website/app/actions/orders.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"404adf650000cf05c7eab0820bd5de2adb8cf1f2c9":"cancelOrder","40ee59ef0844ea18e550e0d2a01c43a0e857794915":"createOrder"},"",""] */ __turbopack_context__.s([
    "cancelOrder",
    ()=>cancelOrder,
    "createOrder",
    ()=>createOrder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/lib/email.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function createOrder(data) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) {
            return {
                error: "Please sign in to place an order"
            };
        }
        // Generate order number
        const orderNumber = `NIVARA-${Date.now()}`;
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO orders (
        user_id, 
        order_number, 
        total_amount, 
        status, 
        payment_status,
        payment_type,
        shipping_address,
        shipping_address_id
      )
      VALUES (
        ${session.userId},
        ${orderNumber},
        ${data.totalAmount},
        'pending',
        ${data.paymentMethod === "cod" ? "pending" : "awaiting_payment"},
        ${data.paymentMethod},
        ${data.shippingAddressId ? null : JSON.stringify(data.shippingAddress)},
        ${data.shippingAddressId || null}
      )
      RETURNING id
    `;
        const orderId = order[0].id;
        // Insert order items
        for (const item of data.items){
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        SELECT name, price FROM products WHERE id = ${item.productId}
      `;
            await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
        VALUES (${orderId}, ${item.productId}, ${product[0].name}, ${item.price}, ${item.quantity})
      `;
        }
        // Clear cart
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      DELETE FROM cart_items WHERE user_id = ${session.userId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/cart");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/orders");
        // Revalidate the cart count API endpoint to update the cart counter
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/api/cart/count");
        // Save the checkout address as default if it's a new address
        try {
            // Only save if it's a new address (not from existing saved addresses)
            if (!data.shippingAddressId && data.shippingAddress) {
                // Check if this address already exists for this user
                const existingAddresses = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
          SELECT id FROM addresses 
          WHERE user_id = ${session.userId}
          AND address_line1 = ${data.shippingAddress.address_line1}
          AND city = ${data.shippingAddress.city}
          AND state = ${data.shippingAddress.state}
          AND postal_code = ${data.shippingAddress.postal_code}
        `;
                if (existingAddresses.length === 0) {
                    // Mark all existing addresses as non-default
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
            UPDATE addresses 
            SET is_default = false 
            WHERE user_id = ${session.userId}
          `;
                    // Save the new address as default
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
            INSERT INTO addresses (
              user_id, 
              address_line1, 
              address_line2, 
              city, 
              state, 
              postal_code, 
              country, 
              is_default
            )
            VALUES (
              ${session.userId},
              ${data.shippingAddress.address_line1},
              ${data.shippingAddress.address_line2 || ''},
              ${data.shippingAddress.city},
              ${data.shippingAddress.state},
              ${data.shippingAddress.postal_code},
              ${data.shippingAddress.country || 'India'},
              true
            )
          `;
                } else {
                    // If address exists, make it the default
                    const addressId = existingAddresses[0].id;
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
            UPDATE addresses 
            SET is_default = false 
            WHERE user_id = ${session.userId}
          `;
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
            UPDATE addresses 
            SET is_default = true 
            WHERE id = ${addressId}
          `;
                }
            } else if (data.shippingAddressId) {
                // If using an existing address, make it the default
                await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
          UPDATE addresses 
          SET is_default = false 
          WHERE user_id = ${session.userId}
        `;
                await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
          UPDATE addresses 
          SET is_default = true 
          WHERE id = ${data.shippingAddressId}
        `;
            }
        } catch (addressError) {
            console.error("[v0] Failed to save default address:", addressError);
        // Don't fail the order creation if address saving fails
        }
        // Send email notifications to admin emails and customer
        try {
            // Get active admin emails
            const adminEmailsResult = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        SELECT email FROM admin_emails WHERE is_active = true
      `;
            const adminEmails = adminEmailsResult.map((row)=>row.email);
            // Get order details for email
            const orderDetails = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        SELECT o.*, u.full_name, u.email as customer_email, u.phone as customer_phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ${orderId}
      `;
            const orderItems = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        SELECT * FROM order_items WHERE order_id = ${orderId}
      `;
            if (orderDetails.length > 0) {
                const order = orderDetails[0];
                const customer = {
                    full_name: order.full_name,
                    email: order.customer_email,
                    phone: order.customer_phone
                };
                // Get shipping address
                let shippingAddress = null;
                if (order.shipping_address_id) {
                    const addressResult = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
            SELECT * FROM addresses WHERE id = ${order.shipping_address_id}
          `;
                    if (addressResult.length > 0) {
                        shippingAddress = addressResult[0];
                    }
                } else if (order.shipping_address) {
                    try {
                        shippingAddress = JSON.parse(order.shipping_address);
                    } catch (e) {
                        shippingAddress = {};
                    }
                }
                if (shippingAddress) {
                    const emailHtml = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateOrderNotificationEmail"])(order, customer, orderItems, shippingAddress);
                    // Send email to admins
                    if (adminEmails.length > 0) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
                            to: adminEmails,
                            subject: `New Order #${order.order_number} Received`,
                            html: emailHtml
                        });
                    }
                    // Send confirmation email to customer
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
                        to: customer.email,
                        subject: `Order Confirmation #${order.order_number}`,
                        html: generateCustomerOrderConfirmationEmail(order, customer, orderItems, shippingAddress)
                    });
                }
            }
        } catch (emailError) {
            console.error("[v0] Failed to send order notification email:", emailError);
        // Don't fail the order creation if email sending fails
        }
        return {
            success: true,
            orderId,
            orderNumber
        };
    } catch (error) {
        console.error("[v0] Create order error:", error);
        return {
            error: "Failed to create order"
        };
    }
}
async function cancelOrder(orderId) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) {
            return {
                error: "Please sign in to cancel order"
            };
        }
        // Check if order belongs to user
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT * FROM orders WHERE id = ${orderId} AND user_id = ${session.userId}
    `;
        if (order.length === 0) {
            return {
                error: "Order not found"
            };
        }
        // Only allow cancellation for pending or processing orders
        if (![
            "pending",
            "processing"
        ].includes(order[0].status)) {
            return {
                error: "Cannot cancel order in current status"
            };
        }
        // Update order status
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/account");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/orders");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/orders/${orderId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("[v0] Cancel order error:", error);
        return {
            error: "Failed to cancel order"
        };
    }
}
// Generate HTML email template for customer order confirmation
function generateCustomerOrderConfirmationEmail(order, customer, items, shippingAddress) {
    const itemsHtml = items.map((item)=>`
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
        
        <p>Dear ${customer.full_name},</p>
        
        <p>Thank you for your order! We've received your order and are processing it.</p>
        
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString('en-IN')}</p>
        <p><strong>Payment Method:</strong> ${order.payment_type === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
        
        <h2 style="color: #B29789; border-bottom: 2px solid #B29789; padding-bottom: 5px;">Shipping Address</h2>
        <p>
          ${shippingAddress.address_line1}<br>
          ${shippingAddress.address_line2 ? `${shippingAddress.address_line2}<br>` : ''}
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
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createOrder,
    cancelOrder
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createOrder, "40ee59ef0844ea18e550e0d2a01c43a0e857794915", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelOrder, "404adf650000cf05c7eab0820bd5de2adb8cf1f2c9", null);
}),
"[project]/Downloads/nivara-e-commerce-website/.next-internal/server/app/checkout/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/nivara-e-commerce-website/app/actions/orders.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$app$2f$actions$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/app/actions/orders.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Downloads/nivara-e-commerce-website/.next-internal/server/app/checkout/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/nivara-e-commerce-website/app/actions/orders.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40ee59ef0844ea18e550e0d2a01c43a0e857794915",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$app$2f$actions$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createOrder"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f2e$next$2d$internal$2f$server$2f$app$2f$checkout$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$app$2f$actions$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Downloads/nivara-e-commerce-website/.next-internal/server/app/checkout/page/actions.js { ACTIONS_MODULE0 => "[project]/Downloads/nivara-e-commerce-website/app/actions/orders.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$app$2f$actions$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/app/actions/orders.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Downloads_nivara-e-commerce-website_225f2901._.js.map