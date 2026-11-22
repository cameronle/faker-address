# Faker Atlas

A static, browser-only synthetic profile generator built on `@faker-js/faker`.

## What it does

- Exposes every locale shipped by the installed Faker version.
- Generates names, addresses, postcodes, phones, emails, and companies locally in the browser.
- Lazy-loads locale chunks so the first page does not ship every locale.
- Shows when fields fall back to the complete English locale.
- Copies fields, exports JSON, and keeps no server-side data.

The output is synthetic test data. It is not guaranteed to exist and must not be used for billing, payment, identity verification, or real-world delivery.

## Local development

Requirements: Node.js 22.13+ and pnpm 9+.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite.

## Checks

```bash
pnpm check
pnpm test
pnpm build
```

## Cloudflare Pages

The production Pages project should be connected to the `production` branch of the GitHub repository. The build output is `dist/` and there is no backend or database.

Recommended build settings:

- Build command: `pnpm install --frozen-lockfile && pnpm build`
- Output directory: `dist`
- Root directory: `/`

## Upstream

The generator uses `@faker-js/faker` 10.6.0 under the MIT License. See `THIRD_PARTY_NOTICES.md`.
