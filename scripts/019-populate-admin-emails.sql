-- Populate admin_emails table with default admin email
-- This ensures email notifications can be sent to administrators

-- Insert default admin email if none exist
INSERT INTO admin_emails (email, is_active) 
VALUES ('krishthakker508@gmail.com', true)
ON CONFLICT (email) DO NOTHING;

-- Also insert a placeholder for the site owner
INSERT INTO admin_emails (email, is_active) 
VALUES ('admin@nivara.in', true)
ON CONFLICT (email) DO NOTHING;

-- Show current admin emails
SELECT * FROM admin_emails ORDER BY created_at DESC;