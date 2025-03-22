import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type AuthMode = "signin" | "signup" | "reset" | "update";

interface AuthFormProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

const AuthForm = ({ mode, setMode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        toast.success("Signed in successfully");
      } 
      else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        
        if (error) throw error;
        toast.success("Please check your email to confirm your signup");
      }
      else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=update`,
        });
        
        if (error) throw error;
        setResetSent(true);
        toast.success("Password reset link sent to your email");
      }
      else if (mode === "update") {
        const { error } = await supabase.auth.updateUser({
          email,
          password
        });
        
        if (error) throw error;
        toast.success("Password updated successfully");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === "reset" && resetSent) {
      return (
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">Check your email</h3>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to your email.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setMode("signin");
              setResetSent(false);
            }}
            className="w-full"
          >
            Back to sign in
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleAuth} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
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
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode !== "reset"}
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-[#34502b] hover:bg-[#2a4023]" 
          disabled={loading}
        >
          {loading ? "Processing..." : 
            mode === "signin" ? "Sign In" : 
            mode === "signup" ? "Sign Up" : 
            mode === "reset" ? "Reset Password" : 
            "Update Password"}
        </Button>
        
        <div className="text-center space-y-2 pt-2">
          {mode === "signin" && (
            <>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-[#34502b] hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </p>
              <p className="text-sm text-gray-600">
                <button
                  type="button"
                  className="text-[#34502b] hover:underline"
                  onClick={() => setMode("reset")}
                >
                  Forgot your password?
                </button>
              </p>
            </>
          )}
          
          {mode === "signup" && (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="text-[#34502b] hover:underline"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </p>
          )}
          
          {mode === "reset" && (
            <p className="text-sm text-gray-600">
              <button
                type="button"
                className="text-[#34502b] hover:underline"
                onClick={() => setMode("signin")}
              >
                Back to sign in
              </button>
            </p>
          )}
          
          {mode === "update" && (
            <p className="text-sm text-gray-600">
              <button
                type="button"
                className="text-[#34502b] hover:underline"
                onClick={() => setMode("signin")}
              >
                Back to sign in
              </button>
            </p>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#34502b]">
        {mode === "signin" ? "Sign In" : 
         mode === "signup" ? "Create Account" : 
         mode === "reset" ? "Reset Password" : 
         "Update Password"}
      </h2>
      {renderForm()}
    </div>
  );
};

export default AuthForm;
