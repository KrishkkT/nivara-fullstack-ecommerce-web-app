# Email Configuration

To enable email notifications in the NIVARA ecommerce platform, you need to configure the SMTP settings in your environment variables.

## Required Environment Variables

Add the following variables to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false

# Optional - From Email (defaults to "NIVARA <noreply@nivara.in>")
FROM_EMAIL=NIVARA <noreply@nivara.in>

# Site URL for links in emails
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Gmail SMTP Configuration Example

If you're using Gmail for sending emails:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
FROM_EMAIL=NIVARA <your-gmail@gmail.com>
```

**Note:** For Gmail, you need to use an App Password instead of your regular password. Enable 2-Factor Authentication and generate an App Password in your Google Account settings.

## Testing Email Configuration

To test if your email configuration is working:

1. Make sure all required environment variables are set
2. Run the test script:
   ```bash
   node test-email-functionality.mjs
   ```

## Admin Notification Emails

To receive admin notifications for new orders:

1. Ensure the `admin_emails` table exists in your database
2. Add admin email addresses to the table:
   ```sql
   INSERT INTO admin_emails (email, is_active) VALUES ('admin@yourdomain.com', true);
   ```

## Troubleshooting

If emails are not being sent:

1. Check that all SMTP environment variables are correctly set
2. Verify that your SMTP credentials are correct
3. Ensure that your hosting provider allows outgoing SMTP connections
4. Check the application logs for any email-related errors
5. Make sure the `admin_emails` table exists and has valid email addresses

## Email Templates

The application uses HTML email templates that can be customized in:
- `lib/email.ts` - Contains all email template functions

You can modify these templates to match your brand styling.