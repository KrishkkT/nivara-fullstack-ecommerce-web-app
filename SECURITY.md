# Security Implementation

This document outlines the security measures implemented in the Nivara e-commerce application.

## Authentication & Authorization

### Password Security
- Passwords are hashed using bcrypt with a cost factor of 12
- Salt is automatically generated for each password
- SHA-256 without salt has been replaced with proper bcrypt implementation

### Session Management
- JWT tokens are used for session management
- Tokens are signed with a strong secret key
- Sessions expire after 7 days
- Secure cookie attributes are set:
  - HttpOnly: Prevents XSS attacks
  - Secure: Only transmitted over HTTPS in production
  - SameSite: Lax protection against CSRF
  - Path: Root path for broad applicability

### Role-Based Access Control
- Users have roles (customer, admin)
- Admin routes are protected and only accessible by admin users
- Protected routes include account, checkout, cart, and orders

## Input Validation & Sanitization

### Form Data Sanitization
- All user inputs are sanitized to prevent XSS attacks
- HTML entities are escaped
- Special characters are converted to their HTML entity equivalents

### Email Validation
- Email format is validated using regex
- Emails are sanitized before processing
- Invalid email formats are rejected

### Phone Number Validation
- Phone numbers are validated for proper format
- Only digits are accepted
- Length is validated for Indian phone numbers (10 digits)

## Rate Limiting

### API Protection
- Rate limiting is implemented to prevent abuse
- 100 requests per 15 minutes per IP address
- Exceeding the limit results in a 429 Too Many Requests response
- Retry-After header indicates when requests can resume

## Security Headers

### HTTP Headers
- X-Frame-Options: DENY (prevents clickjacking)
- X-Content-Type-Options: nosniff (prevents MIME type sniffing)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Restricts access to sensitive APIs

### Content Security Policy
- Script sources restricted to self and trusted domains
- Style sources restricted to self
- Image sources allowed from self and HTTPS sources
- Font sources restricted to self
- Connect sources restricted to self and Razorpay domains
- Frame sources restricted to Razorpay domains

## Email Security

### Email Validation
- All email addresses are validated before sending
- Admin email addresses are stored in a separate table
- Active status is checked before sending notifications

### Email Content
- HTML emails are properly formatted
- No user input is directly embedded without sanitization

## Database Security

### SQL Injection Prevention
- Parameterized queries are used throughout the application
- User input is never directly concatenated into SQL queries
- The sql tagged template function ensures proper escaping

## Environment Variables

### Sensitive Data
- Secrets are stored in environment variables
- JWT secret is used for signing tokens
- Database credentials are not hardcoded
- Email service credentials are stored securely

## Error Handling

### Information Disclosure
- Detailed error messages are logged server-side only
- Generic error messages are shown to users
- Stack traces are not exposed to clients

## Deployment Security

### Production Considerations
- Secure cookies are enforced in production
- Console logs are removed in production builds
- Strong secret keys should be used in production
- Regular security audits are recommended

## Future Improvements

### Recommended Enhancements
- Implement two-factor authentication (2FA)
- Add account lockout after failed login attempts
- Implement OAuth providers (Google, Facebook)
- Add password strength validation
- Implement session invalidation
- Add security logging and monitoring
- Implement CSRF protection tokens
- Add automated security scanning