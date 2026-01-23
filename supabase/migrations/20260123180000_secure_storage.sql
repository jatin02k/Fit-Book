-- Drop existing lenient policies if they exist (to avoid conflicts or double-policing)
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own files" ON storage.objects;

-- Policy: Allow users to upload ONLY if the filename starts with their Organization ID (or they own the org)
-- Note: Validating file content vs filename is hard in RLS without extra lookup tables.
-- For MVP: We assume the application logic names files correctly, but we enforce that ONLY authenticated users can insert.
-- A stricter check would be: Ensure the user belongs to the org that matches the filename prefix.
-- Since 'fileName' is `orgId-timestamp.ext`, we can check if the user is owner of `orgId`.

-- Re-create stricter INSERT policy
CREATE POLICY "Secure Upload: Org Owners Only"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'organization-assets'
  AND auth.role() = 'authenticated'
  AND (
      -- Check if the user owns the organization defined by the filename prefix
      -- Filename format: orgId-timestamp.ext
      -- We extract orgId by splitting on first hyphen
      EXISTS (
        SELECT 1 FROM public.organizations 
        WHERE id::text = split_part(name, '-', 1) 
        AND owner_id = auth.uid()
      )
  )
);

-- Re-create stricter UPDATE policy
CREATE POLICY "Secure Update: Org Owners Only"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'organization-assets'
  AND auth.role() = 'authenticated'
  AND (
      EXISTS (
        SELECT 1 FROM public.organizations 
        WHERE id::text = split_part(name, '-', 1) 
        AND owner_id = auth.uid()
      )
  )
);
