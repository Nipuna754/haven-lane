import { defineField, defineType } from "sanity";

/* A photo with the alt text people using screen readers will hear. */
export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Describe the photo",
      description: "Read aloud to people who can't see it, e.g. “Kitchen with a long oak island”.",
      type: "string",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "tone",
      title: "Placeholder colour",
      description: "Shown while the photo loads, or if there isn't one yet.",
      type: "string",
      hidden: true,
    }),
  ],
});
