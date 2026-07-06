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

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` must **never** get a `NEXT_PUBLIC_` prefix — they authenticate server-side deletes in `app/api/cloudinary/delete/route.ts`. Prefixing them would leak the secret into the client bundle.

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

- **Storefront** — homepage with hero slider and trending products, category-filtered product listing, product detail with size/color/qty picker, cart, checkout (saved addresses, Pay on Delivery / Bank Transfer), order confirmation (success and failure states).
- **Accounts** — signup/login/forgot-password, profile editing with deferred Cloudinary avatar upload, order history with tracking timeline, address book, wishlist.
- **Admin dashboard** — revenue/orders overview with a sales chart, product CRUD with Cloudinary image upload, order status management, read-only customer directory. Gated behind `role === "admin"` on the user's Firestore profile.

## Data Model

Firestore collections: `products`, `orders`, `addresses`, `users`. Full field definitions are in [`types/index.ts`](types/index.ts); read/write helpers are centralized in [`lib/firebase/firestore.ts`](lib/firebase/firestore.ts) — always go through those functions rather than calling Firestore directly from components.

Order status flow: `Processing → Shipped → Delivered`, with `Cancelled` as a fourth terminal state.

## Making a User an Admin

Sign up normally, then in the Firestore console set that user's `users/{uid}` document field `role` to `"admin"`. Users created directly via Firebase Console → Authentication don't get a Firestore profile automatically — only the app's `signUp()` flow creates both; a Console-created user needs its `users/{uid}` document created by hand (see `CLAUDE.md` for the exact field list).

## Brand

- Primary color scale (`primary-50`…`primary-900`) defined in [`app/globals.css`](app/globals.css) via Tailwind v4's `@theme`; brand orange is `primary-400` (`#FF914D`). Use `primary-*` classes for brand/CTA-colored UI, not `yellow-*`.
- Font: Inter.
- Nigerian market conventions: prices in Naira (₦), local phone format (`0XXXXXXXXXX`), states drawn from `NIGERIAN_STATES` in `types/index.ts`.

## More Detail

See [`CLAUDE.md`](CLAUDE.md) for the full architecture reference — detailed page-by-page specs, styling conventions, Firestore helper signatures, and image-handling rules.
