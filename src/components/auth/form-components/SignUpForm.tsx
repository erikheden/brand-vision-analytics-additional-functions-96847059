
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthMode } from "../AuthForm";

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setMode: (mode: AuthMode) => void;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SignUpForm = ({
  email,
  setEmail,
  password,
  setPassword,
  setMode,
  error,
  setError,
  loading,
  setLoading,
}: SignUpFormProps) => {
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      toast.success("Please check your email to confirm your signup");
    } catch (error: any) {
      setError(error.message || "An error occurred");
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
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
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#34502b] hover:bg-[#2a4023]" 
        disabled={loading}
      >
        {loading ? "Processing..." : "Sign Up"}
      </Button>
      
      <div className="text-center space-y-2 pt-2">
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
      </div>
    </form>
  );
};
