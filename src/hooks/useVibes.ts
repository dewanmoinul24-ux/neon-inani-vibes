import { useEffect, useState } from "react";
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

/**
 * Returns the current user's Vibes tier (based on completed bookings).
 * Falls back to Level 1 (Explorer) when signed out.
 */
export const useVibes = (): VibesState => {
  const { user } = useAuth();
  const [completedTrips, setCompletedTrips] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCompletedTrips(0);
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
        setCompletedTrips(countCompletedTrips(data || []));
        setLoading(false);
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
