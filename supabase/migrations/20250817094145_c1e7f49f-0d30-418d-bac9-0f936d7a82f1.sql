-- Fix profiles table: Add missing INSERT policy
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Clean up waitlist_signups policies and fix them
DROP POLICY IF EXISTS "Admin can view all waitlist entries" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Public can only count waitlist entries" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Anyone can insert waitlist signup" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Anyone can insert waitlist signups" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Prevent unauthorized deletions" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Prevent unauthorized modifications" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Users can view own waitlist entries" ON public.waitlist_signups;

-- Create proper waitlist policies
CREATE POLICY "Anyone can insert waitlist signups" 
ON public.waitlist_signups 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Users can view their own waitlist entries" 
ON public.waitlist_signups 
FOR SELECT 
TO authenticated
USING (auth.email() = email);

-- Secure survey respondent tables - restrict to authenticated users only
-- (These tables contain personal demographic data)

-- Denmark respondents
DROP POLICY IF EXISTS "Authenticated research access only" ON public.dk_respondents;
CREATE POLICY "Authenticated research access only" 
ON public.dk_respondents 
FOR SELECT 
TO authenticated
USING (true);

-- Finland respondents  
DROP POLICY IF EXISTS "Authenticated research access only" ON public.fin_respondents;
CREATE POLICY "Authenticated research access only" 
ON public.fin_respondents 
FOR SELECT 
TO authenticated
USING (true);

-- Add missing RLS policies for Norway and Sweden respondent tables if they exist
DO $$
BEGIN
    -- Check if nor_respondents table exists and add policy
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nor_respondents' AND table_schema = 'public') THEN
        -- Drop existing policy if it exists
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated research access only" ON public.nor_respondents';
        -- Create new policy
        EXECUTE 'CREATE POLICY "Authenticated research access only" ON public.nor_respondents FOR SELECT TO authenticated USING (true)';
    END IF;
    
    -- Check if swe_respondents table exists and add policy
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'swe_respondents' AND table_schema = 'public') THEN
        -- Drop existing policy if it exists
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated research access only" ON public.swe_respondents';
        -- Create new policy
        EXECUTE 'CREATE POLICY "Authenticated research access only" ON public.swe_respondents FOR SELECT TO authenticated USING (true)';
    END IF;
END $$;