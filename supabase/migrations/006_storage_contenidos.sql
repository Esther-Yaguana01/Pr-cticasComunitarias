-- Bucket de archivos (PDF y videos) + políticas de acceso
-- Ejecutar en Supabase → SQL Editor

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contenidos',
  'contenidos',
  TRUE,
  52428800,
  ARRAY[
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "contenidos_public_read" ON storage.objects;
CREATE POLICY "contenidos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'contenidos');

DROP POLICY IF EXISTS "contenidos_admin_insert" ON storage.objects;
CREATE POLICY "contenidos_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'contenidos'
    AND public.is_super_admin()
  );

DROP POLICY IF EXISTS "contenidos_admin_update" ON storage.objects;
CREATE POLICY "contenidos_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'contenidos' AND public.is_super_admin())
  WITH CHECK (bucket_id = 'contenidos' AND public.is_super_admin());

DROP POLICY IF EXISTS "contenidos_admin_delete" ON storage.objects;
CREATE POLICY "contenidos_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'contenidos' AND public.is_super_admin());
