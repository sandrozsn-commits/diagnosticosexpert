-- Defense in depth for paid diagnostic content.
-- Authenticated users can only SELECT cases when the RLS policy confirms active, unexpired access.

REVOKE ALL ON TABLE public.diagnostic_cases FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.diagnostic_cases FROM authenticated;
GRANT SELECT ON TABLE public.diagnostic_cases TO authenticated;

ALTER TABLE public.diagnostic_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_cases FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active users read cases" ON public.diagnostic_cases;
CREATE POLICY "Active users read cases"
ON public.diagnostic_cases
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.user_access ua
    WHERE ua.user_id = auth.uid()
      AND ua.status = 'active'
      AND ua.access_expires_at > now()
  )
);

-- Access records are readable only by their owner and never writable from the client.
REVOKE ALL ON TABLE public.user_access FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.user_access FROM authenticated;
GRANT SELECT ON TABLE public.user_access TO authenticated;

ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access FORCE ROW LEVEL SECURITY;
