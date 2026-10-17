# PLAN.md: App 5, real estate agency website ("Haven Lane Realty")

## Who it's for
Upwork clients who hire for real estate sites, property listing sites and "Next.js + headless CMS" builds. Proves: Figma-to-code, CMS setup (Sanity), search and filters, maps, forms, accessibility.

## What it is
A website for a made-up agency, **Haven Lane Realty**, in Austin, Texas. Agents add and edit homes in Sanity; the site shows them with photos, price, map and filters, and visitors send enquiries.

Fictional on purpose. The footer says so, and photos are free stock from Pexels.

## Pages
1. **Home**: hero (short muted video, search bar: buy/rent, area, price), featured homes, browse by neighbourhood, why Haven Lane (3 points), meet the agents, example reviews (labelled as examples), call to action.
2. **Listings** (`/homes`): filters (buy/rent, price range, beds, baths, property type, neighbourhood), sort, grid of cards, map view toggle, results count, "no results" state.
3. **Property page** (`/homes/[slug]`): photo gallery with lightbox, price and status, key facts (beds, baths, size, year built), description, features list, map, agent card, enquiry form, similar homes.
4. **Agents** (`/agents`) and agent profile with their listings.
5. **Contact** (`/contact`): office details, map, general enquiry form.

## What it stores
| Where | What |
|---|---|
| **Sanity** (CMS) | Properties, agents, neighbourhoods, site settings (phone, email, office hours). Edited by agents in Sanity Studio. |
| **Supabase** | Enquiries from the forms (name, email, phone, message, which home). Row-level security on. |

