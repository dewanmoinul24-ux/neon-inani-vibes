import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Send } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer id="contact" className="relative border-t border-border">
      <div className="absolute top-0 left-0 right-0 h-px gradient-neon" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src={logo} alt="InaniVibes" className="h-10 mb-4 animate-neon-flicker" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Your premium gateway to Cox's Bazar. Neon nights, golden sunsets, and unforgettable vibes.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:neon-glow-pink transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Hotels", "Vehicles", "Experiences", "Places", "About"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                Kolatoli Road, Cox's Bazar, Bangladesh
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone size={16} className="text-secondary shrink-0" />
                +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail size={16} className="text-neon-cyan shrink-0" />
                hello@inanivibes.com
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest deals and neon-lit updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg glass text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:neon-glow-pink border border-border focus:border-primary transition-all"
              />
              <button className="px-3 py-2 rounded-lg gradient-neon text-primary-foreground transition-transform hover:scale-105">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-xs font-ui">
            © 2026 InaniVibes. All rights reserved. Made with 💜 in Cox's Bazar.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
