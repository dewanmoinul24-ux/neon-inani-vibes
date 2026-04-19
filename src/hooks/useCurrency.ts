import { useAuth } from "@/contexts/AuthContext";
import { formatPrice as formatPriceBase } from "@/lib/currency";

/**
 * Returns a memo-friendly price formatter bound to the current global currency.
 * Always pass a BDT-denominated amount; output respects the user's selection.
 */
export const useCurrency = () => {
  const { currency, setCurrency } = useAuth();
  const formatPrice = (bdtAmount: number) => formatPriceBase(bdtAmount, currency);
  return { currency, setCurrency, formatPrice };
};
