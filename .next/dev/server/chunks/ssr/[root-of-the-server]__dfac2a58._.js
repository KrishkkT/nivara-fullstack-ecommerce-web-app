module.exports = [
"[project]/Downloads/nivarasilverjewels/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/@neondatabase/serverless/index.mjs [app-rsc] (ecmascript)");
;
const sql = (...args)=>{
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }
    const sqlInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
    // @ts-ignore
    return sqlInstance(...args);
};
}),
"[project]/Downloads/nivarasilverjewels/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "getUserByEmail",
    ()=>getUserByEmail,
    "getUserById",
    ()=>getUserById,
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/db.ts [app-rsc] (ecmascript)");
;
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b)=>b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}
async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}
async function createUser(email, password, fullName, phone) {
    const passwordHash = await hashPassword(password);
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
    INSERT INTO users (email, password_hash, full_name, phone)
    VALUES (${email}, ${passwordHash}, ${fullName}, ${phone})
    RETURNING id, email, full_name, phone, role, created_at
  `;
    return result[0];
}
async function getUserByEmail(email) {
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
    SELECT id, email, password_hash, full_name, phone, role, created_at
    FROM users
    WHERE email = ${email}
  `;
    return result[0] || null;
}
async function getUserById(id) {
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
    SELECT id, email, full_name, phone, role, created_at
    FROM users
    WHERE id = ${id}
  `;
    return result[0] || null;
}
}),
"[project]/Downloads/nivarasilverjewels/app/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00bf77a795b6bd286fa1c69485148c9158a41e2a01":"signOut","4015e0ac9b4a68398ac2b65ea1f8b069a80118c3c6":"signIn","403a5fa11aba5d6a92ffa192bc3996b7d08d102b72":"signUp"},"",""] */ __turbopack_context__.s([
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function signUp(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const fullName = formData.get("fullName");
    const phone = formData.get("phone");
    // Validation
    if (!email || !password || !fullName) {
        return {
            error: "All fields are required"
        };
    }
    if (password.length < 8) {
        return {
            error: "Password must be at least 8 characters"
        };
    }
    try {
        // Check if user already exists
        const existingUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserByEmail"])(email);
        if (existingUser) {
            return {
                error: "Email already registered"
            };
        }
        // Create user
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUser"])(email, password, fullName, phone);
        // Create session
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSession"])({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set("session", token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });
        return {
            success: true
        };
    } catch (error) {
        console.error("[v0] Sign up error:", error);
        return {
            error: "Failed to create account"
        };
    }
}
async function signIn(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
        return {
            error: "Email and password are required"
        };
    }
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserByEmail"])(email);
        if (!user) {
            return {
                error: "Invalid email or password"
            };
        }
        const isValidPassword = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyPassword"])(password, user.password_hash);
        if (!isValidPassword) {
            return {
                error: "Invalid email or password"
            };
        }
        // Create session
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSession"])({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set("session", token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });
        return {
            success: true
        };
    } catch (error) {
        console.error("[v0] Sign in error:", error);
        return {
            error: "Failed to sign in"
        };
    }
}
async function signOut() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("session");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signUp,
    signIn,
    signOut
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signUp, "403a5fa11aba5d6a92ffa192bc3996b7d08d102b72", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signIn, "4015e0ac9b4a68398ac2b65ea1f8b069a80118c3c6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "00bf77a795b6bd286fa1c69485148c9158a41e2a01", null);
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/Downloads/nivarasilverjewels/lib/email.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateCustomerOrderConfirmationEmail",
    ()=>generateCustomerOrderConfirmationEmail,
    "generateOrderNotificationEmail",
    ()=>generateOrderNotificationEmail,
    "sendEmail",
    ()=>sendEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/nodemailer/lib/nodemailer.js [app-rsc] (ecmascript)");
;
// Create a transporter using SMTP
const createTransporter = ()=>{
    try {
        // For Gmail SMTP
        if (process.env.EMAIL_PROVIDER === 'gmail' && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            console.log('[v0] Using Gmail SMTP configuration');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
        }
        // For Outlook/Hotmail SMTP
        if (process.env.EMAIL_PROVIDER === 'outlook' && process.env.OUTLOOK_USER && process.env.OUTLOOK_PASSWORD) {
            console.log('[v0] Using Outlook SMTP configuration');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].createTransport({
                host: 'smtp-mail.outlook.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.OUTLOOK_USER,
                    pass: process.env.OUTLOOK_PASSWORD
                }
            });
        }
        // For custom SMTP (like SendGrid, Mailgun, etc.)
        if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
            console.log('[v0] Using custom SMTP configuration');
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
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
async function sendEmail(options) {
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
            text: options.text
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
    } catch (error) {
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
          <a href="${("TURBOPACK compile-time value", "https://nivarasilver.in") || 'https://your-site.com'}/admin/orders/${order.id}" 
             style="display: inline-block; padding: 10px 20px; background-color: #B29789; color: white; text-decoration: none; border-radius: 4px;">
            View Order Details
          </a>
        </p>
      </div>
    </body>
    </html>
  `;
}
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
          <a href="${("TURBOPACK compile-time value", "https://nivarasilver.in") || 'https://your-site.com'}/orders/${order.id}" 
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
"[project]/Downloads/nivarasilverjewels/app/actions/orders.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403e47e26e11f77761f2b9c2a98471a96164133b7c":"cancelOrder","40d9b7cda019874b123601549ab323cff7577f2e1b":"createOrder"},"",""] */ __turbopack_context__.s([
    "cancelOrder",
    ()=>cancelOrder,
    "createOrder",
    ()=>createOrder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/email.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function createOrder(data) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) {
            return {
                error: "Please sign in to place an order"
            };
        }
        // Generate order number
        const orderNumber = `NIVARA-${Date.now()}`;
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        SELECT name, price FROM products WHERE id = ${item.productId}
      `;
            await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
        VALUES (${orderId}, ${item.productId}, ${product[0].name}, ${item.price}, ${item.quantity})
      `;
        }
        // Clear cart
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      DELETE FROM cart_items WHERE user_id = ${session.userId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/cart");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/orders");
        // Revalidate the cart count API endpoint to update the cart counter
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/api/cart/count");
        // Save the checkout address as default if it's a new address
        try {
            // Only save if it's a new address (not from existing saved addresses)
            if (!data.shippingAddressId && data.shippingAddress) {
                // Check if this address already exists for this user
                const existingAddresses = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
          SELECT id FROM addresses 
          WHERE user_id = ${session.userId}
          AND address_line1 = ${data.shippingAddress.address_line1}
          AND city = ${data.shippingAddress.city}
          AND state = ${data.shippingAddress.state}
          AND postal_code = ${data.shippingAddress.postal_code}
        `;
                if (existingAddresses.length === 0) {
                    // Mark all existing addresses as non-default
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
            UPDATE addresses 
            SET is_default = false 
            WHERE user_id = ${session.userId}
          `;
                    // Save the new address as default
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
            UPDATE addresses 
            SET is_default = false 
            WHERE user_id = ${session.userId}
          `;
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
            UPDATE addresses 
            SET is_default = true 
            WHERE id = ${addressId}
          `;
                }
            } else if (data.shippingAddressId) {
                // If using an existing address, make it the default
                await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
          UPDATE addresses 
          SET is_default = false 
          WHERE user_id = ${session.userId}
        `;
                await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
            const adminEmailsResult = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        SELECT email FROM admin_emails WHERE is_active = true
      `;
            const adminEmails = adminEmailsResult.map((row)=>row.email);
            // Get order details for email
            const orderDetails = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
        SELECT o.*, u.full_name, u.email as customer_email, u.phone as customer_phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ${orderId}
      `;
            const orderItems = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
                    const addressResult = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
                    const emailHtml = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateOrderNotificationEmail"])(order, customer, orderItems, shippingAddress);
                    // Send email to admins
                    if (adminEmails.length > 0) {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
                            to: adminEmails,
                            subject: `New Order #${order.order_number} Received`,
                            html: emailHtml
                        });
                    }
                    // Send confirmation email to customer
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$email$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
                        to: customer.email,
                        subject: `Order Confirmation #${order.order_number}`,
                        html: generateCustomerOrderConfirmationEmail(order, customer, orderItems, shippingAddress)
                    });
                }
            }
        } catch (emailError) {
            console.error("[v0] Failed to send order notification email:", emailError);
            // Don't fail the order creation if email sending fails
            // But log this as a critical issue that needs attention
            console.error("[v0] CRITICAL: Email notification failed - this needs immediate attention!");
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
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) {
            return {
                error: "Please sign in to cancel order"
            };
        }
        // Check if order belongs to user
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/account");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/orders");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/orders/${orderId}`);
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
          <a href="${("TURBOPACK compile-time value", "https://nivarasilver.in") || 'https://your-site.com'}/orders/${order.id}" 
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createOrder,
    cancelOrder
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createOrder, "40d9b7cda019874b123601549ab323cff7577f2e1b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelOrder, "403e47e26e11f77761f2b9c2a98471a96164133b7c", null);
}),
"[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"401af00458668821159ce83d20fb6efe1fa1990eeb":"addCategory","4034cce345771ba811005606720b1704d25b7c4836":"deleteProduct","403b9b633e848ed75ec8b22897970b99a1776b66e1":"deleteCategory","4073598483a701b18cb18098ea5c114ef86fb00be6":"addProduct","408867af8e2270ca993b45b4be9e8102689d371ec9":"cancelOrder","601bba83073285f4640e291c92ff5c39392c34bb05":"updateCategory","60302545d25780565e7ee00a0e0b403425e7996969":"updateProduct","60da61b42a603d3f819adb883c51b078e96461ac83":"updateOrderStatus"},"",""] */ __turbopack_context__.s([
    "addCategory",
    ()=>addCategory,
    "addProduct",
    ()=>addProduct,
    "cancelOrder",
    ()=>cancelOrder,
    "deleteCategory",
    ()=>deleteCategory,
    "deleteProduct",
    ()=>deleteProduct,
    "updateCategory",
    ()=>updateCategory,
    "updateOrderStatus",
    ()=>updateOrderStatus,
    "updateProduct",
    ()=>updateProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function updateOrderStatus(orderId, status) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/orders");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to update order"
        };
    }
}
async function deleteProduct(productId) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      DELETE FROM products
      WHERE id = ${productId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/products");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to delete product"
        };
    }
}
async function addProduct(data) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const imagesJson = JSON.stringify(Array.isArray(data.images) ? data.images : [
            data.image_url
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO products (
        name, slug, description, price, category_id, image_url, images, metal_purity, design_number
      )
      VALUES (
        ${data.name}, ${slug}, ${data.description}, ${data.price}, 
        ${data.category_id}, ${data.image_url},
        ${imagesJson}, ${data.metal_purity || null}, ${data.design_number || null}
      )
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/products");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to add product"
        };
    }
}
async function updateProduct(productId, data) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        const imagesJson = JSON.stringify(Array.isArray(data.images) ? data.images : [
            data.image_url
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE products
      SET 
        name = ${data.name},
        description = ${data.description},
        price = ${data.price},
        category_id = ${data.category_id},
        image_url = ${data.image_url},
        images = ${imagesJson},
        metal_purity = ${data.metal_purity || null},
        design_number = ${data.design_number || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${productId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/products");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/products/${productId}`);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to update product"
        };
    }
}
async function addCategory(data) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const seoTitle = data.seo_title || `${data.name} | NIVARA Jewellery`;
        const seoDescription = data.seo_description || data.description;
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO categories (name, slug, description, image_url, meta_title, meta_description)
      VALUES (${data.name}, ${slug}, ${data.description}, ${data.image_url}, ${seoTitle}, ${seoDescription})
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/categories");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/categories");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to add category"
        };
    }
}
async function updateCategory(categoryId, data) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const seoTitle = data.seo_title || `${data.name} | NIVARA Jewellery`;
        const seoDescription = data.seo_description || data.description;
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE categories
      SET 
        name = ${data.name},
        slug = ${slug},
        description = ${data.description},
        image_url = ${data.image_url},
        meta_title = ${seoTitle},
        meta_description = ${seoDescription}
      WHERE id = ${categoryId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/categories");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/categories/${slug}`);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to update category"
        };
    }
}
async function deleteCategory(categoryId) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      DELETE FROM categories
      WHERE id = ${categoryId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/categories");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to delete category"
        };
    }
}
async function cancelOrder(orderId) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        // Check if order exists
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT * FROM orders WHERE id = ${orderId}
    `;
        if (order.length === 0) {
            return {
                success: false,
                error: "Order not found"
            };
        }
        // Only allow cancellation for pending or processing orders
        if (![
            "pending",
            "processing"
        ].includes(order[0].status)) {
            return {
                success: false,
                error: "Cannot cancel order in current status"
            };
        }
        // Update order status
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/orders");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/orders/${orderId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("[v0] Cancel order error:", error);
        return {
            success: false,
            error: "Failed to cancel order"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateOrderStatus,
    deleteProduct,
    addProduct,
    updateProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    cancelOrder
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateOrderStatus, "60da61b42a603d3f819adb883c51b078e96461ac83", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteProduct, "4034cce345771ba811005606720b1704d25b7c4836", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addProduct, "4073598483a701b18cb18098ea5c114ef86fb00be6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateProduct, "60302545d25780565e7ee00a0e0b403425e7996969", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addCategory, "401af00458668821159ce83d20fb6efe1fa1990eeb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCategory, "601bba83073285f4640e291c92ff5c39392c34bb05", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCategory, "403b9b633e848ed75ec8b22897970b99a1776b66e1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelOrder, "408867af8e2270ca993b45b4be9e8102689d371ec9", null);
}),
"[project]/Downloads/nivarasilverjewels/.next-internal/server/app/account/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/nivarasilverjewels/app/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Downloads/nivarasilverjewels/app/actions/orders.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/app/actions/orders.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/Downloads/nivarasilverjewels/.next-internal/server/app/account/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/nivarasilverjewels/app/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Downloads/nivarasilverjewels/app/actions/orders.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00bf77a795b6bd286fa1c69485148c9158a41e2a01",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"],
    "4015e0ac9b4a68398ac2b65ea1f8b069a80118c3c6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signIn"],
    "403a5fa11aba5d6a92ffa192bc3996b7d08d102b72",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signUp"],
    "403e47e26e11f77761f2b9c2a98471a96164133b7c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelOrder"],
    "408867af8e2270ca993b45b4be9e8102689d371ec9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelOrder"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f2e$next$2d$internal$2f$server$2f$app$2f$account$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Downloads/nivarasilverjewels/.next-internal/server/app/account/page/actions.js { ACTIONS_MODULE0 => "[project]/Downloads/nivarasilverjewels/app/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/Downloads/nivarasilverjewels/app/actions/orders.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/app/actions/orders.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dfac2a58._.js.map