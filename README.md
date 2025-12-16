# NIVARA - The Art of Subtle Luxury

A premium e-commerce platform for sterling silver jewellery, built with Next.js 14, TypeScript, and PostgreSQL.

## Features

- **Modern UI/UX**: Clean, elegant design with a focus on showcasing jewellery
- **Full E-commerce Functionality**: Product catalog, shopping cart, wishlist, and checkout
- **User Accounts**: Registration, login, and profile management
- **Admin Dashboard**: Complete backend for managing products, orders, and content
- **Secure Payments**: Integration with Razorpay for online payments
- **Email Notifications**: Automated emails for order confirmations, shipping updates, etc.
- **Responsive Design**: Mobile-first approach for all device sizes
- **SEO Optimized**: Proper metadata and structured data for search engines

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: PostgreSQL, Next.js Server Actions, Next.js API Routes
- **UI Components**: shadcn/ui, Radix UI
- **Authentication**: Custom session-based auth
- **Payments**: Razorpay
- **Email**: Nodemailer (optional)
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations
5. Start the development server with `pnpm dev`

## Email Configuration

To enable email notifications, configure one of the following in your `.env` file:

### Option 1: Gmail (Recommended for development/testing)
```
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Option 2: Generic SMTP
```
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_SECURE=false
```

### Optional Settings
```
FROM_EMAIL=NIVARA <noreply@nivara.in>
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

## Deployment

Deployed on Vercel with PostgreSQL database and optional Nodemailer for email services.