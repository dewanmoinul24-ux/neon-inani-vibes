import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const DISMISS_KEY = "auth_modal_dismissed";

const AuthGate = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      setOpen(false);
      return;
    }
    // Skippable: if user already dismissed in this session, don't reopen.
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [user, loading]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && !user) {
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
  };

  return <AuthModal open={open} onOpenChange={handleOpenChange} />;
};

export default AuthGate;
