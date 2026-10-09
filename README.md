# Haven Lane Realty: real estate website (Figma → Next.js + Sanity)

A website for **Haven Lane Realty**, a fictional estate agency in Austin, Texas. Designed in Figma, built in Next.js. Agents manage listings in Sanity Studio (built into the site at `/studio`); viewing requests and messages are saved in Supabase.

> Haven Lane is not a real agency. Addresses, people and reviews are made up; phone numbers use the 555 range reserved for fiction.

**Figma design:** https://www.figma.com/design/eWBDwnfUTo65ALknHc7PCU

## Pages
| Route | What it is |
|---|---|
| `/` | Home: hero with search, featured homes, neighbourhoods, agents, example reviews, valuation call to action |
| `/contact` | Office details and a message form |
| `/homes` | Listings: buy / rent / sold, area, type, price, beds, sort; map with price pins. Filters live in the URL, so a search can be shared |
| `/homes/[slug]` | Property: photo grid and full-screen viewer, facts, monthly estimate, map, viewing request form, similar homes |
| `/agents` | The team |
| `/agents/[slug]` | Agent profile, contact form and their homes for sale |
| `/studio` | Sanity Studio, where agents sign in to add and edit listings |

## Built with
- Next.js (App Router) and TypeScript
- Hand-written CSS Modules; design tokens in `src/styles/tokens.css` match the Figma Foundations frame
- Fraunces and DM Sans, self-hosted with `next/font/local`
- Sanity (headless CMS) for listings, agents, neighbourhoods and office details
- Supabase (Postgres) for enquiries, with row-level security
- Leaflet for maps (OpenStreetMap data, CARTO tiles)
- No UI or CSS framework

## Accessibility
- Every text colour pair meets WCAG 2.2 AA: `python3 scripts/contrast.py` (Windows: `py scripts\contrast.py`)
- 0 automated violations (axe-core); visible keyboard focus everywhere; skip link
- Search and filters work without JavaScript (plain forms)
- Map pins can be reached with the keyboard and are named for screen readers ("$685,000, 1408 Avenue F"); the list next to the map has the same homes
- The enquiry form lists errors at the top, moves focus there, and links each one to its field
- Scroll and hero animations are turned off for visitors who prefer reduced motion; a hero video, when added, has a pause button

## Colours
Palette "Harbour": light blue and white, navy for buttons and headings, coral accent. Tokens in `src/styles/tokens.css`.

## Run it locally
Needs Node.js 20.9 or newer.

```
npm install
npm run dev
```

Then open http://localhost:3000.

It runs straight away with built-in sample listings. To connect your own Sanity and Supabase projects, copy `.env.example` to `.env.local` and follow the two sections below.

## Content (Sanity)
1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage) (dataset: `production`). Copy the **Project ID** into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. In the project, open **API → CORS origins → Add**: `http://localhost:3000`, tick **Allow credentials**. (Add your Vercel address the same way later.)
3. Restart `npm run dev` and open http://localhost:3000/studio to sign in.
4. Fill it with the sample content: `npx sanity login`, then `npm run seed`.
5. Optional, so edits show on the live site straight away: **API → Webhooks → Create**, URL `https://YOUR-SITE/api/revalidate`, trigger on create / update / delete, and the same secret as `SANITY_REVALIDATE_SECRET`. Without it, edits appear within an hour.

## Enquiries (Supabase)
1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query**, paste `supabase/enquiries.sql`, **Run**. This creates the `enquiries` table with row-level security: the website can add enquiries but can never read, change or delete them.
3. **Project Settings → API**: copy the Project URL into `SUPABASE_URL` and the publishable (anon) key into `SUPABASE_PUBLISHABLE_KEY`.
4. New enquiries appear in **Table Editor → enquiries**. Tick `handled` when you've replied.

Keys stay in `.env.local` (never committed) and in Vercel's Environment Variables.

## Project files
- `PLAN.md`: scope, steps and progress
- `src/content/data.ts`: the one place pages get content from (Sanity, or the sample data until Sanity is connected)
- `src/sanity/`: Sanity settings, schemas and queries; `sanity.config.ts` sets up the Studio
- `src/supabase/` and `supabase/enquiries.sql`: saving enquiries, and the table with its security rules
- `scripts/seed-sanity.ts`: copies the sample content into Sanity
- `src/components/`: components, one folder each, matching the Figma components
