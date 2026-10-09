import { defineField, defineType } from "sanity";

export const agent = defineType({
  name: "agent",
  title: "Agent",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Web address", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "area", title: "Areas covered", description: "e.g. “Hyde Park & North Loop”", type: "string", validation: (r) => r.required() }),
    defineField({ name: "phone", type: "string", validation: (r) => r.required() }),
    defineField({ name: "email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "bio", type: "text", rows: 4, validation: (r) => r.required().max(600) }),
    defineField({ name: "photo", type: "photo" }),
    defineField({ name: "order", title: "Order on the team page", type: "number", initialValue: 10 }),
  ],
  orderings: [{ title: "Team order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "area", media: "photo" } },
});

export const neighbourhood = defineType({
  name: "neighbourhood",
  title: "Neighbourhood",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Web address", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "blurb", title: "Short description", type: "string", validation: (r) => r.required().max(90) }),
    defineField({ name: "photo", type: "photo" }),
    defineField({ name: "order", title: "Order on the home page", type: "number", initialValue: 10 }),
  ],
  orderings: [{ title: "Home page order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "blurb", media: "photo" } },
});

/* One document, edited from the "Office details" item in the Studio menu. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Office details",
  type: "document",
  fields: [
    defineField({ name: "phone", type: "string", validation: (r) => r.required() }),
    defineField({ name: "email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "address", type: "string", validation: (r) => r.required() }),
    defineField({ name: "hours", title: "Opening hours", type: "string", validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: "Office details" }) },
});
