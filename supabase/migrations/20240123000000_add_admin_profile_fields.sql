-- Add profile fields to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN organizations.profile_image_url IS 'URL to the admin profile picture';
COMMENT ON COLUMN organizations.bio IS 'Short biography of the admin/business owner';
COMMENT ON COLUMN organizations.headline IS 'Professional headline or tagline';
COMMENT ON COLUMN organizations.social_links IS 'Array of social media links {platform, url}';
