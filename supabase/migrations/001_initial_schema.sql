-- Fase 1: esquema base, RLS y módulos iniciales
-- Ejecutar en Supabase → SQL Editor

CREATE TYPE public.user_role AS ENUM ('CAREGIVER', 'SUPER_ADMIN');
CREATE TYPE public.entity_type AS ENUM ('MIES', 'OTRO');
CREATE TYPE public.content_type AS ENUM ('text', 'image', 'video', 'pdf');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  entity public.entity_type,
  role public.user_role NOT NULL DEFAULT 'CAREGIVER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  type public.content_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  file_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.caregiver_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.contents(id) ON DELETE SET NULL,
  progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, module_id, content_id)
);

CREATE TABLE public.suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, entity, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'entity', '')::public.entity_type,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'role', '')::public.user_role,
      'CAREGIVER'
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "modules_select_published_or_admin"
  ON public.modules FOR SELECT
  USING (is_published = TRUE OR public.is_super_admin());

CREATE POLICY "modules_admin_all"
  ON public.modules FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "contents_select_published_or_admin"
  ON public.contents FOR SELECT
  USING (is_published = TRUE OR public.is_super_admin());

CREATE POLICY "contents_admin_all"
  ON public.contents FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "progress_select_own_or_admin"
  ON public.caregiver_progress FOR SELECT
  USING (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "progress_insert_own_or_admin"
  ON public.caregiver_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "progress_update_own_or_admin"
  ON public.caregiver_progress FOR UPDATE
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "progress_delete_own_or_admin"
  ON public.caregiver_progress FOR DELETE
  USING (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "suggestions_insert_public"
  ON public.suggestions FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "suggestions_select_own_or_admin"
  ON public.suggestions FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "suggestions_update_admin"
  ON public.suggestions FOR UPDATE
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

INSERT INTO public.modules (title, description, slug, is_published, sort_order) VALUES
  ('Asesoría de imagen', 'Tipo de cuerpo, color y estilo propio', 'asesoria-imagen', TRUE, 1),
  ('Nutrición', 'Alimentación saludable y hábitos', 'nutricion', TRUE, 2),
  ('Cuidado de la piel', 'Rutinas y prevención de trastornos', 'cuidado-piel', TRUE, 3);
