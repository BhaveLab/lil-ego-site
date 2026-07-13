# Lil Ego — lilegoverse.com

Static site. No framework, no build step — plain HTML/CSS/JS. Same pattern as
Meridian and Bhavé's Lab: own repo, Vercel, zero monthly platform fees.

## Structure

```
/index.html        homepage — hero + 4 doors (Books / Shirts / Watch / School)
/books.html        Gumroad-linked titles
/shirts.html        Stripe-linked shirts, stock-aware sizes
/watch.html          YouTube embed + subscribe
/assets/css/style.css
/assets/js/main.js   <- all editable links + shirt stock live here
/assets/img/         drop art assets here (see list below)
```

School is **not** a page — the nav and homepage door link straight out to
`school.lilegoverse.com`, which stays exactly as-is.

## Before launch — assets needed in /assets/img/

- `hero-throne.png` — homepage hero art (Lil Ego on throne/crown). ~1200x1500.
- `cover-audacity.png` — Audacity of Ascension book cover
- `shirt-dark-night.png`, `shirt-meditation.png`, `shirt-healing-now.png` — real
  inventory photos, square-ish crop works best

Until these are dropped in, each spot shows a labeled placeholder — nothing
breaks, it just says what file is missing.

## Before launch — links to paste into assets/js/main.js

Open `assets/js/main.js` and replace every `REPLACE_ME_...` placeholder:

- `CONFIG.gumroad["audacity-of-ascension"]` → the real Gumroad product URL
- `CONFIG.shirts[].stripeLink` → the Stripe Payment Link / Buy Button URL per shirt

Shirt sizes/stock also live in that same file (`sizes: { S: true, ... }`) —
flip a size to `false` and it shows sold-out on the site immediately on next
deploy. No CMS, no dashboard — just edit and push.

## Watch page

`watch.html` has a hidden `<iframe id="latest-episode">`. Once the first
episode is live on YouTube:
1. Set the `src` to `https://www.youtube.com/embed/VIDEO_ID`
2. Remove `style="display:none;"` from the iframe
3. Remove or hide the `#video-placeholder` div

Also update the `href="https://www.youtube.com"` Subscribe button to the real
channel URL once it exists.

## Deploy steps

1. **New repo** under the BhaveLab GitHub org (e.g. `lil-ego-site`). Push this
   folder as the repo root.
2. **Vercel** → Import Project → pick the repo. No framework preset needed
   ("Other" / static — there's no build command, output is the repo root).
3. Vercel gives a preview URL (`*.vercel.app`) — check all 4 pages there first.
4. **Namecheap** → lilegoverse.com → Advanced DNS:
   - Remove the old Shopify A/CNAME records on the **root** (`@`)
   - Add Vercel's records (Vercel shows the exact A record / CNAME to use
     when you add the domain in the Vercel project settings)
   - **Do not touch** the `school` subdomain CNAME — that stays pointed at
     GitHub Pages exactly as it is
5. In Vercel project settings, add `lilegoverse.com` as the production domain.
6. Once DNS propagates, confirm `school.lilegoverse.com` still resolves
   correctly (it's a separate CNAME, so it should be untouched, but verify).

## Editing content later

- Book/shirt copy: edit directly in `books.html` / `shirts.html` (one-line
  voice descriptions are inline, easy to find and swap)
- Homepage door captions: the `sticky-note` spans in `index.html`
- Adding a 4th shirt or new book: copy an existing `.book-card` /
  `CONFIG.shirts` entry and adjust
