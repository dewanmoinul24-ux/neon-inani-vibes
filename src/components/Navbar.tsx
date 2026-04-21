import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, History, ChevronDown, Wallet, Sparkles, Shield } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useVibes } from "@/hooks/useVibes";
import { useIsSuperAdmin } from "@/hooks/useUserRole";
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

const tierAccentClass: Record<string, string> = {
  cyan: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
  pink: "text-neon-pink border-neon-pink/40 bg-neon-pink/10",
  purple: "text-neon-purple border-neon-purple/40 bg-neon-purple/10",
  orange: "text-neon-orange border-neon-orange/40 bg-neon-orange/10",
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, profile, signOut, currency, setCurrency } = useAuth();
  const { tier: vibesTier, completedTrips } = useVibes();
  const { isSuperAdmin } = useIsSuperAdmin();
  const navigate = useNavigate();
  const tierClass = tierAccentClass[vibesTier.accent] ?? tierAccentClass.cyan;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = (profile?.display_name || user?.email || "U").slice(0, 2).toUpperCase();

  const navLinks = [
    { label: "Home", href: "/", isRoute: true },
    { label: "Hotels", href: "/hotels", isRoute: true },
    { label: "Vehicles", href: "/vehicles", isRoute: true },
    { label: "Experiences", href: "/experiences", isRoute: true },
    { label: "Places", href: "/#places" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

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
              className="h-14 md:h-16 lg:h-20 w-auto animate-neon-flicker"
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
                  <span
                    className={`hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-ui uppercase tracking-wider ${tierClass}`}
                    aria-label={`Vibes tier: ${vibesTier.name}`}
                  >
                    <Sparkles className="w-3 h-3" />
                    Lvl {vibesTier.level}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 glass-strong border-primary/30">
                  <DropdownMenuLabel className="font-ui">
                    <p className="text-sm font-semibold truncate">{profile?.display_name || "Traveler"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </DropdownMenuLabel>
                  <button
                    onClick={() => navigate("/profile?tab=vibes")}
                    className={`mx-2 my-2 w-[calc(100%-1rem)] flex items-center justify-between gap-2 px-3 py-2 rounded-lg border ${tierClass} hover:opacity-90 transition-opacity`}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-left">
                        <span className="block text-xs font-ui uppercase tracking-widest opacity-80">
                          Vibes Level {vibesTier.level}
                        </span>
                        <span className="block text-sm font-display font-bold leading-tight">
                          {vibesTier.name}
                        </span>
                      </span>
                    </span>
                    <span className="text-[10px] font-ui opacity-80">
                      {completedTrips} trip{completedTrips === 1 ? "" : "s"}
                    </span>
                  </button>
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
                  {isSuperAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer text-neon-pink focus:text-neon-pink">
                        <Shield className="w-4 h-4 mr-2" /> Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
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
