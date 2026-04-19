import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsSuperAdmin } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface RequireSuperAdminProps {
  children: ReactNode;
}

export const RequireSuperAdmin = ({ children }: RequireSuperAdminProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isSuperAdmin, isLoading } = useIsSuperAdmin();

  if (authLoading || (user && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass rounded-2xl p-10 text-center max-w-md neon-border-pink">
          <h1 className="font-display text-3xl font-bold gradient-neon-text mb-3">
            Access Denied
          </h1>
          <p className="font-body text-muted-foreground mb-6">
            This area is restricted to InaniVibes administrators.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 rounded-lg font-ui text-xs uppercase tracking-widest gradient-neon text-primary-foreground"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
