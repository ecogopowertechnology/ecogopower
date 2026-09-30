# Ecogo website

The public website for **Ecogo Power Technology Limited**, a Nairobi-based company working in technology and energy. It presents Ecogo, its products and solutions, and the upcoming shared power bank project, and collects enquiries and email signups through Supabase.

## Technology stack

| Area | Choice |
| --- | --- |
| UI | React 19 with TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (design tokens in `src/index.css`) |
| Routing | React Router (single page app, pages loaded on demand) |
| Data and forms | Supabase (Postgres with Row Level Security) |
| Fonts | Bricolage Grotesque and Figtree, self-hosted through Fontsource |
| Hosting | Netlify, deployed from GitHub |

Runtime dependencies are deliberately few: React, React Router, the Supabase client and two font packages.

## Local development

You need [Node.js](https://nodejs.org) 20 or newer (22 recommended).

```bash
npm install
cp .env.example .env      # then fill in the two Supabase values, see below
npm run dev               # http://localhost:5173
```

Other commands:

```bash
npm run typecheck   # TypeScript check only
npm run build       # type check, then production build into dist/
npm run preview     # serve the production build locally
```

The site runs without Supabase configured: it shows the built-in fallback content and the forms explain that sending is not switched on. That makes it safe to work on the design first.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key (newer projects label it the "publishable" key) |
| `VITE_SITE_URL` | Recommended once live | Public address such as `https://www.example.co.ke`, used for Open Graph tags, the sitemap and robots.txt. On Netlify it falls back to the site's own URL |

The anon key is designed to be public: it ships to the browser, and what it can do is limited by the Row Level Security policies in `supabase/migrations`. **The `service_role` key must never be added to this project, to `.env`, to GitHub, or to Netlify.** Nothing here needs it.

Variables starting with `VITE_` are baked into the site at build time, so after changing one you must redeploy.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste in and run `supabase/migrations/0001_initial_schema.sql`.
3. Run `supabase/seed.sql` for the starter products and the power bank project record.
4. Copy the **Project URL** and the **anon / publishable key** from **Project Settings, API** into your `.env` (and later into Netlify).

### Tables

| Table | Used for | Browser access |
| --- | --- | --- |
| `products` | Solutions shown on the site | Read published rows |
| `projects` | Company projects, starting with the power bank network | Read published rows |
| `contact_submissions` | Contact form messages | Insert only |
| `newsletter_subscribers` | Email signups | Insert only |

### Row Level Security in plain terms

RLS is on for every table, and the browser (anon role) is only granted what the site needs:

- **Products and projects:** anyone can read rows where `is_published = true`. Drafts are invisible.
- **Contact submissions and newsletter signups:** anyone can add a row, and nobody can read, change or delete rows from the browser. Database constraints limit field lengths and check the email format.
- **Reading submissions:** open **Table Editor** in the Supabase dashboard. Submissions do not send email notifications yet (see Future development).

`supabase/migrations/0002_admin_policies.sql.example` shows how an admin login would be added later. It is not run automatically.

## Editing content

- **Company details:** `src/content/site.ts` holds the phone number, email, address, hours and social links. Anything shown in a yellow `[Ecogo ...]` marker on the site is a placeholder to replace there.
- **Products:** edit the `products` table in Supabase (Table Editor). Set `is_published` to hide or show a row. To add a category, use a new `category` value and a filter appears automatically. `src/content/products.ts` is only the fallback used when the database is empty or unreachable.
- **Power bank status:** change `status` on the `projects` row (`concept`, `pilot_preparation`, `pilot`, `rollout`, `live`). The status bars on the home page and the project page follow it. Add a `launch_note` only once a date is confirmed.
- **Colours and type:** the tokens at the top of `src/index.css`. Brand blue (#194994) and brand green (#419225) come from the official logo.
- **Logo:** the official logo is in `src/components/visuals/Logo.tsx` (vector, with light and dark versions) and `public/logo.svg`, `public/logo-mark.svg`, `public/favicon.svg`. If the logo changes, replace those files and the paths in `Logo.tsx`.
- **Product images:** set `image_url` on a product to use a photograph instead of the built-in illustration. New illustrations are registered in `src/components/visuals/ProductVisual.tsx`.

## Build and deploy

Netlify reads `netlify.toml`, so the settings are already in the repository:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 22
- SPA routing: every path falls back to `index.html`, so deep links and page refreshes work

Follow **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the full step-by-step guide: GitHub, then Netlify, then Supabase, then the domain and the launch checklist.

## Project structure

```
.
├── index.html                  # HTML shell and default SEO tags
├── netlify.toml                # Netlify build, redirects and headers
├── vite.config.ts              # Vite config, plus sitemap and robots.txt generation
├── public/                     # Favicon, Apple icon, Open Graph image
├── supabase/
│   ├── migrations/             # Schema and RLS policies
│   └── seed.sql                # Starter products and project
├── docs/DEPLOYMENT.md          # Step-by-step launch guide
└── src/
    ├── main.tsx, App.tsx       # Entry point and routes
    ├── index.css               # Design tokens and type scale
    ├── content/                # Company details, fallback products and project
    ├── lib/                    # Supabase client, data fetching, form submission, types
    ├── hooks/                  # Catalogue data and per-page SEO tags
    ├── pages/                  # Home, About, Solutions, PowerBank, Contact, NotFound
    └── components/
        ├── layout/             # Header, Footer, page shell
        ├── ui/                 # Button, Section, Field, badges, product cards, icons
        ├── forms/              # ContactForm, NewsletterForm
        └── visuals/            # Logo, hero animation, station illustration, product art
```

## Before launch: content to confirm

The copy uses only what is known about Ecogo and marks the rest as placeholders. Please confirm these before the site goes public:

- Confirm the phone number, email, address and opening hours in `src/content/site.ts`
- Each product's description and feature list in `supabase/seed.sql`. They are written generally and may not match what is actually stocked
- The sourcing and procurement description and the line about sourcing from manufacturers in China
- The power bank project status, and that "payment by mobile money is planned" is accurate
- Whether to list a street address publicly, and which one

No launch dates, pricing, locations, station counts, partners, statistics, testimonials or certifications appear anywhere on the site.

## Future development

- **Admin dashboard:** the tables already have `is_published`, `sort_order` and `status` columns for this. Add Supabase Auth, apply `0002_admin_policies.sql.example`, and build screens for products, projects and submissions.
- **Power bank stations:** add a `stations` table (name, area, coordinates, status, host business) once locations are real, with a public read policy on published rows. `projects.details` (JSON) can hold interim data.
- **Notifications:** email yourself when a contact form arrives, using a Supabase Database Webhook with an Edge Function or a service such as Resend.
- **Spam protection:** forms have a honeypot field. If spam becomes a problem, add Cloudflare Turnstile or hCaptcha and verify it in an Edge Function.
- **Social previews per page:** Open Graph tags are set for the home page in the HTML. Per-page previews for crawlers that do not run JavaScript would need pre-rendering.
