-- Create OTPs table for password reset verification
CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for OTP table to improve query performance
CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);

-- Add comment for documentation
COMMENT ON TABLE otps IS 'Stores one-time passwords for password reset functionality';