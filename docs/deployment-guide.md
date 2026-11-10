# Deployment guide — torbenriise.com

The site is plain static HTML/CSS/JS. Any static host works.

## Build

```bash
npm run build      # src/ → dist/ (bundled + minified CSS/JS/HTML, assets copied)
npm run preview    # build, then serve dist/ at http://localhost:4173
npm run dev        # serve src/ unbundled at http://localhost:5173
```

Requires Node 18+. No npm dependencies.

## Option A — GitHub Pages

1. Create a repo and push this folder.
2. Add a GitHub Action that runs `npm run build` and publishes `dist/`, or commit `dist/` to a `gh-pages` branch.
3. Settings → Pages → custom domain: `www.torbenriise.com`. Tick **Enforce HTTPS**.
4. DNS at the registrar:

   - `www` CNAME → `<username>.github.io`
   - apex `@` A records → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153

## Option B — Netlify or Vercel

- Build command: `npm run build`
- Publish directory: `dist`
- Add the custom domain in the dashboard; SSL is provisioned automatically.

## Moving off Wix

1. Note the current DNS records in Wix (Domains → Manage DNS).
2. If the domain is registered through Wix, either transfer it to another registrar or point Wix DNS at the new host.
3. Keep the Wix site live until the new one resolves over HTTPS, then cancel the Wix plan.
4. Old Wix URLs (`/about-me`, `/fiction`, `/non-fiction`, `/articles-and-speeches`) should redirect to `/#about`, `/#fiction`, `/#non-fiction`, `/#talks` (Phase 3 adds redirect config per host).

## Before launch checklist

- Add real images to `src/assets/images/` (see `landing-page-progress.md`).
- Add `og-image.jpg` (1200×630) for social previews.
- Confirm both email addresses with Torben.
- Run Lighthouse on the deployed URL (target 90+ across the board).
