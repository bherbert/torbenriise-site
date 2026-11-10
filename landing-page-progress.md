# Landing page progress — torbenriise.com rebuild

## How to continue in a new chat

Start with: *"Continue landing page development — read `landing-page-progress.md` to understand where we left off, then proceed with the next phase."*

## Workflow rules (from the original brief)

- Three phases max: **1 Foundation** → **2 Enhancement** → **3 Deployment**. Finish one phase, update this file, ask before starting the next.
- Start minimal; ask before adding "nice-to-have" features.
- Confirm before deleting files, removing directories, replacing more than 10 lines of existing code, or overwriting config. Back up first when in doubt.
- Standards: mobile-first, semantic/accessible HTML, WCAG contrast, SEO meta + structured data, PageSpeed 90+, no heavy dependencies.

## Project context

- **Client:** Torben Riise — Author, Writer, Speaker. Copenhagen-born, PhD biotech + MBA, 25 yrs biotech executive, Florida 1987, Phoenix area 2013. Big Ideas Forum presenter.
- **Current site:** Wix ("HOME | My Horizon"), 5 pages: Home, About me, Fiction, Non-fiction, Articles & Speeches.
- **Audience:** readers, event organizers, consulting prospects.
- **Primary goal:** showcase books (send to Amazon) and invite contact.
- **Branding:** none defined on the old site. New palette: ink navy `#15212f`, paper `#f7f2e9`, Nordic brick `#b5532c`, horizon amber `#d98a3d`. Fonts: Fraunces (display), Inter (body).
- **Contacts:** torben.riise@gmail.com (general), exec.kaizen@gmail.com (consulting, email orders).

## Phase status

### Phase 1 — Foundation ✅ (2026-11-09)

- Single-page site in `src/` replacing all five Wix pages: hero, stats strip, About (bio, timeline, civic roles, consulting callout), Fiction (9 novels, *Operation Scorpions* featured), Non-fiction (4 books), Articles & Talks, Music, Contact, footer.
- Contact form composes an email routed by topic (no backend needed).
- CSS-drawn book covers as fallbacks; real cover images load automatically if present.
- SEO: title/description, canonical, Open Graph, Person JSON-LD. A11y: skip link, focus rings, aria nav toggle, reduced-motion support.
- Zero-dependency build (`build.mjs`) → `dist/` (~40 KB total before fonts).
- Checked at 360/390/768/1366 px: no horizontal overflow, no JS errors.

### Phase 2 — Enhancement ✅ (2026-11-09)

- Project moved to `~/Desktop/landing-page` on Brant's Mac. Originals pulled from the Wix site are kept in `_wix/` (raw HTML, images, audio); safe to delete after launch.
- All 13 real book covers in `src/assets/images/covers/<slug>.jpg` (600px wide), also used on the hero shelf.
- Headshot `src/assets/images/torben-riise.jpg` — only a 240×240 original exists on Wix, so it's shown as a 240px circle. A larger photo from Torben would sharpen it.
- Social preview `src/assets/images/og-image.jpg` (1200×630, Earthrise photo from the old home page + name).
- COP15 songs as audio players: `src/assets/audio/a-new-tomorrow.mp3`, `save-the-planet.mp3` (MP3 tags credit performer Michael Dawn); one plays at a time.
- Co-author credits added from the covers: Nelson Abreu (*Ordinary People*), Emily Khalayi Wekulo (*Handbook*).
- Book JSON-LD for all 13 titles (Person + Book @graph).
- Not added (ask first): analytics, real form backend (Formspree/Netlify Forms), animations beyond current reveal.

### Post-Phase 2 tweaks (2026-11-09)

- Logo and footer "Back to top" now scroll to the very top (anchor moved from the sticky header to `<body id="top">`, plus smooth-scroll JS).
- Every book card (all 13) has a **Sample chapter** button that opens a reading window (native `<dialog>`; closes with ×, Esc, or clicking outside).
- Sample text lives in `src/samples/<slug>.html`, one file per book, currently a how-to note for Torben (div.sample-note). Replace the whole file with plain `<p>` paragraphs (optional `<h3>` chapter heading). `build.mjs` copies `src/samples/` to `dist/`.
- `build.mjs` embeds every sample into `dist/index.html` as a `<template>`, so the window works even when the page is opened straight from the folder (file://). After editing a sample, run `npm run build` (or preview `src/` with `npm run dev`).
- The Mac copy at `~/Desktop/landing-page` is now the source of truth.

### Phase 3 — Deployment ⏳ (started 2026-11-10)

- Domain: torbenriise.com is registered **at Wix** (Wix DNS, ns2/ns3.wixdns.net), paid through 2027-09-04. Torben's email is Gmail, so no mail records depend on Wix.
- Repo: **https://github.com/bherbert/torbenriise-site** — **private**, `main` pushed (creating it public was blocked; making it public is Brant's call).
- Local repo pushes over HTTPS using the `gh` login (repo-local credential helper). The Mac's SSH key for GitHub is broken (private/public key mismatch), and a Keychain login for another account answers first otherwise.
- `.github/workflows/deploy.yml` (build + publish to Pages) exists locally but is **not pushed**: the gh token lacks the `workflow` scope. Fix: `gh auth refresh -h github.com -s workflow`, then remove the line from `.git/info/exclude`, `git add` the file, commit and push.
- GitHub Pages on a private repo needs a paid plan (Pro/Team); on a free plan the repo must be public. Alternative: Netlify/Vercel can deploy a private repo for free.
- Still to do: enable Pages (or another host), review at the temporary URL, then point Wix DNS at it (or transfer the domain), HTTPS, redirect old Wix URLs, cancel the Wix site plan.

## Open questions for Torben

- Is *Operation Scorpions* published? The old site linked it to *The Moles* on Amazon, so the new site links to the Amazon author page for now.
- Which email should be primary?
- Any newer talks/articles to list by title?

## File locations

- `src/index.html`, `src/css/main.css`, `src/css/responsive.css`, `src/js/main.js`
- `src/assets/images/`, `src/assets/icons/favicon.svg`
- `dist/` — production build output
- `docs/deployment-guide.md`
- `build.mjs`, `package.json`
