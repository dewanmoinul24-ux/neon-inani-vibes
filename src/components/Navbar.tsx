import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, History, ChevronDown, Wallet } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "Hotels", href: "/hotels", isRoute: true },
  { label: "Vehicles", href: "/vehicles", isRoute: true },
  { label: "Experiences", href: "/#experiences" },
  { label: "Places", href: "/#places" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, profile, signOut, currency, setCurrency } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = (profile?.display_name || user?.email || "U").slice(0, 2).toUpperCase();

  const CurrencySwitcher = ({ compact = false }: { compact?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center gap-1.5 rounded-lg border border-border/60 hover:border-primary/50 transition-colors font-ui ${
          compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs uppercase tracking-widest"
        }`}
        aria-label="Change currency"
      >
        <Wallet className="w-3.5 h-3.5 text-neon-cyan" />
        <span className="text-foreground font-semibold">{currency}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 glass-strong border-primary/30">
        <DropdownMenuLabel className="font-ui text-xs uppercase tracking-widest">
          Currency
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setCurrency("BDT")} className="cursor-pointer">
          <span className="mr-2">৳</span> BDT — Taka
          {currency === "BDT" && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("USD")} className="cursor-pointer">
          <span className="mr-2">$</span> USD — Dollar
          {currency === "USD" && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="InaniVibes"
              className="h-10 md:h-12 animate-neon-flicker"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.href}
                  to={l.href}
                  className="font-ui text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-ui text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {l.label}
                </a>
              )
            )}

            <CurrencySwitcher />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 ml-2 px-2 py-1 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="w-8 h-8 border border-primary/50">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-muted text-xs font-display">{initials}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong border-primary/30">
                  <DropdownMenuLabel className="font-ui">
                    <p className="text-sm font-semibold truncate">{profile?.display_name || "Traveler"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile?tab=upcoming")} className="cursor-pointer">
                    <History className="w-4 h-4 mr-2" /> My Trips
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile?tab=preferences")} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" /> Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="font-ui text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Login
              </button>
            )}

            <Link
              to="/hotels"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="ml-1 px-5 py-2 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink transition-all duration-300 hover:scale-105"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile right cluster */}
          <div className="lg:hidden flex items-center gap-2">
            <CurrencySwitcher compact />
            <button
              onClick={() => setOpen(!open)}
              className="text-foreground"
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden glass-strong border-t border-border animate-slide-up">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((l) =>
                l.isRoute ? (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="font-ui text-lg uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-ui text-lg uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </a>
                )
              )}

              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="font-ui text-lg uppercase tracking-widest text-primary">
                    Profile
                  </Link>
                  <button onClick={() => { handleSignOut(); setOpen(false); }} className="font-ui text-lg uppercase tracking-widest text-destructive text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { setAuthOpen(true); setOpen(false); }} className="font-ui text-lg uppercase tracking-widest text-primary text-left">
                  Login / Sign Up
                </button>
              )}

              <Link
                to="/hotels"
                onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="mt-2 px-5 py-3 rounded-lg font-ui text-center uppercase tracking-widest gradient-neon text-primary-foreground"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default Navbar;
