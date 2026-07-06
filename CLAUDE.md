# Bethora — Claude Code Guide

## Project Overview
Bethora is a Nigerian e-commerce web app built for a client selling women's fashion, men's fashion, children's wear, shoes, and jewelry. The live domain is bethora.com.ng.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** Firebase Authentication (Email/Password)
- **Database:** Firestore
- **Storage:** Cloudinary (product images, avatars) — Firebase Storage is NOT used; it requires the paid Blaze plan
- **Activity Tracking:** js-cookie

## Important: No `src` Directory
This project does NOT use a `src` folder. All code lives directly under the project root:
- `app/` — Next.js App Router pages and layouts
- `components/` — Reusable UI components
- `context/` — React context providers
- `lib/` — Firebase config, auth helpers, Firestore functions, cookies
- `types/` — TypeScript interfaces and constants

## No `hooks/` Directory
There is no `hooks/` folder in this project — do not create one.
- `useAuth()` is exported directly from `context/AuthContext.tsx`.
- `useCart()` is exported directly from `context/CartContext.tsx`.
- There used to be thin `hooks/useAuth.ts` / `hooks/useCart.ts` wrapper files that just re-exported these — they were deleted as redundant. Import directly from `@/context/AuthContext` and `@/context/CartContext` instead.
- There was also a `hooks/useProducts.ts` wrapper (`useProducts()` / `useProduct()`) around the Firestore product queries. It was unused dead code — every page that needs products (`app/products/page.tsx`, `app/products/[id]/page.tsx`, `components/storefront/FeaturedProducts.tsx`) already fetches manually with its own `useEffect` + `useState`, calling `getActiveProducts` / `getProductsByCategory` / `getProductById` from `lib/firebase/firestore.ts` directly. Keep doing it that way — inline fetching per component, no shared data-fetching hook.

