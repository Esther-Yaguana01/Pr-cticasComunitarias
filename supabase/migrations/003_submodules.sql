-- Submódulos por módulo (tabs) y vínculo con contents
-- Ejecutar en Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS public.submodules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (module_id, slug)
);

ALTER TABLE public.contents
  ADD COLUMN IF NOT EXISTS submodule_id UUID REFERENCES public.submodules(id) ON DELETE SET NULL;

ALTER TABLE public.submodules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "submodules_select_published_or_admin" ON public.submodules;
CREATE POLICY "submodules_select_published_or_admin"
  ON public.submodules FOR SELECT
  USING (is_published = TRUE OR public.is_super_admin());

DROP POLICY IF EXISTS "submodules_admin_all" ON public.submodules;
CREATE POLICY "submodules_admin_all"
  ON public.submodules FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());
