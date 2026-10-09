"use client";

/*
  Sanity Studio, served by the site itself at /studio. Agents sign in there
  with their Sanity account to add and edit listings.
*/
import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

const SETTINGS_ID = "siteSettings";

// Menu: Listings, Agents, Neighbourhoods, and one "Office details" page.
const structure: StructureResolver = (S) =>
  S.list()
    .title("Haven Lane")
    .items([
      S.documentTypeListItem("home").title("Listings"),
      S.documentTypeListItem("agent").title("Agents"),
      S.documentTypeListItem("neighbourhood").title("Neighbourhoods"),
      S.divider(),
      S.listItem()
        .title("Office details")
        .id(SETTINGS_ID)
        .child(S.document().schemaType("siteSettings").documentId(SETTINGS_ID).title("Office details")),
    ]);

export default defineConfig({
  name: "haven-lane",
  title: "Haven Lane",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // "Office details" is a single page, so hide it from the "Create new" menu
    templates: (templates) => templates.filter((t) => t.schemaType !== "siteSettings"),
  },
  document: {
    actions: (actions, ctx) =>
      ctx.schemaType === "siteSettings" ? actions.filter((a) => a.action !== "duplicate" && a.action !== "delete" && a.action !== "unpublish") : actions,
  },
});
