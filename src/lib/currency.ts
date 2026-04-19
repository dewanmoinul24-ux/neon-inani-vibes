// Currency conversion + formatting helpers.
// Source prices across the app are stored in BDT (Bangladeshi Taka).
// USD rate is approximate — adjust EXCHANGE_RATES as needed.

export type Currency = "BDT" | "USD";

export const EXCHANGE_RATES: Record<Currency, number> = {
  BDT: 1,
  USD: 1 / 110, // 1 BDT ≈ 0.0091 USD
};

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  BDT: "৳",
  USD: "$",
};

export const CURRENCY_LABEL: Record<Currency, string> = {
  BDT: "BDT — Bangladeshi Taka",
  USD: "USD — US Dollar",
};

/**
 * Format a BDT-denominated amount in the target currency.
 * BDT is shown without decimals; USD is shown with 2 decimals.
 */
export const formatPrice = (bdtAmount: number, currency: Currency): string => {
  const converted = bdtAmount * EXCHANGE_RATES[currency];
  if (currency === "USD") {
    return `$${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `৳${Math.round(converted).toLocaleString()}`;
};
