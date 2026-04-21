import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, Phone, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import {
  isDayAvailable,
  unavailableSlots,
  type VibesExpert,
} from "@/data/vibesExperts";

interface BookingDialogProps {
  expert: VibesExpert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional initial duration: hourly or daily. */
  initialDuration?: "hourly" | "daily";
}

const bookingSchema = z.object({
  date: z.date({ required_error: "Pick a date" }),
  time: z.string().min(1, "Pick a time slot"),
  duration: z.enum(["hourly", "daily"]),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone is too long")
    .regex(/^[0-9+\-\s()]+$/, "Only digits and + - ( ) allowed"),
  pickup: z.string().trim().max(200, "Keep notes under 200 characters").optional(),
});

const BookingDialog = ({ expert, open, onOpenChange, initialDuration = "daily" }: BookingDialogProps) => {
  const { formatPrice } = useCurrency();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [duration, setDuration] = useState<"hourly" | "daily">(initialDuration);
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form whenever a new expert is opened.
  useEffect(() => {
    if (open) {
      setDate(undefined);
      setTime("");
      setPhone("");
      setPickup("");
      setErrors({});
      setDuration(initialDuration);
    }
  }, [open, expert?.id, initialDuration]);

  const taken = useMemo(() => {
    if (!expert || !date) return new Set<string>();
    return unavailableSlots(expert.availabilitySeed, date, expert.timeSlots);
  }, [expert, date]);

  if (!expert) return null;

  const startingPrice = duration === "hourly" ? expert.pricePerHour : expert.pricePerDay;
  const advance = Math.round((startingPrice * expert.bookingAdvance) / 100);

  const handleSubmit = () => {
    const parsed = bookingSchema.safeParse({ date, time, duration, phone, pickup });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString();
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast.success("Booking request sent!", {
      description: `${expert.name} · ${format(parsed.data.date, "PPP")} at ${parsed.data.time}. We'll confirm by phone within 30 mins.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg glass-strong border-primary/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-pink" />
            Book {expert.name}
          </DialogTitle>
          <DialogDescription className="font-ui text-xs uppercase tracking-widest text-neon-cyan">
            {expert.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Duration toggle */}
          <div>
            <Label className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
              Duration
            </Label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDuration("hourly")}
                className={cn(
                  "px-3 py-2 rounded-lg font-ui text-xs uppercase tracking-widest transition-all",
                  duration === "hourly"
                    ? "gradient-neon text-primary-foreground neon-glow-pink"
                    : "glass border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Clock size={12} className="inline mr-1.5 -mt-0.5" /> Hourly
              </button>
              <button
                type="button"
                onClick={() => setDuration("daily")}
                className={cn(
                  "px-3 py-2 rounded-lg font-ui text-xs uppercase tracking-widest transition-all",
                  duration === "daily"
                    ? "gradient-neon text-primary-foreground neon-glow-pink"
                    : "glass border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <CalendarIcon size={12} className="inline mr-1.5 -mt-0.5" /> Full Day (8h)
              </button>
            </div>
          </div>

          {/* Date picker */}
          <div>
            <Label className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
              Pick a date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "mt-1.5 w-full justify-start text-left font-normal glass border-border/60",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 glass-strong" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setTime("");
                  }}
                  disabled={(d) => !isDayAvailable(expert.availabilitySeed, d)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date}</p>}
          </div>

          {/* Time slots */}
          <div>
            <Label className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
              Time slot
            </Label>
            {!date ? (
              <p className="mt-1.5 text-xs text-muted-foreground italic">Pick a date first</p>
            ) : (
              <div className="mt-1.5 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {expert.timeSlots.map((slot) => {
                  const isTaken = taken.has(slot);
                  const isSelected = time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setTime(slot)}
                      className={cn(
                        "px-2 py-2 rounded-lg font-ui text-xs transition-all",
                        isTaken && "opacity-40 line-through cursor-not-allowed glass border border-border",
                        !isTaken && isSelected && "gradient-neon text-primary-foreground neon-glow-pink",
                        !isTaken && !isSelected && "glass border border-border text-foreground hover:border-primary/60"
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
            {errors.time && <p className="mt-1 text-xs text-destructive">{errors.time}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
              <Phone size={12} className="inline mr-1.5 -mt-0.5" /> Contact number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 glass border-border/60"
              maxLength={20}
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>

          {/* Pickup / location notes */}
          <div>
            <Label htmlFor="pickup" className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
              <MapPin size={12} className="inline mr-1.5 -mt-0.5" /> Pickup / location notes
            </Label>
            <Textarea
              id="pickup"
              placeholder="e.g. Hotel Sea Pearl lobby, or 'meet me at Inani parking lot'"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="mt-1.5 glass border-border/60 min-h-[72px]"
              maxLength={200}
            />
            {errors.pickup && <p className="mt-1 text-xs text-destructive">{errors.pickup}</p>}
          </div>

          {/* Price summary */}
          <div className="glass rounded-lg p-3 border border-border/60 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Starting from</span>
              <span className="font-display font-bold text-foreground">
                {formatPrice(startingPrice)} <span className="text-xs text-muted-foreground font-ui">/{duration === "hourly" ? "hr" : "day"}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{expert.bookingAdvance}% advance due now</span>
              <span className="font-ui text-neon-cyan neon-text-cyan">{formatPrice(advance)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="glass border-border/60"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="gradient-neon text-primary-foreground neon-glow-pink hover:scale-[1.02] transition-transform"
          >
            <CheckCircle2 size={14} className="mr-1.5" />
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