## Steps (same order as the videos)
| Step | This app |
|---|---|
| 1. Plan | This file. Approve before building. |
| 2. Design | I design Home, Listings and Property page in your Figma (desktop + phone), in the chosen colours. You review in Figma. |
| 3. Front end | Build the pages from the Figma file, with sample data first |
| 4. Back end | Sanity for content (real listings), Supabase for enquiries |
| 5. Log-in | Agents log in to Sanity Studio at `/studio` to manage homes (Sanity's own sign-in) |
| 6. Payments | Skipped: agencies don't take payments on their website |
| 7. Go live | GitHub + Vercel, env vars for keys, final QA |

## Tech
- Next.js (App Router, TypeScript), hand-written CSS with design tokens (same approach as App 1)
- Sanity (free plan) with Studio embedded at `/studio`
- Supabase (free plan) for enquiries
- Map: Leaflet with OpenStreetMap (free, no key needed for a demo)
- Images through `next/image` (resized, lazy-loaded)
- Secret keys only in `.env.local` and Vercel settings, never in the code or on GitHub

## Design direction
Calm, premium, photo-led. Large photos, generous white space, one strong accent colour, a serif for headings with a clean sans for text. Motion like App 1: gentle reveals, hover lift on cards, smooth gallery, all off for reduced motion.

Palette: **Harbour** (chosen 7 Oct, replacing Evergreen, which looked too close to App 1 Fieldnote):
light blue `#DCEBFA` / `#F3F7FB`, white, navy `#17365F` for buttons, headings and footer, coral accent `#D9643C` (icons) / `#B0452A` (small text, accent button).
Layout change at the same time, also to set it apart from Fieldnote: centred hero headline on a light blue band, floating search bar, wide rounded photo underneath, pill-shaped buttons.
Other options shown and not chosen: sand & terracotta, lavender & plum, mono & cobalt.

All text colour pairs are checked against WCAG AA by script (`scripts/contrast.py`), as in App 1.

## Photos and video
- Houses and interiors: free stock (Unsplash / Pexels) or AI-generated
- Agents: AI-generated portraits
- Hero video: free Pexels clip, compressed under ~3 MB, with a still image first and a pause button
- Footer note: "Haven Lane Realty is a fictional agency for a portfolio project. Photos are stock or AI-generated."

## Done when
- Figma file and live site match closely at 360 / 768 / 1280 px
- An agent can add a home in Sanity and it appears on the site
- Filters, map, gallery and enquiry form all work; enquiries arrive in Supabase
- Lighthouse accessibility 90+ (aim 100), visible keyboard focus, reduced motion respected
- Live on Vercel, public GitHub repo
- Case study (Problem / Solution / Tech / Result), demo video, screenshots, and "Figma design → live site" comparison images

## Figma file
https://www.figma.com/design/eWBDwnfUTo65ALknHc7PCU

Contents: Foundations (colours, type scale), Components (logo, 3 buttons, badge, field, textarea, listing card, agent card, desktop and phone nav, desktop and phone footer), and desktop pages for Home, Listings and Property. Photo boxes are named "Photo / …" so they can be filled with the Unsplash plugin.

Fonts: Fraunces (headings, prices) and DM Sans (text, UI). Both are free Google fonts.
Colour rule from the contrast check: coral `#D9643C` only for icons and large details (3.6:1 on white); small coral text and accent buttons use coral dark `#B0452A` (5.6:1).
Note: the Figma file still has the Evergreen colours and the old hero. Update its colour styles and hero frame when the Figma limit resets (or by hand: 4 colour styles + 1 frame).

## Progress
- [x] Step 1: Plan (palette B, Evergreen; changed to Harbour in Step 4, see Design direction)
- [x] Step 2a: Figma foundations, components, desktop Home / Listings / Property
- [ ] Step 2b: Phone layouts (Figma's free plan read limit was reached; phone layouts will be built in code from the phone components, or added to Figma when the limit resets)
- [ ] Step 2c: Photos in Figma (Unsplash plugin)
- [x] Step 3.1: Project setup (Next.js 16, tokens from Figma, Fraunces + DM Sans self-hosted), components (logo, buttons, badge, photo slot, listing card, agent card, sticky menu with phone menu, footer), Home page (hero with search, stats, featured homes, neighbourhoods, why us, agents, example reviews, valuation CTA) and a simple Contact page. Checks: contrast 18/18 pairs pass; axe 0 violations (desktop + phone, motion on and off); no sideways scroll at 320 / 390 / 768 / 1440; Lighthouse accessibility, best practices and SEO 100, performance mobile 93–95 / desktop 100, layout shift 0
- [x] Step 3.2: Listings page `/homes`: filters (buy / rent / sold, area, type, price, beds) and sort, all in the URL so results can be shared; filters update as you change them and still work without JavaScript; removable filter chips; empty state; map with price pins (Leaflet + OpenStreetMap / CARTO tiles) beside the list on desktop, a Show map / Show list switch on phones
- [x] Step 3.3: Property page `/homes/[slug]` (photo grid + full-screen viewer with arrow keys, facts, monthly estimate, features, location map, viewing request form with clear error messages, similar homes, phone bar with Call / Book) and agent pages `/agents`, `/agents/[slug]`. Checks: axe 0 violations on every page (desktop + phone, motion off; with motion on, only a card half way into view at the bottom edge is flagged while it fades in); no sideways scroll at 320 / 390 / 768 / 1024; Lighthouse accessibility 100 (listings desktop 96 for the same fading card), SEO 100, performance mobile 95–99 / desktop 100, layout shift 0. Best practices 96 on map pages only because this test workspace blocks the map tiles
- [x] Redesign (7 Oct): Harbour palette (light blue, white, navy, coral) and new hero layout, so App 5 no longer looks like App 1. Contrast 25/25 pairs pass
- [x] Step 3.4: Photos (57 Pexels photos, loaded from the Pexels CDN; the seed copies them into Sanity). Hero video skipped.
- [x] Step 7 (part): GitHub repo + Vercel deploy, live at https://haven-lane.vercel.app
- [x] Step 4 (code): Sanity schemas (listing, agent, neighbourhood, office details) and Studio at `/studio`; one data layer that reads Sanity, or the sample data until Sanity is connected; seed script that copies the sample content into Sanity; webhook `/api/revalidate` so published edits show straight away; Supabase `enquiries` table with row-level security (visitors can add, never read); viewing / contact forms save to it, with a spam trap and a clear message if saving fails; contact page form; styled 404. Checks: GROQ queries tested against the seed documents (all fields match the sample data); SQL tested on Postgres (13/13 permission and validation checks); forms tested end to end against a stand-in Supabase API; webhook rejects bad signatures and refreshes content; axe 0 violations; Lighthouse accessibility 100 / performance mobile 94–97
- [x] Step 4 (accounts, 12 Oct): Sanity and Supabase projects created, keys in `.env.local` and Vercel (Production), SQL run, seed run (57 photos). Checks: the website's key can add enquiries but gets "permission denied" reading them; contact and viewing forms save locally; the live contact form saves; live `/homes` photos all come from Sanity. Sanity webhook "Refresh live site" (14 Oct) calls `/api/revalidate` on publish for homes, agents, neighbourhoods and office details: the live route accepts a signed call (200) and rejects a bad one (401). CORS origin for the live site allows sign-in, ready for Step 5
- [x] Step 5: Log-in (14 Oct). Agents sign in to Sanity Studio at `/studio` on the live site (GitHub sign-in). Check: a price changed through the Sanity API showed on the live property page within 6 to 9 seconds, then was changed back. This needed reading Sanity without its CDN, which could serve the old price right after a publish
- [x] Step 6: Payments skipped (agencies don't take payments on their website)
