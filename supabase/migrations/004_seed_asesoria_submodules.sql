-- Submódulos de Asesoría de imagen (idempotente)
-- Requiere: 001_initial_schema.sql y 003_submodules.sql

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
