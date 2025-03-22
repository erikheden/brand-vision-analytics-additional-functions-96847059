
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Update the type to include "reset" as a possible value
type AuthMode = "signin" | "signup" | "reset";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate("/");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;
        toast({
          title: "Registration successful",
          description: "Please check your email to confirm your account.",
        });
        setMode("signin");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) throw error;
        toast({
          title: "Password reset email sent",
          description: "Please check your email for the password reset link.",
        });
        setMode("signin");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#34502b]">
          {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === "signin"
            ? "Sign in to access your dashboard"
            : mode === "signup"
            ? "Create a new account to get started"
            : "Enter your email to reset your password"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={mode === "signup"}
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          {mode !== "reset" && (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode !== "reset"}
                placeholder="••••••••"
              />
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#34502b] hover:bg-[#2a4023]" 
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : mode === "signin"
            ? "Sign In"
            : mode === "signup"
            ? "Create Account"
            : "Send Reset Link"}
        </Button>

        <div className="text-center space-y-2 text-sm">
          {mode === "signin" ? (
            <>
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[#34502b] hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
              <p>
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="text-[#34502b] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </p>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-[#34502b] hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
