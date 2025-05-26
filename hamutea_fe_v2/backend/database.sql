-- Add google_id column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL;

-- Add phone column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL;

-- Add phone_verified column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified TINYINT(1) NOT NULL DEFAULT 0;

-- Add email_verified column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified TINYINT(1) NOT NULL DEFAULT 0;

-- Add email_verification_token column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255) NULL;

-- Add birth_date column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date VARCHAR(20) NULL;