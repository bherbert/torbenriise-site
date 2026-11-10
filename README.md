# torbenriise.com

Rebuild of Torben Riise's author site (formerly on Wix): a single-page, mobile-first static site.

- `src/` — page source (HTML, CSS, JS, images, audio, sample chapters)
- `src/samples/<book>.html` — one sample-chapter file per book
- `build.mjs` — zero-dependency build: `src/` → `dist/`
- `.github/workflows/deploy.yml` — builds and publishes `dist/` to GitHub Pages on every push to `main`

```bash
npm run dev      # preview src/ at http://localhost:5173
npm run build    # build dist/
npm run preview  # build, then serve dist/ at http://localhost:4173
```

See `landing-page-progress.md` for project status and `docs/deployment-guide.md` for domain setup.
