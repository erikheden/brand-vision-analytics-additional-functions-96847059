
import { useState } from "react";
import { SignInForm } from "./form-components/SignInForm";
import { SignUpForm } from "./form-components/SignUpForm";
import { ResetPasswordForm } from "./form-components/ResetPasswordForm";
import { UpdatePasswordForm } from "./form-components/UpdatePasswordForm";
import { FormContainer } from "./form-components/FormContainer";

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

  const renderForm = () => {
    switch (mode) {
      case "signin":
        return (
          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            setMode={setMode}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case "signup":
        return (
          <SignUpForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            setMode={setMode}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case "reset":
        return (
          <ResetPasswordForm
            email={email}
            setEmail={setEmail}
            setMode={setMode}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case "update":
        return (
          <UpdatePasswordForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            setMode={setMode}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        );
      default:
        return null;
    }
  };

  return <FormContainer mode={mode}>{renderForm()}</FormContainer>;
};

export default AuthForm;
