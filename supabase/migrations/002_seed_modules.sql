-- Módulos iniciales (idempotente: se puede ejecutar más de una vez)
-- Requiere que exista la tabla public.modules (001_initial_schema.sql)

INSERT INTO public.modules (title, description, slug, is_published, sort_order)
VALUES
  ('Asesoría de imagen', 'Tipo de cuerpo, color y estilo propio', 'asesoria-imagen', TRUE, 1),
  ('Nutrición', 'Alimentación saludable y hábitos', 'nutricion', TRUE, 2),
  ('Cuidado de la piel', 'Rutinas y prevención de trastornos', 'cuidado-piel', TRUE, 3)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