## Brand
- Primary color: `primary-400` (#FF914D) — a custom Tailwind color scale defined via `@theme` in `app/globals.css` (Tailwind v4 CSS-first config, no `tailwind.config.js`). Use `primary-*` classes, not `yellow-*`, for anything brand/CTA-colored. Full scale:
  | Shade | Hex |
  |---|---|
  | primary-50 | #FFF6F0 |
  | primary-100 | #FFEDE0 |
  | primary-200 | #FFD6BD |
  | primary-300 | #FFBD94 |
  | primary-400 | #FF914D |
  | primary-500 | #FF7729 |
  | primary-600 | #F95B06 |
  | primary-700 | #CB480B |
  | primary-800 | #A5380D |
  | primary-900 | #852C0F |
- Font: Inter (Google Fonts)
- Style: clean, mobile-first, simple UX animations (fade-in, slide-up)
- Nigerian market — prices in Naira (₦), phone numbers in Nigerian format (0XXXXXXXXXX), states from NIGERIAN_STATES in types/index.ts

## Project Structure
```
bethora/
├── app/
│   ├── page.tsx                            # Homepage with hero slider, category row, trending products
│   ├── layout.tsx                          # Root layout — wraps AuthProvider + CartProvider + Inter font, renders <Footer /> after {children} on every page
│   ├── globals.css                         # Tailwind base + fade-in, slide-up keyframes, no-scrollbar utility
│   ├── products/
│   │   ├── page.tsx                        # Product listing — category filter pills, search, product grid
│   │   └── [id]/page.tsx                  # Product detail — images, size/color/qty picker, add to cart
│   ├── cart/page.tsx                       # Cart — item list, qty controls, order summary, checkout CTA
│   ├── checkout/page.tsx                   # Checkout — saved addresses, new address form, payment method, place order
│   ├── order-confirmation/[id]/page.tsx    # Confirmation — green checkmark, items, address recap, delivery ETA
│   ├── login/page.tsx                      # Login — email/password, show/hide password, forgot password link
│   ├── signup/page.tsx                     # Signup — name, email, Nigerian phone, password, terms checkbox
│   ├── forgot-password/page.tsx            # Forgot password — sends Firebase reset email, shows sent confirmation
│   ├── account/
│   │   ├── layout.tsx                      # Auth guard — redirects unauthenticated users to /login
│   │   ├── page.tsx                        # Overview — profile header (avatar links to /account/profile), stats, recent orders, account details, View Profile links to /account/profile
│   │   ├── profile/page.tsx                # Profile — view/edit name+phone (email locked), photo picker only in edit mode (deferred upload), change password (reauth required)
│   │   ├── orders/page.tsx                 # Orders — expandable list, track order modal (timeline), reorder to checkout
│   │   ├── addresses/page.tsx              # Addresses — CRUD, default address toggle, slide-up form modal
│   │   └── wishlist/page.tsx               # Wishlist — product grid, remove item, quick add to cart
│   ├── admin/
│   │   ├── layout.tsx                      # Auth guard — redirects if not signed in or not admin role
│   │   ├── page.tsx                        # Overview — stats cards, weekly revenue bar chart, recent orders, stock alerts
│   │   ├── products/page.tsx               # Products — searchable table, add/edit/delete, opens ProductEditor modal
│   │   ├── orders/page.tsx                 # Orders — searchable list, opens OrderStatusModal to update status
│   │   └── customers/page.tsx              # Customers — searchable card grid, initials avatar, orders + spend
│   ├── contact/page.tsx                    # Contact form (UI only) + contact info + Email/Call/WhatsApp cards
│   ├── faq/page.tsx                        # Accordion FAQ — 5 sections, single-open state, CTA to /contact
│   ├── support/page.tsx                    # Support hub — search bar (UI only), category card grid, help banner
│   └── legal/
│       ├── privacy-policy/page.tsx         # Static document — data collected, Firebase third-party use, cookies, rights
│       ├── terms-of-service/page.tsx       # Static document — pricing, orders, delivery, returns, liability, governing law
│       ├── return-policy/page.tsx          # Static document — 7-day return window, non-returnable items, refund timeline
│       └── cookie-policy/page.tsx          # Static document — cookie types, third-party (Firebase) cookies, managing cookies
├── components/
│   ├── shared/
│   │   ├── Navbar.tsx                      # Sticky navbar — logo, search, Phone icon (→ /support), cart count badge, user dropdown (Avatar), mobile menu
│   │   ├── Footer.tsx                      # Site-wide footer — rendered once in app/layout.tsx, on every page
│   │   ├── CookieConsent.tsx              # Fixed bottom cookie notice — rendered once in app/layout.tsx, Accept sets a 365-day consent cookie
│   │   ├── Avatar.tsx                      # Reusable avatar — renders `src` as a photo if present, else a gray circle with a lucide UserRound silhouette. Used everywhere a profile photo appears.
│   │   └── AccountSidebar.tsx             # Customer dashboard sidebar — Overview, My Profile, My Orders, Addresses, Wishlist, Sign Out
│   ├── storefront/
│   │   ├── HeroSlider.tsx                 # Auto-rotating hero — 4 slides with real Unsplash images, arrows, dot indicators
│   │   ├── CategoryRow.tsx                # 5-column category icon grid — links to /products?category=
│   │   ├── FeaturedProducts.tsx           # Fetches active products from Firestore, skeleton loaders, 2/3/4 col grid
│   │   └── ProductCard.tsx                # Product card — image, name, rating stars, price, wishlist heart, quick add button
│   └── admin/
│       ├── AdminSidebar.tsx               # Admin sidebar — Overview, Products, Orders, Customers
│       ├── SalesChart.tsx                 # Pure Tailwind bar chart — no external library, primary-colored bars, animated on mount
│       ├── ProductEditor.tsx              # Full product editor modal — all fields (see spec below)
│       └── OrderStatusModal.tsx           # Order detail modal — items, total, 3 status buttons
├── context/
│   ├── AuthContext.tsx                    # Firebase onAuthStateChanged — exposes user, profile, loading
│   └── CartContext.tsx                    # Cart state in localStorage — exposes items, addItem, removeItem, changeQty, clearCart, subtotal, delivery, total, count
├── lib/
│   ├── firebase/
│   │   ├── config.ts                      # Firebase app init — auth, db, storage exports
│   │   ├── auth.ts                        # signUp, logIn, logOut, resetPassword, getUserProfile, onAuthChange
│   │   └── firestore.ts                  # All Firestore read/write — products, orders, addresses, users
│   └── cookies.ts                         # trackProductView, logActivity, getOrCreateSessionId
└── types/
    └── index.ts                           # Product, Order, CartItem, Address, UserProfile interfaces
                                           # + NIGERIAN_STATES, CATEGORIES, SUBCATEGORIES
                                           # + SIZE_OPTIONS, SHOE_SIZE_OPTIONS, COLOR_OPTIONS constants
```

## Firestore Collections

| Collection | Key Fields |
|---|---|
| `products` | name, category, subcategory, description, price, oldPrice?, stock, sku, images[], tags[], sizes[], colors[], status, createdAt, updatedAt |
| `orders` | userId, items[], subtotal, delivery, total, address, paymentMethod, status, createdAt |
| `addresses` | userId, label, name, phone, address, state, isDefault |
| `users` | uid, name, email, phone, role, createdAt, photoURL? |

### Order Status Flow
```
Processing → Shipped → Delivered
```
Cancelled is also a valid status. (`Order["status"]` in `types/index.ts` only has these 4 values — don't reintroduce "Out for Delivery", it caused a type error against the tracking timeline in `app/account/orders/page.tsx` and was removed.)

### Product Status Values
- `Active` — visible in storefront
- `Draft` — hidden from storefront
- `Out of Stock` — auto-set when stock reaches 0

## Auth & Role System
- Firebase Email/Password auth
- On signup, a user document is created in Firestore `users/{uid}` with `role: "customer"`
- To make someone admin: go to Firestore Console → users → find the document → set `role: "admin"` manually
- **Users created directly in Firebase Console → Authentication do NOT get a Firestore `users/{uid}` doc automatically** — only `signUp()` in `lib/firebase/auth.ts` creates both the Auth user and the Firestore doc together. For a Console-created user, you must manually create the Firestore document yourself: Document ID = the user's Auth UID (from the Authentication tab), with fields `uid`, `name`, `email`, `phone` (all strings), `role` ("customer" or "admin"), and `createdAt` as a plain **Number** (epoch ms) — not Firestore's "Timestamp" type, since the app calls `new Date(profile.createdAt)` on it directly.
- `app/(auth)/login/page.tsx` redirects post-login based on role: `getUserProfile(uid)` is fetched right after `logIn()`, then `role === "admin"` → `/admin`, else → `/`
- `app/account/layout.tsx` — redirects to `/login` if not authenticated
- `app/admin/layout.tsx` — redirects to `/` if not authenticated or role !== "admin"

## Cart
- Persisted in `localStorage` under key `bethora_cart`
- Free delivery threshold: ₦20,000
- Delivery fee when below threshold: ₦1,500
- CartContext `addItem()` merges items with same productId + size + color combo

## Activity Tracking (cookies.ts)
- `trackProductView(productId)` — called on every product detail page load, stores last 20 viewed product IDs in cookie
- `logActivity(event, meta)` — called on add_to_cart and checkout. Currently logs to console. Wire to Firestore `activityLogs` collection in production.
- `getOrCreateSessionId()` — generates and persists a UUID session ID in cookie (expires 1 year)
- `hasCookieConsent()` / `setCookieConsent()` — backs `components/shared/CookieConsent.tsx`. Consent is stored in a `bethora_cookie_consent` cookie (expires 1 year); the banner only renders when this cookie is absent, checked client-side in a `useEffect` (js-cookie reads `document.cookie`, so this can't run during SSR — don't switch this to a lazy `useState` initializer, it will crash the build).

## Styling Conventions
- **Only Tailwind utility classes** — no custom CSS except keyframes in globals.css
- **Rounded corners:** `rounded-xl` (inputs, small cards), `rounded-2xl` (large cards, modals), `rounded-full` (buttons, pills, badges)
- **Primary CTA button:** `bg-primary-400 text-gray-900 font-bold rounded-full hover:bg-primary-500 transition active:scale-95`
- **Dark button:** `bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition active:scale-95`
- **Outline button:** `border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 transition`
- **Active pill/filter:** `bg-primary-400 text-gray-900` vs inactive `bg-gray-100 text-gray-600`
- **Status badges:** green for Delivered, blue for Shipped, **yellow** for Processing, red for Cancelled — intentionally still literal Tailwind `yellow-50`/`yellow-700` (not `primary-*`), so "Processing" reads as a neutral pending state rather than looking brand-highlighted. Same reasoning applies to the admin low-stock warning badge (`bg-yellow-50 text-yellow-700`) in `app/admin/page.tsx` — don't rename these to `primary-*` if the color system changes again.
- **Modals:** always `items-end sm:items-center` — slides up from bottom on mobile, centered on desktop
- **Skeleton loaders:** `animate-pulse bg-gray-100 rounded-xl` on all async data fetches
- **Page animations:** `fade-in` class on main content containers
- **No-scrollbar horizontal scroll:** `overflow-x-auto no-scrollbar` for category pills and sliders

## Types Reference (types/index.ts)

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  status: "Active" | "Draft" | "Out of Stock";
  rating?: number;
  reviewCount?: number;
  createdAt: number;
  updatedAt: number;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
}

interface Address {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  state: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  address: Address;
  paymentMethod: "pod" | "transfer";
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: number;
}

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: number;
  photoURL?: string;
}
```

## Firestore Helper Functions (lib/firebase/firestore.ts)

```
// Products
getActiveProducts()               → Product[]
getProductsByCategory(category)   → Product[]
getProductById(id)                → Product | null
getAllProducts()                   → Product[]   // admin only
createProduct(data)               → DocumentReference
updateProduct(id, data)           → void
deleteProduct(id)                 → void

