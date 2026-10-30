# REVEX frontend

REVEX is a React and Vite car marketplace prototype. The interface uses Tailwind CSS v4, shadcn-style UI components, React Router, Lucide icons, and sample vehicle data.

## Run locally

```sh
npm install
npm run dev
```

Build the production bundle with `npm run build`. Preview it with `npm run preview`. Run commands from `Frontend/`. A production host must serve `index.html` for unknown paths so React Router can handle direct links.

## Pages

`/` Home · `/inventory` Inventory · `/inventory/:id` Car Details · `/about` About · `/services` Services · `/contact` Contact · `/login` Login · `/signup` Signup · `/forgot-password` Forgot Password · `/reset-password` Reset Password · `/verify-email` Verify Email. Unknown paths show a 404 page.

## Structure

- `src/app/router.jsx`: routes.
- `src/components/layout/`: shared Navbar, Footer, and scrolling.
- `src/components/shared/` and `src/components/ui/`: reusable UI.
- `src/features/`: page components and feature data.
- `src/styles/globals.css`: Tailwind entry and theme.
- `src/assets/`: bundled images.
- `public/`: files served at absolute URLs, including the favicon.

## Sample data and images

`src/features/inventory/data/cars.js` contains the inventory and `carDetails.js` adds illustrative details keyed by car ID. Replace the sample data at this boundary with API responses that preserve the same field names, or map API fields into that shape before rendering. The About timeline, team, contact details, service terms, and review statistics are illustrative too.

Bundled images are imported from `src/assets/`. `src/features/inventory/data/carImages.js` is the source of truth for inventory card and detail-gallery images; add vehicle image imports and mappings there rather than using public-root image paths. Missing vehicle photos show a neutral placeholder.

Contact and vehicle enquiry forms validate locally only. Newsletter, Google sign-in, and policy links also need real integration or content before launch. See `PLACEHOLDERS.md` for replacement points.
