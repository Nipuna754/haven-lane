/* Settings for the `npx sanity ...` command line (used by the seed script). */
import nextEnv from "@next/env";
import { defineCliConfig } from "sanity/cli";

// Read the same .env.local the website uses
nextEnv.loadEnvConfig(process.cwd());

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