// Orders
createOrder(order)                → string (order ID)
getOrdersByUser(userId)           → Order[]
getOrderById(id)                  → Order | null
getAllOrders()                     → Order[]     // admin only
updateOrderStatus(id, status)     → void

// Addresses
getAddressesByUser(userId)        → Address[]
addAddress(address)               → DocumentReference
updateAddress(id, data)           → void
deleteAddress(id)                 → void

// Users
getAllUsers()                      → UserProfile[]  // admin only
```

## Admin Dashboard — Detailed Specs

### app/admin/layout.tsx
- Use `useAuth()` — check `profile?.role === "admin"`
- If `loading` is true: show centered primary-colored spinner
- If not authenticated or not admin: `router.push("/")`
- Wrap children in a fragment, no extra UI

### app/admin/page.tsx (Overview)
- Import: `getAllOrders`, `getAllProducts` from firestore.ts
- **Stats cards (4):** Total Revenue (sum of all order totals), Total Orders (count), Avg Order Value (revenue/orders), Stock Alerts (products where stock <= 5 or stock === 0)
- Each stat card has a lucide icon (DollarSign, ShoppingBag, TrendingUp, AlertCircle), a % change badge (mock data fine), value, and label
- **SalesChart:** pass last 7 days mock data as `{ day: string, value: number }[]` — wire to real Firestore aggregation later
- **Recent Orders panel:** last 5 orders — show customer name, order ID, total, status badge. Link "View all" to /admin/orders
- **Stock Alerts panel:** products where stock <= 5 — show image, name, category, stock count badge (red if 0, yellow if low). Link "Manage" to /admin/products

### app/admin/products/page.tsx
- Fetch with `getAllProducts()`
- Search bar filters by product name
- Table columns (desktop): image (w-12 h-12 rounded-lg), name + SKU (subtext), category + subcategory (subtext), price, stock, status badge, edit + delete icons
- Mobile: show image, name, price, actions only
- "Add Product" button top right → opens `ProductEditor` with null product
- Edit icon → opens `ProductEditor` pre-filled with that product
- Delete icon → calls `deleteProduct(id)`, removes from local state, shows toast
- Status badge colors: Active=green, Draft=gray, Out of Stock=red

### app/admin/orders/page.tsx
- Fetch with `getAllOrders()`
- Search filters by order ID or customer name (order.address.name)
- Each row: order ID, customer name + date (subtext), total, status badge, chevron right
- Clicking any row opens `OrderStatusModal`
- After status update, refresh orders list

### app/admin/customers/page.tsx
- Fetch with `getAllUsers()`
- Search filters by name or email
- Card grid (2 col mobile, 3 col desktop)
- Each card: initials avatar (dark circle, white text, first letter of name), name, email, number of orders (fetch separately or store on user doc), total spent, joined date
- No edit/delete — read only view

### components/admin/AdminSidebar.tsx
- Sticky sidebar, same pattern as AccountSidebar
- Links: Overview (`/admin`), Products (`/admin/products`), Orders (`/admin/orders`), Customers (`/admin/customers`)
- Active state: `bg-primary-400 text-gray-900`
- Inactive: `text-gray-600 hover:bg-gray-50`
- Icons: LayoutDashboard, Package, ShoppingCart, Users (all from lucide-react)
- "Back to Store" link at bottom → href="/"
- Hidden on mobile — use pill tabs instead (same pattern as AccountSidebar mobile)

### components/admin/SalesChart.tsx
- Props: `data: { day: string; value: number }[]`
- Pure Tailwind — no chart library
- Container: `flex items-end justify-between gap-2 h-40`
- Each bar: `bg-gradient-to-t from-primary-400 to-primary-300 rounded-t-lg w-full`
- Bar height: `(value / maxValue) * 100%` using inline style
- Day label below each bar: `text-[11px] text-gray-500`
- Animate bars on mount using CSS `@keyframes growBar` already in globals.css

### components/admin/ProductEditor.tsx
- Props: `product: Product | null`, `onSave: (data: Partial<Product>) => Promise<void>`, `onClose: () => void`
- Modal: `fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50`
- Inner panel: `bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl p-5 max-h-[92vh] overflow-y-auto`
- Sections (each with a small uppercase label):
  1. **Basic Info:** name (input), category (select → CATEGORIES), subcategory (select → SUBCATEGORIES[category], disabled if no category), description (textarea, 3 rows), price (numeric input), stock (numeric input), SKU (input)
  2. **Product Images:** thumbnail strip of added images (first one marked "MAIN"), hover to remove (× overlay), dashed-border file picker below that uploads directly to Cloudinary via `uploadToCloudinary()` and appends the resulting URL(s) — shows a spinner label while uploading, disables Save while an upload is in flight
  3. **Tags:** pill display of added tags with × to remove, text input + Add button, also add on Enter key
  4. **Variants:** size toggle buttons (SIZE_OPTIONS for clothing, SHOE_SIZE_OPTIONS for Shoes category), color toggle buttons (COLOR_OPTIONS)
  5. **Visibility:** select — "Active — visible in store" | "Draft — hidden from store"
- If stock input becomes 0, auto-set status to "Out of Stock"
- Save button: "Add Product" or "Save Changes" depending on whether product prop is null
- All state managed internally, call onSave() with final payload on submit

### components/admin/OrderStatusModal.tsx
- Props: `order: Order | null`, `onClose: () => void`, `onStatusUpdate: (id: string, status: Order["status"]) => void`
- Modal same structure as ProductEditor
- Show: Order ID (bold), date, customer name + phone, delivery address
- Items list: image, name, size/color if present, qty, line total
- Order total row
- Status buttons row (3 buttons): Processing | Shipped | Delivered
  - Active status: `bg-primary-400 text-gray-900`
  - Inactive: `bg-gray-100 text-gray-600 hover:bg-gray-200`
  - Clicking a button calls `onStatusUpdate(order.id, status)` and visually updates immediately

## Image Handling
- Images (product photos and avatars) upload to **Cloudinary**, not Firebase Storage — Firebase Storage needs the paid Blaze plan, which this project doesn't have. `lib/cloudinary.ts` is the only place upload/delete logic lives:
  - `uploadToCloudinary(file, folder)` — unsigned upload straight from the browser to `https://api.cloudinary.com/v1_1/{cloud}/image/upload` using the `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` preset, returns `{ url, publicId }`.
  - `extractPublicId(url)` — parses a Cloudinary delivery URL back into its `public_id` (needed for deletion, since `Product.images`/`UserProfile.photoURL` only ever store the plain URL string, never the public ID).
  - `deleteFromCloudinary(urls)` — resolves each URL to a public ID (silently skipping any non-Cloudinary URL, e.g. legacy placeholder images) and POSTs to `app/api/cloudinary/delete/route.ts`. Best-effort: logs on failure, never throws, so callers don't need try/catch.
