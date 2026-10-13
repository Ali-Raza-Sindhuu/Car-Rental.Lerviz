# Lerviz – Frontend (home page)

Clean, frontend-only build of the home page. No backend, no database, no Docker.

**Stack:** React 19 · Vite · JavaScript (no TypeScript) · Tailwind CSS v4 · shadcn/ui (Radix) · React Router DOM

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into /dist
npm run preview    # serve the production build locally
```

Requires Node.js 20 or newer. Fonts (Michroma, Outfit, Space Grotesk) load from Google Fonts, so the first load needs internet.

## Project structure

```
src/
  main.jsx                 entry
  App.jsx                  router (/ and a 404)
  index.css                Tailwind v4 + theme tokens (@theme)
  pages/                   Home, NotFound
  components/
    layout/RootLayout.jsx  shared shell + scroll handling
    home/                  one file per section of the home page
    common/                SlantButton, ArrowPair, Heading, SectionTag, Avatars
    ui/                    shadcn components (button, accordion)
  data/
    site.js                brand name, nav, footer links, email
    home.js                all copy + image paths for the home page
  lib/utils.js             cn() helper
public/images/             optimized car photos (swap freely)
docs/BACKEND.md            backend plan (documentation only)
```

## Editing content

- Brand name, nav links, footer links, email: `src/data/site.js`
- Headlines, cars, FAQ, testimonials, stats, image paths: `src/data/home.js`
- Colours and fonts: `@theme` block in `src/index.css`

## Adding more shadcn components

`components.json` is already set up for JavaScript (`tsx: false`), so this works:

```bash
npx shadcn@latest add dialog
```

## Notes

- Everything on the page is static. The newsletter form and the "Contact us" button do not send anything yet.
- The backend is described in `docs/BACKEND.md`. Nothing in it is implemented.
