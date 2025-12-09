NIVARA E-Commerce Website
A premium silver jewellery e-commerce platform built with Next.js 16, TypeScript, and Tailwind CSS.

Features
Customer Portal

Product browsing and search
Shopping cart and wishlist
Secure checkout with Razorpay and COD options
Order tracking and history
Saved addresses management
Admin Dashboard

Order management with status tracking
Product and category management
Email notification system
Real-time statistics
Technical Highlights

Responsive design for all devices
Server Actions for backend operations
PostgreSQL database with Neon
JWT-based authentication
SEO-friendly architecture
Tech Stack
Frontend: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
Backend: Server Actions, PostgreSQL (Neon DB)
Payments: Razorpay
Authentication: JWT with HTTP-only cookies
Deployment: Vercel
Getting Started
Install Dependencies

npm install
Environment Setup Create a .env file with the following variables:

DATABASE_URL=your_neon_db_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_public_razorpay_key_id

# Email Configuration (Choose one option below)

# Option 1: Gmail (Recommended for most users)
EMAIL_PROVIDER=gmail
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
FROM_EMAIL="Your Store Name <your_gmail_address@gmail.com>"

# Option 2: Custom SMTP (For custom domains)
# EMAIL_PROVIDER=smtp
# SMTP_HOST=your_smtp_host
# SMTP_PORT=587
# SMTP_USER=your_smtp_username
# SMTP_PASSWORD=your_smtp_password
# SMTP_SECURE=false
# FROM_EMAIL="Your Store Name <noreply@yourdomain.com>"

# Site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
Database Setup Run the SQL scripts in the scripts/ directory in order to set up your database.

Run Development Server

npm run dev
Deployment
Deploy to Vercel or any compatible hosting platform. Ensure environment variables are properly configured.

Security
All sensitive information is stored in environment variables
Passwords are hashed using Web Crypto API
JWT tokens are stored in HTTP-only cookies
Database connections use SSL
Support
For support, contact the development team or check the documentation.