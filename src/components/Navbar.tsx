import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <a href="#home" className="flex items-center gap-2">
          <img
            src={logo}
            alt="InaniVibes"
            className="h-10 md:h-12 animate-neon-flicker"
          />
        </a>

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
          <a
            href="#book"
            className="ml-2 px-5 py-2 rounded-lg font-ui text-sm uppercase tracking-widest gradient-neon text-primary-foreground neon-glow-pink transition-all duration-300 hover:scale-105"
          >
            Book Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-foreground"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
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
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="mt-2 px-5 py-3 rounded-lg font-ui text-center uppercase tracking-widest gradient-neon text-primary-foreground"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
