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
    // Skippable: if user already dismissed, don't reopen.
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    // Trigger only after meaningful engagement: scroll past hero, OR 30s idle.
    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
    };

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(trigger, 30000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [user, loading]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && !user) {
      // Persist across sessions so we don't nag returning visitors
      localStorage.setItem(DISMISS_KEY, "1");
    }
  };

  return <AuthModal open={open} onOpenChange={handleOpenChange} />;
};

export default AuthGate;