- `ProductEditor` calls `uploadToCloudinary(file, "products")` per selected file in `handleFileUpload` and pushes the returned URLs into `form.images[]`. Multiple files can be selected at once; the first image in the array is treated as the main product photo.
- `app/account/profile/page.tsx` handles avatars differently on purpose: the camera icon only exists inside the edit form (never on the read-only top card), and picking a file does **not** upload immediately. It creates a local preview via `URL.createObjectURL(file)` (stored in `photoPreview`/`photoFile` state) so the user sees the new photo instantly with no network call. The actual `uploadToCloudinary(photoFile, \`avatars/${uid}\`)` call only happens inside `updateProfile()` when the user clicks **Save Changes**, alongside the name/phone `updateDoc`. `photoPreview` is revoked with `URL.revokeObjectURL` on both Cancel and successful Save (see `clearPendingPhoto()`) to avoid leaking blob URLs. Replacing a photo does **not** delete the old Cloudinary avatar — that's an intentional gap, not a bug.
- **Save Changes is disabled until there's an actual change** — `isDirty` compares `form.name`/`form.phone` against `profile.name`/`profile.phone` and checks whether `photoFile` is set. Don't remove this guard; it's intentional so the button isn't clickable with no pending edits.
- All user-facing avatars (`account/profile`, `account` overview, `Navbar` account button, `admin/customers` cards) render through the shared `components/shared/Avatar.tsx` component: pass `src={profile?.photoURL}` and it shows the photo, or a gray circle with a lucide `UserRound` silhouette placeholder if there's no photo yet. There is no initials-letter fallback anymore — always use `<Avatar>` for new avatar UI, don't hand-roll another initials circle or img/fallback branch.
- **Deleting a product deletes its Cloudinary images first, then the Firestore doc** — `app/admin/products/page.tsx`'s `handleDelete(product)` calls `deleteFromCloudinary(product.images)` before `deleteProduct(product.id)`. If the Cloudinary call fails, the Firestore delete still proceeds (best-effort cleanup, not a transaction) — don't block product deletion on a third-party API blip.
- The final `images[]` array (of Cloudinary `secure_url`s) is what gets written to Firestore via `createProduct` / `updateProduct`.
- `next.config.ts` allowlists `res.cloudinary.com` in `images.remotePatterns` (for future `next/image` use — the app currently renders images with plain `<img>` tags).
- Never hardcode Unsplash URLs in production product data — those are for prototypes only. (`ProductEditor`'s save fallback still defaults to a placeholder Unsplash image only when a product is saved with zero uploaded images — replace with a real placeholder asset before launch.)
- **Cloudinary credential split matters:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are meant to be public (required client-side for the unsigned upload call). `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` must **never** get a `NEXT_PUBLIC_` prefix — they're only read inside `app/api/cloudinary/delete/route.ts` (server-side) to authenticate the Admin API delete call. Prefixing them with `NEXT_PUBLIC_` would leak the secret into the client JS bundle, letting anyone delete or overwrite any asset in the Cloudinary account.

## Environment Variables
All in `.env.local` at project root — never commit this file:
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

## Commands
```bash
npm run dev        # Start development server at localhost:3000
npm run build      # Production build
npm run lint       # Run ESLint
```

## What's Already Built
- ✅ Firebase config, auth helpers, all Firestore functions
- ✅ TypeScript types and constants
- ✅ Cookie-based activity tracking
- ✅ AuthContext + CartContext
- ✅ Root layout with providers
- ✅ globals.css with animations
- ✅ Navbar (sticky, search, cart badge, user dropdown, mobile menu)
- ✅ HeroSlider (4 slides, Unsplash images, auto-rotate, arrows, dots)
- ✅ CategoryRow (5-column uniform grid)
- ✅ ProductCard (image, rating, price, wishlist, quick add)
- ✅ FeaturedProducts (Firestore fetch, skeleton loaders)
- ✅ Homepage (hero + free delivery banner + trending)
- ✅ Product listing page (category filters, search, grid)
- ✅ Product detail page (images, size/color/qty, add to cart, tags)
- ✅ Cart page (items, qty controls, order summary, free delivery nudge)
- ✅ Checkout page (saved addresses, new address form, payment method, place order → Firestore)
- ✅ Order confirmation page (items, address recap, delivery ETA)
- ✅ Login page (Firebase auth, error handling, role-aware redirect after login — `role === "admin"` → `/admin`, else → `/`)
- ✅ Signup page (validation, Nigerian phone, Firebase auth, writes user to Firestore with `role: "customer"`, Terms/Privacy checkbox links open `/legal/terms-of-service` and `/legal/privacy-policy` in a new tab)
- ✅ Forgot password page (Firebase reset email)
- ✅ Account layout (auth guard)
- ✅ Account overview (profile, stats, recent orders, account details)
- ✅ Account profile (`/account/profile` — view/edit name+phone via local state + `refreshProfile()`, email locked, change password with Firebase reauthentication)
- ✅ Account orders (expandable list, track order timeline modal, reorder to checkout)
- ✅ Account addresses (CRUD, default toggle, form modal)
- ✅ Account wishlist (placeholder — wire Firestore wishlist collection)
- ✅ AccountSidebar
- ✅ Admin layout (auth guard — redirects to `/` if not signed in or not admin role)
- ✅ Admin overview (stats cards with mock trend %, `SalesChart` weekly bar chart, recent orders panel, stock alerts panel)
- ✅ Admin products (searchable table, add/edit/delete, `ProductEditor` modal with real Cloudinary image upload, deletes Cloudinary images before removing the Firestore doc)
- ✅ Admin orders (searchable list, `OrderStatusModal` to update status, toast on save)
- ✅ Admin customers (searchable card grid, initials avatar, joined date)
- ✅ AdminSidebar, SalesChart, ProductEditor, OrderStatusModal
- ✅ Footer (rendered site-wide from `app/layout.tsx` — logo/tagline, Quick Links, Legal, Contact Info, copyright bar). `app/page.tsx` no longer has its own inline footer.
- ✅ Contact page (`/contact` — info card, Email/Call/WhatsApp icon cards, form with UI-only success state)
- ✅ FAQ page (`/faq` — 5 accordion sections, single-open state, CTA to `/contact`)
- ✅ Support hub (`/support` — decorative search bar, category card grid, help banner)
- ✅ Legal pages (`/legal/privacy-policy`, `/legal/terms-of-service`, `/legal/return-policy`, `/legal/cookie-policy` — static document-style pages)
- ✅ CookieConsent banner (fixed bottom bar, rendered site-wide from `app/layout.tsx`, Accept sets a 1-year consent cookie, links to `/legal/cookie-policy`)

```
