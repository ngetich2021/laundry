This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Staff/Admin Dashboard

Alongside the public marketing site (`app/(site)/`), this repo includes an internal dashboard at `/admin` for running retention/CRM operations: clients, retention billing, campaign targets, ad spend, site-visit analytics, loyalty punch cards, referral rewards, daily reports, and role/permission management.

- **Database**: Prisma + Turso (libsql). The app connects to Turso at runtime via the driver adapter in `lib/prisma.ts`. The `DATABASE_URL` env var (a local `file:./prisma/dev.db`, gitignored) is only used by the Prisma CLI to author migrations — it is never used at runtime.
- **Making a schema change**: edit `prisma/schema.prisma`, run `npx prisma migrate dev --name <change>` (applies to the local file and generates SQL under `prisma/migrations/`), then apply that same SQL to Turso with `node scripts/apply-migration.mjs prisma/migrations/<folder>/migration.sql`.
- **Seeding**: `npx prisma db seed` creates the fixed permission list, the `Admin`/`Manager`/`Seller` roles, and allowlists the first admin email (see `prisma/seed.ts`).
- **Auth**: Auth.js v5 (Google provider only) gated by an `AllowedEmail` allowlist — only invited emails can sign in. Admins manage invites and roles at `/admin/settings/users` and `/admin/settings/roles`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
