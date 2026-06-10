# Portfolio — GitHub Pages Template

A minimal, dark editorial portfolio site with category navigation and smooth tile gallery. Inspired by the aesthetics of [drewwolf.com](https://www.drewwolf.com/) and [lam-bao.com](https://lam-bao.com/).

---

## Structure

```
portfolio/
├── index.html            ← All works (home)
├── gallery-2d.html       ← 2D illustration/art
├── gallery-3d.html       ← 3D renders/sculpts
├── gallery-design.html   ← Design work
├── about.html            ← About / contact
│
├── css/
│   └── style.css         ← All styles (edit colour vars at the top)
│
├── js/
│   ├── works.js          ← ✏️  YOUR DATA — edit this to add your work
│   └── main.js           ← Grid, lightbox, scroll-reveal logic
│
└── images/
    ├── 2d/               ← Drop 2D images here
    ├── 3d/               ← Drop 3D images here
    └── design/           ← Drop design images here
```

---

## Quick Start

### 1. Add your images

Place your images in the appropriate subfolder:
- `images/2d/`
- `images/3d/`
- `images/design/`

Recommended sizes:
- **Normal tiles**: 1200 × 900px minimum
- **Wide tiles**: 1600 × 700px minimum  
- **Tall tiles**: 900 × 1200px minimum
- Keep files under **500 KB** (use [Squoosh](https://squoosh.app/) to compress)

### 2. Edit `js/works.js`

Each entry in the `WORKS` array is one tile. Fields:

| Field   | Required | Description |
|---------|----------|-------------|
| `id`    | ✅       | Unique string, e.g. `"2d-01"` |
| `cat`   | ✅       | `"2d"` \| `"3d"` \| `"design"` |
| `title` | ✅       | Tile & lightbox title |
| `desc`  | —        | Lightbox description |
| `img`   | ✅       | Path from root, e.g. `"images/2d/piece.jpg"` |
| `thumb` | —        | Optional separate thumbnail (falls back to `img`) |
| `size`  | —        | `"normal"` (default) \| `"tall"` \| `"wide"` \| `"square"` |
| `year`  | —        | Year string shown in lightbox |

Example entry:
```js
{
  id:    "2d-07",
  cat:   "2d",
  title: "My New Piece",
  desc:  "A description of the work and process.",
  img:   "images/2d/new-piece.jpg",
  size:  "tall",
  year:  "2025"
}
```

### 3. Update your personal details

Find and replace `Your Name`, `hello@yoursite.com`, and Instagram/social links in:
- All `.html` files (header logo, footer)
- `about.html` (bio text, services)
- `js/works.js` (if relevant)

### 4. Customise the look (optional)

Open `css/style.css`. At the very top, CSS variables control the whole palette:

```css
:root {
  --bg:        #0d0d0d;   /* page background */
  --accent:    #c8a96e;   /* gold highlight colour */
  --cat-2d:    #c8a96e;   /* 2D category colour */
  --cat-3d:    #8fb8c8;   /* 3D category colour */
  --cat-design:#c89eb4;   /* Design category colour */
  /* ... */
}
```

---

## Deploy to GitHub Pages

1. **Create a new GitHub repo** (e.g. `yourusername.github.io` for a user site, or any name for a project site)
2. **Push all files** to the `main` branch
3. In the repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` → Folder: `/ (root)` → Save
4. Your site will be live at `https://yourusername.github.io` (or `https://yourusername.github.io/repo-name/` for project sites) within a minute or two.

> **Tip**: For a custom domain, add a `CNAME` file to the repo root containing your domain (e.g. `yoursite.com`), then configure your DNS.

---

## Features

- **Category nav** — top bar tabs for All / 2D / 3D / Design, matching the lam-bao.com pattern
- **Mixed tile sizes** — normal, tall, wide, square — set per item in `works.js`
- **Lightbox** — full-screen image viewer with keyboard arrows, swipe on mobile, and Escape to close
- **Scroll reveal** — tiles stagger-animate in as they enter the viewport
- **No dependencies** — pure HTML, CSS, and vanilla JS; no build step required
- **Static** — works on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages)

---

## Lighthouse / Performance Notes

- Images are lazy-loaded (`loading="lazy"`) except the first 6 visible tiles
- Use compressed WebP images where possible
- The Google Fonts stylesheet is the only external request

---

MIT — use freely.
