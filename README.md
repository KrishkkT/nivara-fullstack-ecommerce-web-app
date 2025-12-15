# NIVARA - The Art of Subtle Luxury

A premium e-commerce platform for sterling silver jewellery, built with Next.js 14, TypeScript, and PostgreSQL.

## Features

- **Modern UI/UX**: Clean, elegant design with a focus on showcasing jewellery
- **Full E-commerce Functionality**: Product catalog, shopping cart, wishlist, and checkout
- **User Accounts**: Registration, login, and profile management
- **Admin Dashboard**: Complete backend for managing products, orders, and content
- **Secure Payments**: Integration with Razorpay for online payments
- **Responsive Design**: Mobile-first approach for all device sizes
- **SEO Optimized**: Proper metadata and structured data for search engines

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: PostgreSQL, Next.js Server Actions, Next.js API Routes
- **UI Components**: shadcn/ui, Radix UI
- **Authentication**: Custom session-based auth
- **Payments**: Razorpay
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations
5. Start the development server with `pnpm dev`

## Deployment

Deployed on Vercel with PostgreSQL database and Resend for email services.

## Security

- All sensitive information is stored in environment variables
- Passwords are hashed using Web Crypto API
- JWT tokens are stored in HTTP-only cookies
- Database connections use SSL

## Support

For support, contact the development team or check the documentation.