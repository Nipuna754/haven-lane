import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// No CDN: right after a publish it can still serve the old version, and the
// webhook's refresh would cache that for another hour. Next caches results anyway.
const client = createClient({ projectId: projectId || "unset", dataset, apiVersion, useCdn: false, perspective: "published" });

/** Every Sanity query is tagged "sanity", so one webhook call refreshes the whole site. */
export const SANITY_TAG = "sanity";

export function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: 3600, tags: [SANITY_TAG] } });
}
