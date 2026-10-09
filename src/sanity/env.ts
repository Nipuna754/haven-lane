/*
  Sanity settings. These are public IDs, not secrets: the project ID and
  dataset are visible to anyone who opens the Studio. Keep them in .env.local
  (and in Vercel's Environment Variables) so each copy of the site can point
  at its own project.
*/

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-10-01";

/** Until a project ID is set, the site shows its built-in sample listings. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
