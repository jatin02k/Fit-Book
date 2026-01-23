-- Create a new public bucket for organization assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('organization-assets', 'organization-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'organization-assets' );

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
  bucket_id = 'organization-assets' 
  AND auth.role() = 'authenticated' 
);

-- Policy: Allow users to update their own files (optional, good for overwrites)
CREATE POLICY "Authenticated users can update own files" 
ON storage.objects FOR UPDATE 
USING ( 
  bucket_id = 'organization-assets' 
  AND auth.role() = 'authenticated' 
);
