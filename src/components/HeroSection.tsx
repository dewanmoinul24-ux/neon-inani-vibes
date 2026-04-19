import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroBg}
          alt="Cox's Bazar Marine Drive at sunset"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

        {/* Animated neon light leaks - contained within hero bounds to prevent horizontal overflow */}
        <div className="pointer-events-none absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-neon-pink/10 blur-[80px] sm:blur-[120px] animate-float" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-neon-blue/10 blur-[70px] sm:blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-neon-purple/10 blur-[60px] sm:blur-[80px] animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-slide-up">
          <p className="font-ui text-sm md:text-base uppercase tracking-[0.3em] text-neon-cyan mb-4 neon-text-cyan">
            Cox's Bazar, Bangladesh
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="gradient-neon-text">Experience Cox's Bazar</span>
            <br />
            <span className="text-foreground">Like Never Before</span>
          </h1>
          <p className="font-body text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Book hotels, rides, and experiences in one place. Your premium neon beach city adventure starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#hotels"
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
