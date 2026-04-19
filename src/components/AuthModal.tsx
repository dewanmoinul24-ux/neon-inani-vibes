import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emailSchema = z.string().trim().email({ message: "Invalid email" }).max(255);
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" }).max(72);
const nameSchema = z.string().trim().min(1, { message: "Name is required" }).max(100);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.1 1.6l3-3C17.05 1.7 14.7.5 12 .5 7.4.5 3.4 3.13 1.4 7l3.5 2.7C5.85 6.9 8.65 5 12 5z"/>
    <path fill="#4285F4" d="M23.5 12.27c0-.86-.08-1.7-.22-2.5H12v4.73h6.45c-.28 1.5-1.13 2.77-2.4 3.62l3.7 2.86c2.16-2 3.4-4.94 3.4-8.7z"/>
    <path fill="#FBBC05" d="M4.9 14.3c-.25-.74-.4-1.52-.4-2.3 0-.78.15-1.56.4-2.3L1.4 7C.5 8.5 0 10.18 0 12s.5 3.5 1.4 5l3.5-2.7z"/>
    <path fill="#34A853" d="M12 23.5c3.24 0 5.96-1.07 7.95-2.93l-3.7-2.86c-1.03.7-2.36 1.1-4.25 1.1-3.35 0-6.15-1.9-7.1-4.7L1.4 17c2 3.87 6 6.5 10.6 6.5z"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Invalid email or password" : error.message);
      return;
    }
    toast.success("Welcome back!");
    onOpenChange(false);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      nameSchema.parse(displayName);
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("already") ? "Email already registered. Try logging in." : error.message);
      return;
    }
    toast.success("Check your email to verify your account!");
    onOpenChange(false);
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setOauthLoading(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(`${provider} sign-in failed`);
      setOauthLoading(null);
      return;
    }
    if (result.redirected) return;
    setOauthLoading(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to InaniVibes
          </DialogTitle>
          <DialogDescription className="text-center font-ui">
            Sign in to book hotels, vehicles & save your trips
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null}
            className="border-border hover:bg-muted"
          >
            {oauthLoading === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><GoogleIcon /> Google</>}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuth("apple")}
            disabled={oauthLoading !== null}
            className="border-border hover:bg-muted"
          >
            {oauthLoading === "apple" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><AppleIcon /> Apple</>}
          </Button>
        </div>

        <div className="flex items-center gap-3 my-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-ui">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleEmailLogin} className="space-y-3 pt-2">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-neon text-primary-foreground">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleEmailSignup} className="space-y-3 pt-2">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input id="signup-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-neon text-primary-foreground">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
