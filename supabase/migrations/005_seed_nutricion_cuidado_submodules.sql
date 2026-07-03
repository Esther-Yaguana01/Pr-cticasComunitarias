-- Submódulos de Nutrición y Cuidado de la piel (idempotente)
-- Requiere: 003_submodules.sql

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
