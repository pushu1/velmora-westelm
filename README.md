# West Elm India E-Commerce Replica

A pixel-perfect, highly functional, full-stack **1-to-1 e-commerce replica** of [westelm.in](https://www.westelm.in) built using **Next.js (App Router)**, **Tailwind CSS v4**, **Framer Motion**, **Zustand**, and **Prisma/PostgreSQL**.

---

## ✨ Features Overview

*   **Premium Editorial Design:** Outfitted with typography, custom HSL color systems, stark line containers, tracking-widest letter spacings, and thin charcoal scrollbars that mirror West Elm's luxury magazine aesthetic.
*   **Sticky & Intuitive Navbar:** Sticky navbar with an animated scroll-up disclosure system, an automated autocomplete search indexing active keywords, user wishlist badges, and high-performance routing.
*   **Promotional Carousel:** Automatically cycles announcements with buttery-smooth fading Framer Motion animations.
*   **Dynamic Megamenu:** Interactive delay-hover multi-column megamenu showcasing category directories and featured lookbooks.
*   **Responsive Product Listing Page (PLP):** Features collapsible sidebar accordion filters (by price, availability, finish), active filters chip removals, sorting selectors, and product cards that swap image thumbnails on color swatch hover.
*   **Immersive Product Detail Page (PDP):** Integrates high-res image strips, mouse-magnifier cursor overlay zoom lens systems, dynamic swatches, stock alerts, specifications accordions, and related matching collection carousels.
*   **Persisted Zustand Store:** Synchronizes shopping bags and saved designs instantly to browser Local Storage under namespace `westelm-replica-storage`. Handles quantity changes, cart drawer opening actions, and GST taxes.
*   **Seamless Checkout Flows:** Shipping detail validation, dynamic Razorpay checkout triggers (automatically transitioning to fully featured mock simulations when secrets are absent), bank transaction authorization logs simulator, and checkout receipts.
*   **Credentials & SSO Authentication:** Toggleable credentials tab Sign In/Create Account sheets with input validations and an outline Google Single Sign-On integration.

---

## 🛠️ Technology Stack

*   **Framework:** Next.js 16 (App Router)
*   **Runtime:** React 19
*   **Styling:** Tailwind CSS v4 & PostCSS
*   **Animations:** Framer Motion 12
*   **Database ORM:** Prisma Client 6 & PostgreSQL
*   **State Management:** Zustand 5 (with Persistence Middleware)
*   **Icons:** Lucide React (with custom brand SVGs for Facebook, Instagram, YouTube, and Google)
*   **Payments:** Razorpay Node SDK (Client & API endpoints)

---

## 🏗️ Folder Directory Structure

```
.
├── prisma/
│   ├── schema.prisma       # Prisma Database schema (PostgreSQL provider)
│   └── seed.ts             # 20+ item database seeding script
├── public/                 # Optimized static assets & brand assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── checkout/   # Razorpay server checkout endpoints
│   │   │   └── products/   # Dynamic keyword / category API query
│   │   ├── category/[slug]/# Category catalog & filter sidebar
│   │   ├── checkout/       # Address forms, payment selection & Simulated Gateways
│   │   ├── login/          # My Design Account credentials pages
│   │   ├── product/[slug]/ # PDP specs & Related carousel
│   │   ├── wishlist/       # Saved lookbooks persisted layout
│   │   ├── globals.css     # Design tokens and custom styling
│   │   ├── layout.tsx      # Master HTML frame
│   │   └── page.tsx        # Homepage editorial grids
│   ├── components/
│   │   ├── checkout/
│   │   │   └── CartDrawer.tsx   # Smooth Framer Motion cart slider
│   │   └── common/
│   │       ├── AnnouncementBar.tsx# Sliding top news ribbon
│   │       ├── CategoryCatalog.tsx# Collapsible accordions PLP sidebar
│   │       ├── Footer.tsx         # Dark themed value grid and newsletter Footer
│   │       ├── MegaMenu.tsx       # Delay hover multi-column dropdowns
│   │       ├── Navbar.tsx         # Sticky scroll-up brand header
│   │       ├── ProductCard.tsx    # Swatch-swappable catalog product cards
│   │       └── ProductDetails.tsx # Mouse magnifier overlay zooms PDP
│   └── lib/
│       ├── db.ts           # Prisma client initializer + 20-product local fallback
│       └── store.ts        # Persisted Zustand state stores
```

---

## 🚀 Setting Up the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the site in Next.js Turbopack mode (featuring instant Hot Module Replacement).

### 4. Database Setup & Seeding (Optional)
If you wish to configure a PostgreSQL database, update the `DATABASE_URL` in `.env` and execute:
```bash
npx prisma db push
npx prisma db seed
```
*Note: If no database URL is set, the application automatically uses a beautifully curated 20-product static mockup dataset (`src/lib/db.ts`) as a fallback so that all features work out-of-the-box.*

---

## 🛡️ License

Replica developed for demonstration and preview purposes. All assets, designs, and branding remain trademarked by Reliance Brands Limited & Williams-Sonoma, Inc.
