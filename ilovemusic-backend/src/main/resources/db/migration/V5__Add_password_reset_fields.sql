-- Add password reset fields to users table
ALTER TABLE users ADD COLUMN reset_token VARCHAR(500);
ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN password_reset_attempts INTEGER NOT NULL DEFAULT 0;

-- Add index for faster email lookups
CREATE INDEX idx_users_email_verified ON users(email_verified);

