/*
  Turns the sample data (src/content/sample.ts) into Sanity documents.
  Used by seed-sanity.ts; kept separate so it can be tested without Sanity.
*/
import { agents, homes, neighbourhoods, site } from "../src/content/sample";
import type { Photo } from "../src/content/types";

/** Uploads a photo from /public and returns its Sanity asset ID (or nothing). */
export type AssetFor = (src: string) => Promise<string | undefined>;

type Doc = { _id: string; _type: string; [key: string]: unknown };

const ref = (id: string) => ({ _type: "reference", _ref: id });
const slug = (current: string) => ({ _type: "slug", current });

async function photo(p: Photo, assetFor: AssetFor, key?: string) {
  const assetId = p.src ? await assetFor(p.src) : undefined;
  return {
    _type: "photo",
    ...(key ? { _key: key } : {}),
    alt: p.alt,
    tone: p.tone,
    ...(assetId ? { asset: ref(assetId) } : {}),
  };
}

export async function buildDocuments(assetFor: AssetFor = async () => undefined): Promise<Doc[]> {
  const docs: Doc[] = [];

  for (const [i, n] of neighbourhoods.entries()) {
    docs.push({
      _id: `neighbourhood-${n.slug}`,
      _type: "neighbourhood",
      name: n.name,
      slug: slug(n.slug),
      blurb: n.blurb,
      photo: await photo(n.photo, assetFor),
      order: (i + 1) * 10,
    });
  }

  for (const [i, a] of agents.entries()) {
    docs.push({
      _id: `agent-${a.slug}`,
      _type: "agent",
      name: a.name,
      slug: slug(a.slug),
      area: a.area,
      phone: a.phone,
      email: a.email,
      bio: a.bio,
      photo: await photo(a.photo, assetFor),
      order: (i + 1) * 10,
    });
  }

  // Newest first, matching the sample order: listing dates a few days apart
  const today = new Date();
  for (const [i, h] of homes.entries()) {
    const listed = new Date(today.getTime() - i * 4 * 86_400_000).toISOString().slice(0, 10);
    docs.push({
      _id: `home-${h.slug}`,
      _type: "home",
      address: h.address,
      slug: slug(h.slug),
      status: h.status,
      price: h.price,
      ...(h.label ? { label: h.label } : {}),
      neighbourhood: ref(`neighbourhood-${h.neighbourhood}`),
      agent: ref(`agent-${h.agent}`),
      featured: Boolean(h.featured),
      listedAt: listed,
      type: h.type,
      beds: h.beds,
      baths: h.baths,
      sqft: h.sqft,
      ...(h.lotSqft ? { lotSqft: h.lotSqft } : {}),
      ...(h.yearBuilt ? { yearBuilt: h.yearBuilt } : {}),
      summary: h.summary,
      description: h.description.join("\n\n"),
      features: h.features,
      location: { _type: "geopoint", lat: h.location.lat, lng: h.location.lng },
      photos: await Promise.all(h.photos.map((p, j) => photo(p, assetFor, `photo-${j + 1}`))),
    });
  }

  docs.push({ _id: "siteSettings", _type: "siteSettings", ...site });
  return docs;
}
