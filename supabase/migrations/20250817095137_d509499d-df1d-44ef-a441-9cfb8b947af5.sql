-- Phase 1: Critical Security Fixes (Fixed)

-- 1. Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'researcher', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Create security definer functions to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.is_researcher()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'researcher') OR public.has_role(auth.uid(), 'admin')
$$;

-- 3. RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.is_admin());

-- 4. Update profiles table RLS policies for better privacy (using correct column 'id')
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile only"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile only"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile only"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 5. Secure waitlist_signups - only admins can access
DROP POLICY IF EXISTS "Anyone can view waitlist signups" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.waitlist_signups;

CREATE POLICY "Only admins can view waitlist signups"
ON public.waitlist_signups
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Anyone can sign up for waitlist"
ON public.waitlist_signups
FOR INSERT
WITH CHECK (true);

-- 6. Secure survey respondent data - only researchers and admins
DROP POLICY IF EXISTS "Authenticated research access only" ON public.dk_respondents;
DROP POLICY IF EXISTS "Authenticated research access only" ON public.fin_respondents;

CREATE POLICY "Only researchers can access dk_respondents"
ON public.dk_respondents
FOR SELECT
USING (public.is_researcher());

CREATE POLICY "Only researchers can access fin_respondents"  
ON public.fin_respondents
FOR SELECT
USING (public.is_researcher());

-- Apply same policy to nor_respondents if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nor_respondents') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated research access only" ON public.nor_respondents';
        EXECUTE 'CREATE POLICY "Only researchers can access nor_respondents" ON public.nor_respondents FOR SELECT USING (public.is_researcher())';
    END IF;
END $$;

-- Apply same policy to swe_respondents if it exists  
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'swe_respondents') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Authenticated research access only" ON public.swe_respondents';
        EXECUTE 'CREATE POLICY "Only researchers can access swe_respondents" ON public.swe_respondents FOR SELECT USING (public.is_researcher())';
    END IF;
END $$;

-- 7. Secure all SBI business intelligence tables - require authentication
DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI Average Scores";
CREATE POLICY "Authenticated users can view SBI data" ON public."SBI Average Scores" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI Ranking Scores 2011-2025";
CREATE POLICY "Authenticated users can view SBI ranking data" ON public."SBI Ranking Scores 2011-2025" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI SBA 2011-2025";
CREATE POLICY "Authenticated users can view SBI SBA data" ON public."SBI SBA 2011-2025" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI SBQ 2011-2025";
CREATE POLICY "Authenticated users can view SBI SBQ data" ON public."SBI SBQ 2011-2025" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI_Discussion_Topics";
CREATE POLICY "Authenticated users can view discussion topics" ON public."SBI_Discussion_Topics" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI_Discussion_Topics_Geography";
CREATE POLICY "Authenticated users can view discussion geography" ON public."SBI_Discussion_Topics_Geography" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI_Knowledge";
CREATE POLICY "Authenticated users can view knowledge data" ON public."SBI_Knowledge" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI_Priorities_Age_Groups";
CREATE POLICY "Authenticated users can view priorities data" ON public."SBI_Priorities_Age_Groups" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI_VHO_2021-2024";
CREATE POLICY "Authenticated users can view VHO data" ON public."SBI_VHO_2021-2024" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI_behaviour_groups";
CREATE POLICY "Authenticated users can view behaviour groups" ON public."SBI_behaviour_groups" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI_influences";
CREATE POLICY "Authenticated users can view influences data" ON public."SBI_influences" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."SBI_purchasing_decision_industries";
CREATE POLICY "Authenticated users can view purchasing decisions" ON public."SBI_purchasing_decision_industries" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."materiality_areas_general_sbi";
CREATE POLICY "Authenticated users can view materiality data" ON public."materiality_areas_general_sbi" FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON public."materiality_areas__age_sbi";
CREATE POLICY "Authenticated users can view age materiality data" ON public."materiality_areas__age_sbi" FOR SELECT USING (auth.role() = 'authenticated');

-- 8. Create function to assign default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign default 'user' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign user role on signup
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();