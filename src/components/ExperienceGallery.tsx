import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ExperienceGalleryProps {
  images: string[];
  alt: string;
}

const ExperienceGallery = ({ images, alt }: ExperienceGalleryProps) => {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const safeImages = images.filter(Boolean);
  const count = safeImages.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((i) => (i + dir + count) % count);
      setZoom(1);
    },
    [count],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  if (count === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <button
        type="button"
        onClick={() => {
          setZoom(1);
          setOpen(true);
        }}
        className="group relative block w-full aspect-[16/10] overflow-hidden rounded-xl border border-border/60 glass"
        aria-label="Open gallery"
      >
        <img
          src={safeImages[active]}
          alt={`${alt} — image ${active + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-strong text-xs font-ui uppercase tracking-wider text-neon-cyan border border-neon-cyan/40">
          <ZoomIn className="w-3.5 h-3.5" />
          {active + 1} / {count}
        </div>
      </button>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
          {safeImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 snap-start w-20 h-14 sm:w-24 sm:h-16 rounded-md overflow-hidden border-2 transition-all",
                i === active
                  ? "border-neon-pink shadow-[0_0_12px_hsl(var(--neon-pink)/0.6)]"
                  : "border-border/40 opacity-70 hover:opacity-100 hover:border-neon-cyan/60",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[95vw] sm:max-w-5xl p-0 border-neon-pink/40 bg-background/95 backdrop-blur-xl"
        >
          <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
            <img
              src={safeImages[active]}
              alt={`${alt} — image ${active + 1}`}
              style={{ transform: `scale(${zoom})` }}
              className="max-w-full max-h-full object-contain transition-transform duration-300 cursor-zoom-in select-none"
              onClick={() => setZoom((z) => (z >= 2.5 ? 1 : z + 0.5))}
              draggable={false}
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong border border-neon-cyan/40 text-neon-cyan hover:scale-110 transition-transform flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong border border-neon-cyan/40 text-neon-cyan hover:scale-110 transition-transform flex items-center justify-center"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Toolbar */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.5))}
                className="w-9 h-9 rounded-full glass-strong border border-border/60 flex items-center justify-center hover:text-neon-pink transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
                className="w-9 h-9 rounded-full glass-strong border border-border/60 flex items-center justify-center hover:text-neon-cyan transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 py-1 rounded-full glass text-[10px] font-ui uppercase tracking-wider text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full glass-strong border border-border/60 flex items-center justify-center hover:text-neon-pink transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass-strong border border-border/60 text-xs font-ui tracking-widest text-muted-foreground">
              {active + 1} / {count}
            </div>
          </div>

          {/* Thumbnail strip in lightbox */}
          {count > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3 border-t border-border/40 bg-background/60">
              {safeImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setZoom(1);
                  }}
                  className={cn(
                    "shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all",
                    i === active
                      ? "border-neon-pink"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                  aria-label={`Go to image ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperienceGallery;