CREATE TABLE public.diagnostic_cases (
  id text PRIMARY KEY,
  number integer NOT NULL UNIQUE,
  category text NOT NULL,
  difficulty text NOT NULL,
  title text NOT NULL,
  summary jsonb NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.diagnostic_cases TO authenticated;
GRANT ALL ON public.diagnostic_cases TO service_role;
ALTER TABLE public.diagnostic_cases ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_active_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.user_access
    WHERE user_id = _user_id AND status = 'active' AND access_expires_at > now()
  )
$$;

CREATE POLICY "Active users read cases" ON public.diagnostic_cases
FOR SELECT TO authenticated USING (public.has_active_access(auth.uid()));

CREATE TRIGGER diagnostic_cases_updated_at BEFORE UPDATE ON public.diagnostic_cases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();