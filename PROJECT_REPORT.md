# REVEX (LuxAuto) — Project Report

## 1. Overview

REVEX is a responsive front-end prototype for people browsing premium cars to buy or rent and exploring related services. It combines brand pages with inventory search, vehicle details, enquiry flows, and account screens. Built with React and Vite, it currently uses sample vehicle and placeholder business information, not verified marketplace data.

## 2. Tech stack

Dependencies below are from `Frontend/package.json`.

- **Framework/build:** React 19, React DOM 19, Vite 7, `@vitejs/plugin-react`
- **Styling:** Tailwind CSS 4, `@tailwindcss/vite`, `tw-animate-css`
- **Routing/state:** React Router DOM 7; Redux Toolkit and React Redux
- **Icons/UI:** Lucide React, Radix UI/Accordion, `@aliimam/icons`; local UI primitives. No `shadcn` package is listed.
- **Utilities/animation:** `clsx`, `tailwind-merge`, `class-variance-authority`, Motion, Framer Motion, Lenis

The app is JavaScript/JSX; TypeScript is not listed as a project dependency.

## 3. Pages and routes

Routes are defined in `Frontend/src/app/router.jsx`.

| Route | Page | Description |
|---|---|---|
| `/` | Home | Brand introduction, services, vehicle highlights, categories, and newsletter form. |
| `/inventory` | Inventory | Search, filter, sort, and browse the local vehicle listings. |
| `/inventory/:id` | Car Details | Vehicle gallery, specifications, estimates, enquiry, and related vehicles; unknown IDs show a vehicle-not-found state. |
| `/about` | About | Story, values, company figures, journey, and team sections. |
| `/services` | Services | Service descriptions, inspection information, process, and FAQs. |
| `/contact` | Contact | Contact form, dealership cards, map placeholder, and FAQs. |
| `/account` | Account redirect | Redirects to `/login`. |
| `/login` | Log in | Login form and Google sign-in button placeholder. |
| `/signup` | Sign up | Account registration screen. |
| `/forgot-password` | Forgot password | Requests a password reset through the auth API wrapper. |
| `/reset-password` | Reset password | Password reset screen. |
| `/verify-email` | Verify email | Email verification screen. |
| `*` | Not Found | Catch-all not-found page; route errors also have a separate error element. |

## 4. Key features

- Inventory search and filters (condition, listing type, price, body type, fuel, transmission, colour, year, mileage), sorting, grid/list display, pagination, and mobile filter drawer.
- Vehicle gallery, information tabs, FAQs, similar vehicles, and mobile action bar.
- Client-side monthly budget and rental estimates; these exclude finance costs/fees and rental extras and are not quotes.
- Contact and vehicle enquiry forms with client-side validation, plus shared headers, CTA banners, FAQ accordion, navigation, and footer.

## 5. Design system

`Frontend/src/styles/globals.css` imports **Manrope** and **Inter** from Google Fonts and configures Manrope as the sans font. Orange (`#f05a1a`, hover `#d94e14`) is the primary CTA/focus accent, alongside black/charcoal/white and Tailwind neutral shades. Theme tokens include background `#0a0a0a`, secondary `#242424`, borders/inputs `#3a3a3a`, and gold `#d4af37`.

Spacing and radii use Tailwind utilities (commonly `px-4 md:px-12`, `py-16 md:py-24`, and `rounded-lg` through `rounded-3xl`); no global radius scale was found. `PageHeader`, `CtaBanner`, and `FaqAccordion` repeat shared page patterns.

## 6. Project structure

Trimmed view of `Frontend/src/` (through two folder levels):

```text
src/
├── app/                 Router and Redux store
├── assets/              Bundled image assets
├── components/
│   ├── layout/           Navigation, footer, and scrolling
│   ├── shared/           Reusable page-level components
│   └── ui/               UI primitives, including accordion and button
├── features/
│   ├── about/            About page and sections
│   ├── account/          Login, registration, recovery, and verification
│   ├── contact/          Contact page and form sections
│   ├── home/             Home page sections
│   ├── inventory/        Inventory, data, and vehicle details
│   ├── not-found/        Not-found and route-error pages
│   └── services/         Services page and sections
├── lib/                  Small utility functions
├── shared/               Shared motion, styles, headings, and hooks
└── styles/               Global CSS and theme tokens
```

