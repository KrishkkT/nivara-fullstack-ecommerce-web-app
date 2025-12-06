-- Create admin_emails table for storing admin notification email addresses
CREATE TABLE IF NOT EXISTS admin_emails (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin email
INSERT INTO admin_emails (email, is_active) 
VALUES ('krishthakker508@gmail.com', true)
ON CONFLICT (email) DO NOTHING;