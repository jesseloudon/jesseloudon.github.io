# Jesse Loudon personal site

Personal website and technical publication built with Astro and hosted on GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Run the checks and production build locally with:

```bash
npm run check
npm run build
```

The production build also generates a static Pagefind search index under `dist/pagefind`. Search runs in the browser and does not require a server or database.

The site is deployed by `.github/workflows/astro.yml` when changes are pushed to `master`.
