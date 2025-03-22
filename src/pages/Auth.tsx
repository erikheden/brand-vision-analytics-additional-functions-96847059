import { useState } from "react";
import AuthForm, { AuthMode } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkUser();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="w-full bg-[#34502b] py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <img 
            src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" 
            alt="Data Dashboard" 
            className="h-10 md:h-12 w-auto animate-fade-in cursor-pointer" 
            onClick={() => navigate("/")}
          />
          <img 
            src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" 
            alt="SB Index Logo" 
            className="h-14 md:h-16 w-auto cursor-pointer" 
            onClick={() => navigate("/")}
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 py-8">
          <AuthForm mode={mode} setMode={setMode} />
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full bg-[#34502b] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[41px]">
          <p className="text-[8px] text-center text-white">
            © 2025 SB Insight AB. All rights reserved.
          </p>
          <p className="text-[8px] text-white mt-2 text-center">
            The data, visualisations, and insights displayed on this platform are the exclusive property of SB Insight AB and are protected by copyright and other intellectual property laws. Access is granted solely for internal review and analysis by authorised users. Exporting, reproducing, distributing, or publishing any content from this platform—whether in whole or in part—without prior written permission from SB Insight AB is strictly prohibited.
          </p>
          <p className="text-[8px] text-center text-white mt-2">
            Unauthorised use may result in legal action. For inquiries regarding permitted use, please contact info@sb-insight.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
