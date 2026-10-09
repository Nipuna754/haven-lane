import type { Home, ListingStatus, PropertyType } from "./types";

/*
  Listing filters live in the address bar (/homes?status=rent&area=hyde-park),
  so results can be bookmarked and shared, and the Back button works.
*/

export type SortKey = "newest" | "price-asc" | "price-desc";

export type Filters = {
  status: ListingStatus;
  area?: string;
  type?: PropertyType;
  max?: number;
  beds?: number;
  baths?: number;
  sort: SortKey;
  view: "grid" | "map";
};

type Params = { [key: string]: string | string[] | undefined };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const num = (v: string | string[] | undefined) => {
  const n = Number(one(v));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export function parseFilters(params: Params): Filters {
  const status = one(params.status);
  const type = one(params.type);
  const sort = one(params.sort);
  return {
    status: status === "rent" || status === "sold" ? status : "sale",
    area: one(params.area),
    type: type === "house" || type === "condo" || type === "townhouse" ? type : undefined,
    max: num(params.max),
    beds: num(params.beds),
    baths: num(params.baths),
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "newest",
    view: one(params.view) === "map" ? "map" : "grid",
  };
}

export function applyFilters(homes: Home[], f: Filters): Home[] {
  const list = homes.filter(
    (h) =>
      h.status === f.status &&
      (!f.area || h.neighbourhood === f.area) &&
      (!f.type || h.type === f.type) &&
      (!f.max || h.price <= f.max) &&
      (!f.beds || h.beds >= f.beds) &&
      (!f.baths || h.baths >= f.baths),
  );
  if (f.sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
  if (f.sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
  return list; // sample data is already in newest-first order
}

/** Build a /homes URL from filters, dropping empty values and defaults. */
export function filtersToHref(f: Partial<Filters>): string {
  const q = new URLSearchParams();
  if (f.status && f.status !== "sale") q.set("status", f.status);
  if (f.area) q.set("area", f.area);
  if (f.type) q.set("type", f.type);
  if (f.max) q.set("max", String(f.max));
  if (f.beds) q.set("beds", String(f.beds));
  if (f.baths) q.set("baths", String(f.baths));
  if (f.sort && f.sort !== "newest") q.set("sort", f.sort);
  if (f.view === "map") q.set("view", "map");
  const s = q.toString();
  return s ? `/homes?${s}` : "/homes";
}

export const priceOptions = {
  sale: [400000, 500000, 750000, 1000000, 1500000],
  rent: [2000, 2500, 3000, 3500, 4500],
  sold: [500000, 750000, 1000000, 1500000],
};

export const formatShortPrice = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 ? 2 : 1).replace(/\.?0+$/, "")}M` : n >= 10_000 ? `$${Math.round(n / 1000)}K` : `$${n.toLocaleString("en-US")}`;
