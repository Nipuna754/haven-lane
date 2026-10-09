import type { Home } from "./types";

/* Small display helpers, safe to use in both server and client components. */

export const formatPrice = (home: Pick<Home, "price" | "status">) =>
  home.status === "rent" ? `$${home.price.toLocaleString("en-US")} / mo` : `$${home.price.toLocaleString("en-US")}`;

export const statusLabel = (home: Pick<Home, "status" | "label">) =>
  home.label || { sale: "For sale", rent: "For rent", sold: "Sold" }[home.status];

/** "(512) 555-0148" → "tel:+15125550148" (US numbers) */
export const phoneHref = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? "1" + digits : digits}`;
};
