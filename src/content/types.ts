/*
  Content shapes. src/content/data.ts fills them from Sanity, or from the
  sample data in sample.ts when Sanity isn't connected.
*/

export type ListingStatus = "sale" | "rent" | "sold";
export type PropertyType = "house" | "condo" | "townhouse";

export type Photo = {
  /** Image path or URL. Empty until real photos are added. */
  src?: string;
  alt: string;
  /** Placeholder colour shown while there's no photo yet */
  tone: string;
};

export type Agent = {
  slug: string;
  name: string;
  area: string;
  phone: string;
  email: string;
  bio: string;
  photo: Photo;
};

export type Neighbourhood = {
  slug: string;
  name: string;
  blurb: string;
  photo: Photo;
};

export type Home = {
  slug: string;
  status: ListingStatus;
  /** Shown on the badge when set, e.g. "New listing", "Price cut" */
  label?: string;
  /** Sale price in dollars, or monthly rent for rentals */
  price: number;
  address: string;
  neighbourhood: string; // Neighbourhood slug
  /** Neighbourhood name, e.g. "Hyde Park" */
  areaName: string;
  type: PropertyType;
  beds: number;
  baths: number;
  sqft: number;
  lotSqft?: number;
  yearBuilt?: number;
  featured?: boolean;
  summary: string;
  description: string[];
  features: string[];
  agent: string; // Agent slug
  photos: Photo[];
  location: { lat: number; lng: number };
};

export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  hours: string;
};
