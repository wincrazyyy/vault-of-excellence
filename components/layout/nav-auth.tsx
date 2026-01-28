// app/_components/layout/nav-auth.tsx
import { AuthButton } from "@/components/auth/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";

export function NavAuth() {
  if (!hasEnvVars) {
    return <EnvVarWarning />;
  }

  return <AuthButton />;
}