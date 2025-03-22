
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthMode } from "../AuthForm";

interface ResetPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  setMode: (mode: AuthMode) => void;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const ResetPasswordForm = ({
  email,
  setEmail,
  setMode,
  error,
  setError,
  loading,
  setLoading,
}: ResetPasswordFormProps) => {
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=update`,
      });
      
      if (error) throw error;
      setResetSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      setError(error.message || "An error occurred");
      toast.error(error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (resetSent) {
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
    <form onSubmit={handleResetPassword} className="space-y-4">
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
      
      <Button 
        type="submit" 
        className="w-full bg-[#34502b] hover:bg-[#2a4023]" 
        disabled={loading}
      >
        {loading ? "Processing..." : "Reset Password"}
      </Button>
      
      <div className="text-center space-y-2 pt-2">
        <p className="text-sm text-gray-600">
          <button
            type="button"
            className="text-[#34502b] hover:underline"
            onClick={() => setMode("signin")}
          >
            Back to sign in
          </button>
        </p>
      </div>
    </form>
  );
};
