DROP POLICY "Active users read cases" ON public.diagnostic_cases;
DROP FUNCTION public.has_active_access(uuid);
CREATE POLICY "Active users read cases" ON public.diagnostic_cases
FOR SELECT TO authenticated USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.user_access ua
    WHERE ua.user_id = auth.uid() AND ua.status = 'active' AND ua.access_expires_at > now()
  )
);