## 7. Data and state

Inventory records, details, and image mappings come from local JavaScript modules under `Frontend/src/features/inventory/data/`; the inventory page does not fetch an API. Filtering, sorting, pagination, tabs, calculators, and form state run client-side. Redux has an `inventory` slice for vehicles, brand filter, search, and sort, but `InventoryPage` currently uses local `CARS` data and React state instead.

## 8. Current status

- **Build:** `npm run build` succeeds when run from `Frontend`. Vite reports a minified JavaScript chunk above its 500 kB advisory threshold (about 764 kB before gzip).
- **Count:** 92 JavaScript/JSX source files (`.js`, `.jsx`, `.ts`, `.tsx`) were counted under `Frontend/src`; 81 are JSX page/component modules.
- **Sample or placeholder content:** `features/inventory/data/cars.js`, `carDetails.js`, and `carImages.js` contain local inventory, illustrative vehicle details, and image mappings. The bundled vehicle imagery in `Frontend/src/assets/` is sample content, including `sample_001.png` and `sample_01.png`; some image mappings are reused across different listings. `features/about/components/NumbersSection.jsx` and `TeamSection.jsx` contain hard-coded company figures and names that are not verified. `features/contact/components/DealershipsSection.jsx` explicitly labels branch details as placeholders, and `ContactMap.jsx` is a map placeholder. `features/services/components/ServicesFaqSection.jsx` notes draft programme figures. `features/home/components/NewsletterSection.jsx` shows a local success state but has a TODO for endpoint integration.
- **Not connected / not verified:** The contact and vehicle enquiry forms validate locally only and do not send or save submissions. The newsletter form also does not subscribe anyone. Account screens call a configurable auth API endpoint (`VITE_API_URL`, defaulting to `http://localhost:4000`); the `Backend/` directory contains no files, so a working server, endpoint contracts, and end-to-end authentication are **Not verified**. The Google sign-in control only displays a configuration message. Real dealership locations/map data and deployment are not present in the inspected code. No test script is defined in `package.json`.

## 9. How to run

Run these commands from the repository root:

```sh
cd Frontend
npm install
npm run dev
npm run build
npm run preview
```

The scripts are defined in `Frontend/package.json`.

## 10. Next steps

1. Connect the UI to a backend API and replace sample listings, images, specifications, and business details with verified production data.
2. Wire enquiry and newsletter forms to real services; complete and verify auth, including any intended Google sign-in.
3. Configure and deploy the app, add SEO metadata, and add automated tests for core routes and interactions.
4. Optimize the large image assets and JavaScript bundle identified by the production build.

## 11. Screenshots to add

- [ ] Home — desktop
- [ ] Inventory — desktop grid and list
- [ ] Car Details — desktop
- [ ] About — desktop
- [ ] Services — desktop
- [ ] Contact — desktop
- [ ] Mobile views — Home, Inventory/filter drawer, Car Details, and Contact

## 12. LinkedIn summary

I built REVEX (LuxAuto), a React and Vite front-end prototype for a premium vehicle marketplace. It brings together a home page, searchable and filterable inventory, vehicle detail views, brand and service content, contact flows, and account screens. On the inventory page, visitors can sort listings, switch between grid and list layouts, refine results, and page through a local dataset. Vehicle details include a gallery, expandable information, and client-side budget or rental estimates. I used React Router, Redux Toolkit, Tailwind CSS v4, Radix-based UI elements, and reusable shared components to keep the experience consistent across screen sizes. Contact and vehicle enquiry forms validate input in the browser, but do not send or store submissions. Account screens call a configurable API endpoint; a working backend was not verified. Vehicle records, specifications, business details, and images are sample content and should be replaced and checked before launch.

#React #Vite #TailwindCSS #FrontendDevelopment #WebDevelopment #CarMarketplace #UXDesign #JavaScript
