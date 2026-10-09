/*
  Copies the sample listings, agents, neighbourhoods and office details into
  your Sanity project, uploading the sample photos (from Pexels, or from /public).

  Run (after `npx sanity login`):
    npx sanity exec scripts/seed-sanity.ts --with-user-token

  Safe to run again: it skips documents that already exist. To overwrite them
  with the sample data (this undoes edits made in the Studio), add:
    -- --replace
*/
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { buildDocuments } from "./seed-documents";

const replace = process.argv.includes("--replace");
const client = getCliClient({ apiVersion: "2026-10-01" });

async function download(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

const uploaded = new Map<string, Promise<string>>();
async function assetFor(src: string) {
  if (!uploaded.has(src)) {
    uploaded.set(
      src,
      (async () => {
        // Sample photos are Pexels URLs; local paths are read from /public
        const remote = /^https?:\/\//.test(src);
        const body = remote ? await download(src) : await readFile(path.join(process.cwd(), "public", src));
        const filename = remote ? `${new URL(src).pathname.split("/").pop()}` : path.basename(src);
        const asset = await client.assets.upload("image", body, { filename });
        console.log(`  uploaded ${src}`);
        return asset._id;
      })(),
    );
  }
  try {
    return await uploaded.get(src);
  } catch (err) {
    console.warn(`  skipped photo ${src}: ${(err as Error).message}`);
    return undefined;
  }
}

async function main() {
  const { projectId, dataset } = client.config();
  console.log(`Adding sample content to Sanity project ${projectId}, dataset "${dataset}"${replace ? " (replacing existing)" : ""}…`);

  const docs = await buildDocuments(assetFor);
  const tx = client.transaction();
  for (const doc of docs) {
    if (replace) tx.createOrReplace(doc);
    else tx.createIfNotExists(doc);
  }
  await tx.commit();

  const count = (type: string) => docs.filter((d) => d._type === type).length;
  console.log(`Done: ${count("home")} listings, ${count("agent")} agents, ${count("neighbourhood")} neighbourhoods and the office details.`);
  console.log("Open http://localhost:3000/studio to see them.");
}

main().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
