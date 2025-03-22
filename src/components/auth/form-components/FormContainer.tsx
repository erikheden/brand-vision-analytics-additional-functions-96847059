
import { ReactNode } from "react";
import { AuthMode } from "../AuthForm";

interface FormContainerProps {
  mode: AuthMode;
  children: ReactNode;
}

export const FormContainer = ({ mode, children }: FormContainerProps) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#34502b]">
        {mode === "signin" ? "Sign In" : 
         mode === "signup" ? "Create Account" : 
         mode === "reset" ? "Reset Password" : 
         "Update Password"}
      </h2>
      {children}
    </div>
  );
};
