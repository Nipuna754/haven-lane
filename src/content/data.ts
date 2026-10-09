import "server-only";
import { cache } from "react";
import { sanityFetch } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { AGENTS_QUERY, AREAS_QUERY, HOMES_QUERY, SETTINGS_QUERY } from "@/sanity/queries";
import * as sample from "./sample";
import type { Agent, Home, Neighbourhood, Photo, SiteSettings } from "./types";

/*
  The one place pages get content from. With Sanity connected it reads the
  published documents (cached, refreshed by the /api/revalidate webhook or
  hourly); without it, it serves the sample data so the site still runs.
  The list is small (tens of listings), so pages filter in memory.
*/

const PLACEHOLDER = "#d6d0c4";
const photoOr = (p: Partial<Photo> | null | undefined, alt: string): Photo => ({
  src: p?.src || undefined,
  alt: p?.alt || alt,
  tone: p?.tone || PLACEHOLDER,
});

type RawHome = Omit<Home, "description" | "photos"> & { description: string | string[] | null; photos: Partial<Photo>[] | null };

export const getNeighbourhoods = cache(async (): Promise<Neighbourhood[]> => {
  if (!isSanityConfigured) return sample.neighbourhoods;
  const rows = await sanityFetch<Neighbourhood[]>(AREAS_QUERY);
  return rows.map((n) => ({ ...n, photo: photoOr(n.photo, n.name) }));
});

export const getAgents = cache(async (): Promise<Agent[]> => {
  if (!isSanityConfigured) return sample.agents;
  const rows = await sanityFetch<Agent[]>(AGENTS_QUERY);
  return rows.map((a) => ({ ...a, photo: photoOr(a.photo, `${a.name}, agent`) }));
});

export const getHomes = cache(async (): Promise<Home[]> => {
  if (!isSanityConfigured) {
    const areas = sample.neighbourhoods;
    return sample.homes.map((h) => ({ ...h, areaName: areas.find((n) => n.slug === h.neighbourhood)?.name ?? "" }));
  }
  const rows = await sanityFetch<RawHome[]>(HOMES_QUERY);
  return rows.map((h) => ({
    ...h,
    label: h.label || undefined,
    lotSqft: h.lotSqft || undefined,
    yearBuilt: h.yearBuilt || undefined,
    description: Array.isArray(h.description)
      ? h.description
      : (h.description ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    // Pages expect at least one photo slot, so a listing without photos gets a placeholder
    photos: (h.photos?.length ? h.photos : [{}]).map((p, i) => photoOr(p, i === 0 ? h.address : `${h.address}, photo ${i + 1}`)),
  }));
});

export const getSite = cache(async (): Promise<SiteSettings> => {
  if (!isSanityConfigured) return sample.site;
  return (await sanityFetch<SiteSettings | null>(SETTINGS_QUERY)) ?? sample.site;
});

export async function getHome(slug: string) {
  return (await getHomes()).find((h) => h.slug === slug);
}

export async function getAgent(slug: string) {
  return (await getAgents()).find((a) => a.slug === slug);
}
