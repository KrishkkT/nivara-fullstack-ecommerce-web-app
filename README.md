# Nivara E-commerce Web App

A full-stack e-commerce web application built with Next.js 14+, TypeScript, and PostgreSQL.

## Features

- User authentication (login, registration, password reset)
- Product catalog with categories
- Shopping cart and wishlist functionality
- Checkout process with Razorpay integration
- Order management
- Admin panel for product, category, and order management
- Logistics integration with Shiprocket
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, PostgreSQL
- **Authentication:** JWT-based sessions
- **Payments:** Razorpay
- **Logistics:** Shiprocket
- **UI Components:** shadcn/ui, Radix UI
- **Database:** PostgreSQL with @neondatabase/serverless
- **Email:** Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Shiprocket API credentials
- Razorpay API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nivara-fullstack-ecommerce-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` file to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your actual values. Key variables include:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `SESSION_SECRET` - A random string for session encryption
   - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` - Your Razorpay API keys
   - `SHIPROCKET_API_TOKEN` - Your Shiprocket API token (recommended) or use email/password
   
   See `.env.example` for a complete list of required variables.

4. Run database migrations:
   ```bash
   # Run all SQL scripts in the scripts directory in numerical order
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
app/                  # Next.js app directory with pages and API routes
components/           # React components
lib/                  # Utility functions and database connections
scripts/              # Database migration scripts
styles/               # Global styles
public/               # Static assets
```

## Key Features Implementation

### Authentication
- Session-based authentication with JWT
- Password hashing with bcryptjs
- OTP-based password reset

### Product Management
- Category-based product organization
- Product search and filtering
- Image upload and management

### Cart & Wishlist
- Persistent cart and wishlist using database
- Real-time updates

### Checkout & Payments
- Integrated Razorpay payment gateway
- Order confirmation and email notifications

### Admin Panel
- Dashboard with sales analytics
- Product, category, and order management
- User management

### Logistics
- Shiprocket integration for order fulfillment
- Order tracking
- Pickup management
- See [Shiprocket Integration Documentation](SHIPROCKET_INTEGRATION.md) for details

## Deployment

The application can be deployed to Vercel with the following considerations:

1. Set up environment variables in Vercel dashboard
2. Configure PostgreSQL database connection
3. Ensure all API keys are properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.