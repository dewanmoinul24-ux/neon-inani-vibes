import { useEffect, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = imgRef.current;
      if (!el) return;
      // Only animate while hero is roughly in view (first viewport-and-a-half)
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      // Subtle: image moves at ~30% of scroll speed, slight zoom for depth
      const translate = y * 0.3;
      const scale = 1 + Math.min(y / window.innerHeight, 1) * 0.06;
      el.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imgRef}
          src={heroBg}
          alt="Cox's Bazar Marine Drive at sunset"
          className="w-full h-[115%] object-cover will-change-transform origin-center -translate-y-[5%]"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
        />
        {/* Overlay gradient - lightened so banner image reads brighter */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/15 to-background/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />

        {/* Animated neon light leaks - contained within hero bounds to prevent horizontal overflow */}
        <div className="pointer-events-none absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-neon-pink/10 blur-[80px] sm:blur-[120px] animate-float" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-neon-blue/10 blur-[70px] sm:blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-neon-purple/10 blur-[60px] sm:blur-[80px] animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-slide-up">
          <h1
            className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{
              filter:
                "drop-shadow(0 0 24px hsl(320 100% 60% / 0.45)) drop-shadow(0 4px 18px hsl(0 0% 0% / 0.95))",
            }}
          >
            <span className="gradient-neon-text">Experience</span>
            <br className="sm:hidden" />
            <span className="gradient-neon-text text-5xl sm:text-4xl md:text-6xl lg:text-7xl">{" "}Cox's Bazar</span>
            <br />
            <span className="text-foreground">Like Never Before</span>
          </h1>
          <p
            className="font-body text-base md:text-xl text-foreground/90 max-w-2xl mx-auto mb-10"
            style={{ textShadow: "0 2px 14px hsl(0 0% 0% / 0.95)" }}
          >
            Book hotels, rides, and experiences in one place. Your premium neon beach city adventure starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/hotels"
              className="px-8 py-4 rounded-lg font-ui text-base uppercase tracking-widest gradient-neon text-primary-foreground animate-pulse-glow transition-transform duration-300 hover:scale-105"
            >
              Book Now
            </a>
            <a
              href="#experiences"
              className="px-8 py-4 rounded-lg font-ui text-base uppercase tracking-widest glass neon-border-blue text-secondary transition-all duration-300 hover:scale-105 hover:neon-glow-blue"
            >
              Explore
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
