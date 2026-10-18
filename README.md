# Royal Laundry & Dry Cleaners — drycleaners.co.ke

A fully **static** website built with Next.js (App Router), Tailwind CSS and TypeScript.
There is no database, no login and no admin area: `npm run build` produces plain
HTML/CSS/JS in `out/`, which is uploaded to the web server.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes the finished site to out/
```

## Where to change things

| What | File |
|---|---|
| Phone, emails, address, opening hours, social links | `lib/site.ts` → `SITE` |
| Services and their pages (`/services/<slug>/`) | `lib/site.ts` → `SERVICES` |
| Prices (home page and `/pricing/`) | `lib/site.ts` → `PRICES` |
| Home page slider | `lib/site.ts` → `HERO_SLIDES` |
| Link-preview images (WhatsApp, Facebook) | `public/og/` |

## Pages

`/`, `/services/`, 7 service pages, `/pricing/`, `/location/`, `/contact/`, `/about/`, `/referrals/`,
plus `/sitemap.xml` and `/robots.txt` generated at build time.

## Deploy

Every merge into `main` runs `.github/workflows/deploy.yml`: it builds the site and
uploads `out/` to the server over SFTP (secrets: `SFTP_HOST`, `SFTP_PORT`,
`SFTP_USERNAME`, `SFTP_PASSWORD`). Pull requests only run the build as a check.

The booking and feedback forms send email through EmailJS from the browser.
