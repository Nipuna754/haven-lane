import { defineQuery } from "next-sanity";

/*
  GROQ queries. Each one returns the same shape as the sample data in
  src/content/sample.ts, so the pages work the same with either.
*/

const PHOTO = `{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "tone": coalesce(asset->metadata.palette.dominant.background, tone, "#d6d0c4")
}`;

const HOME = `{
  "slug": slug.current,
  status,
  label,
  price,
  address,
  "neighbourhood": neighbourhood->slug.current,
  "areaName": neighbourhood->name,
  type,
  beds,
  baths,
  sqft,
  lotSqft,
  yearBuilt,
  featured,
  summary,
  description,
  "features": coalesce(features, []),
  "agent": agent->slug.current,
  "photos": coalesce(photos[]${PHOTO}, []),
  "location": { "lat": location.lat, "lng": location.lng }
}`;

const AGENT = `{ "slug": slug.current, name, area, phone, email, bio, "photo": photo${PHOTO} }`;
const AREA = `{ "slug": slug.current, name, blurb, "photo": photo${PHOTO} }`;

export const HOMES_QUERY = defineQuery(
  `*[_type == "home" && defined(slug.current) && defined(neighbourhood) && defined(agent)] | order(coalesce(listedAt, _createdAt) desc) ${HOME}`,
);
export const AGENTS_QUERY = defineQuery(`*[_type == "agent" && defined(slug.current)] | order(order asc, name asc) ${AGENT}`);
export const AREAS_QUERY = defineQuery(`*[_type == "neighbourhood" && defined(slug.current)] | order(order asc, name asc) ${AREA}`);
export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{ phone, email, address, hours }`);
