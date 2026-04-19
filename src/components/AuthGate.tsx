import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const AuthGate = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Slight delay so it doesn't fight with initial paint
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    } else {
      setOpen(false);
    }
  }, [user, loading]);

  return <AuthModal open={open} onOpenChange={setOpen} />;
};

export default AuthGate;
