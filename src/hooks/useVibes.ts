import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  countCompletedTrips,
  getVibesTier,
  type VibesTier,
} from "@/lib/vibesLevel";

interface VibesState {
  tier: VibesTier;
  completedTrips: number;
  loading: boolean;
}

const LEVEL_STORAGE_KEY = (uid: string) => `vibes_last_level_${uid}`;

/**
 * Returns the current user's Vibes tier (based on completed bookings).
 * Falls back to Level 1 (Explorer) when signed out.
 *
 * Side-effect: when a user's tier increases between renders, fires a
 * celebration toast. Uses localStorage so we only celebrate true level-ups.
 */
export const useVibes = (): VibesState => {
  const { user } = useAuth();
  const [completedTrips, setCompletedTrips] = useState(0);
  const [loading, setLoading] = useState(false);
  const previousLevelRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      setCompletedTrips(0);
      previousLevelRef.current = null;
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("bookings")
      .select("status,check_out")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return;
        const trips = countCompletedTrips(data || []);
        setCompletedTrips(trips);
        setLoading(false);

        const newTier = getVibesTier(trips);
        const stored = Number(localStorage.getItem(LEVEL_STORAGE_KEY(user.id)) || "0");

        // First load for this user — just record, no toast.
        if (previousLevelRef.current === null) {
          previousLevelRef.current = newTier.level;
          if (!stored) {
            localStorage.setItem(LEVEL_STORAGE_KEY(user.id), String(newTier.level));
          } else if (newTier.level > stored) {
            // Level-up that happened while the app was closed.
            celebrateLevelUp(newTier);
            localStorage.setItem(LEVEL_STORAGE_KEY(user.id), String(newTier.level));
          }
          return;
        }

        // Live level-up during the session.
        if (newTier.level > previousLevelRef.current) {
          celebrateLevelUp(newTier);
          localStorage.setItem(LEVEL_STORAGE_KEY(user.id), String(newTier.level));
        }
        previousLevelRef.current = newTier.level;
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return {
    tier: getVibesTier(completedTrips),
    completedTrips,
    loading,
  };
};

const celebrateLevelUp = (tier: VibesTier) => {
  toast.success(`✨ Vibes Level Up! You're now ${tier.name}`, {
    description: tier.tagline,
    duration: 8000,
  });
};
