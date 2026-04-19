import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Send } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer id="contact" className="relative border-t border-border overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px gradient-neon" />
      <div className="container mx-auto py-10 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={logo} alt="InaniVibes" className="h-14 sm:h-16 md:h-20 w-auto mb-3 sm:mb-4 animate-neon-flicker" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-md">
              Your premium gateway to Cox's Bazar. Neon nights, golden sunsets, and unforgettable vibes.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:neon-glow-pink transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Hotels", "Vehicles", "Experiences", "Places", "About"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors inline-block py-0.5"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground text-sm break-words">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                Kolatoli Road, Cox's Bazar, Bangladesh
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone size={16} className="text-secondary shrink-0" />
                +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm break-all">
                <Mail size={16} className="text-neon-cyan shrink-0" />
                hello@inanivibes.com
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest deals and neon-lit updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="min-w-0 flex-1 px-3 py-2.5 rounded-lg glass text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:neon-glow-pink border border-border focus:border-primary transition-all"
              />
              <button
                aria-label="Subscribe"
                className="px-3.5 py-2.5 rounded-lg gradient-neon text-primary-foreground transition-transform hover:scale-105 shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-xs font-ui">
            © 2026 InaniVibes. All rights reserved. Made with 💜 in Cox's Bazar.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
