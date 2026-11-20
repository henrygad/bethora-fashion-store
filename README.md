# Bethora

Bethora is an e-commerce web app for a Nigerian fashion retailer, selling women's fashion, men's fashion, children's wear, shoes, and jewelry. Live at [bethora.com.ng](https://bethora.com.ng).

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`) |
| Auth | Firebase Authentication (Email/Password) |
| Database | Firestore |
| Media storage | Cloudinary (product images, avatars) — **not** Firebase Storage, which requires the paid Blaze plan |
| Activity tracking | Cookies via `js-cookie` |

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # Production build
npm run start   # Run a production build locally
npm run lint    # ESLint
npm run typecheck
npm test        # Unit tests
```

### Environment variables

Create `.env.local` at the project root (never commit it):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SITE_URL=https://bethora.com.ng

# Firebase Admin SDK (server only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional abuse protection
NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY=
```

`FIREBASE_PRIVATE_KEY`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` must **never** get a `NEXT_PUBLIC_` prefix. Prefixing them would leak the secrets into the client bundle.

## Project Structure

This project does **not** use a `src/` folder — everything lives directly under the project root:

```
app/            Next.js App Router pages and layouts (storefront, account, admin, legal, checkout)
components/     Reusable UI — shared/, storefront/, admin/
context/        AuthContext (Firebase auth state) and CartContext (localStorage cart)
lib/            Firebase config/auth/Firestore helpers, Cloudinary upload/delete, cookie tracking
types/          Product / Order / Address / UserProfile interfaces + Nigerian states, category constants
```

There is also no `hooks/` folder — `useAuth()` and `useCart()` are exported directly from their respective contexts (`context/AuthContext.tsx`, `context/CartContext.tsx`).

## Core Features

- **Storefront** — homepage with hero slider and trending products, category-filtered product listing, product detail with size/color/qty picker, cart, and a secure availability-request checkout that continues on WhatsApp before payment.
- **Accounts** — signup/login/forgot-password, profile editing with deferred Cloudinary avatar upload, order history with tracking timeline, address book, wishlist.
- **Admin dashboard** — revenue/orders overview with a sales chart, product CRUD with Cloudinary image upload, order status management, read-only customer directory. Gated behind `role === "admin"` on the user's Firestore profile.

## Data Model

Firestore collections: `products`, `orders`, `addresses`, `users`. Full field definitions are in [`types/index.ts`](types/index.ts); read/write helpers are centralized in [`lib/firebase/firestore.ts`](lib/firebase/firestore.ts) — always go through those functions rather than calling Firestore directly from components.

Request status flow: `Pending Availability → Availability Confirmed → Processing → Shipped → Delivered`, with `Unavailable` and `Cancelled` as terminal states.

## Fresh Firebase Setup

Firestore is schemaless, so an empty project does not need collections created in advance. Products, orders, addresses, and customer profiles are created by the app when first used.

To bootstrap the first administrator:

1. In Firebase Console, enable Email/Password authentication.
2. Create the user under Authentication → Users.
3. Grant that user admin access from the project directory:

```bash
npm run admin:grant -- admin@example.com
```

The command uses the server-only Firebase Admin credentials in `.env.local`. It finds the Authentication user and safely creates or updates `users/{uid}` in Firestore with `role: "admin"`. Never add an admin role through client-side signup code.

Publish `firestore.rules` and `firestore.indexes.json` in Firebase Console before opening the store to customers.

## Brand

- Primary color scale (`primary-50`…`primary-900`) defined in [`app/globals.css`](app/globals.css) via Tailwind v4's `@theme`; brand orange is `primary-400` (`#FF914D`). Use `primary-*` classes for brand/CTA-colored UI, not `yellow-*`.
- Font: Inter.
- Nigerian market conventions: prices in Naira (₦), local phone format (`0XXXXXXXXXX`), states drawn from `NIGERIAN_STATES` in `types/index.ts`.

## More Detail

See [`CLAUDE.md`](CLAUDE.md) for the full architecture reference — detailed page-by-page specs, styling conventions, Firestore helper signatures, and image-handling rules.
