-- ============================================================
-- EJECUTAR TODO ESTE ARCHIVO EN SUPABASE → SQL Editor → Run
-- Crea la tabla submodules + submódulos de los 3 módulos
-- ============================================================

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

-- Asesoría de imagen
INSERT INTO public.submodules (module_id, title, slug, is_published, sort_order)
SELECT m.id, v.title, v.slug, TRUE, v.sort_order
FROM public.modules m
CROSS JOIN (
  VALUES
    ('Imagen Personal y Autoconocimiento', 'imagen-personal-autoconocimiento', 1),
    ('Visagismo y Estilo Personal', 'visagismo-estilo-personal', 2),
    ('Colorimetría y Armonía de la Imagen', 'colorimetria-armonia-imagen', 3),
    ('Imagen Profesional y Marca Personal', 'imagen-profesional-marca-personal', 4)
) AS v(title, slug, sort_order)
WHERE m.slug = 'asesoria-imagen'
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- Nutrición
INSERT INTO public.submodules (module_id, title, slug, is_published, sort_order)
SELECT m.id, v.title, v.slug, TRUE, v.sort_order
FROM public.modules m
CROSS JOIN (
  VALUES
    ('Alimentación Saludable y Equilibrada', 'alimentacion-saludable-equilibrada', 1),
    ('Nutrición para la Belleza y el Bienestar', 'nutricion-belleza-bienestar', 2),
    ('Hábitos Saludables e Hidratación', 'habitos-saludables-hidratacion', 3),
    ('Educación Nutricional y Prevención', 'educacion-nutricional-prevencion', 4)
) AS v(title, slug, sort_order)
WHERE m.slug = 'nutricion'
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- Cuidado de la piel
INSERT INTO public.submodules (module_id, title, slug, is_published, sort_order)
SELECT m.id, v.title, v.slug, TRUE, v.sort_order
FROM public.modules m
CROSS JOIN (
  VALUES
    ('Conociendo tu Piel', 'conociendo-tu-piel', 1),
    ('Rutinas y Cuidados Básicos', 'rutinas-cuidados-basicos', 2),
    ('Prevención y Protección Cutánea', 'prevencion-proteccion-cutanea', 3),
    ('Tratamientos y Bienestar Facial', 'tratamientos-bienestar-facial', 4)
) AS v(title, slug, sort_order)
WHERE m.slug = 'cuidado-piel'
ON CONFLICT (module_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

NOTIFY pgrst, 'reload schema';
