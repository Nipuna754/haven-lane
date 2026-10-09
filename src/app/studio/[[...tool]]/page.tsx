import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export { metadata, viewport } from "next-sanity/studio";
export const dynamic = "force-static";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main id="main" style={{ maxWidth: "36rem", margin: "4rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Sanity isn’t connected yet</h1>
        <p>
          Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> to <code>.env.local</code>, then restart
          the dev server. See “Content (Sanity)” in README.md.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
