/**
 * works.js — Portfolio data file
 *
 * HOW TO ADD YOUR WORK:
 * ─────────────────────
 * 1. Drop your images into the /images/ folder
 *    (suggested subfolders: images/2d/, images/3d/, images/design/)
 * 2. Add an entry to the WORKS array below
 * 3. Optionally set `size` to control tile layout:
 *    "normal" (default 4:3), "tall" (3:4), "wide" (spans 2 cols, 16:7), "square" (1:1)
 *
 * FIELDS:
 *   id       – unique string identifier
 *   cat      – category: "2d" | "3d" | "design"
 *   title    – display title
 *   desc     – short description shown in lightbox
 *   img      – path to image (relative to root), e.g. "images/2d/piece1.jpg"
 *   thumb    – optional separate thumbnail; falls back to img
 *   size     – optional: "normal" | "tall" | "wide" | "square"
 *   year     – optional year string
 */

const WORKS = [

  /* ── 2D ── */
  {
    id:    "2d-fleur",
    cat:   "2d",
    title: "Fleur",
    desc:  "Personal art.",
    img:   "images/2d/fleur.png",
    size:  "normal",
    year:  "2026"
  },
  {
    id:    "2d-concept",
    cat:   "2d",
    title: "Concept Art",
    desc:  "Concept art for a personal project.",
    img:   "images/2d/concept.png",
    size:  "wide",
    year:  "2026"
  },
  {
    id:    "2d-concept-character",
    cat:   "2d",
    title: "Concept Character",
    desc:  "Concept art for a personal project.",
    img:   "images/2d/concept-character.png",
    size:  "tall",
    year:  "2026"
  },
  {
    id:    "2d-edgegooner2",
    cat:   "2d",
    title: "Edgegooner Fanart",
    desc:  "Fanart study.",
    img:   "images/2d/edgegooner2.png",
    size:  "normal",
    year:  "2025"
  },
  {
    id:    "2d-hourglass",
    cat:   "2d",
    title: "Hourglass",
    desc:  "Fanart study.",
    img:   "images/2d/hourglass.png",
    size:  "tall",
    year:  "2025"
  },
  {
    id:    "2d-kiperina2",
    cat:   "2d",
    title: "Kiperina Fanart",
    desc:  "Fanart study.",
    img:   "images/2d/kiperina 2.png",
    size:  "normal",
    year:  "2025"
  },
  {
    id:    "2d-miku2",
    cat:   "2d",
    title: "Miku Fanart",
    desc:  "Fanart study.",
    img:   "images/2d/miku2.png",
    size:  "square",
    year:  "2025"
  },
  {
    id:    "2d-pastry",
    cat:   "2d",
    title: "Pastry",
    desc:  "Fanart study.",
    img:   "images/2d/pastry.png",
    size:  "normal",
    year:  "2025"
  },
  {
    id:    "2d-silk",
    cat:   "2d",
    title: "Silk Fanart",
    desc:  "Fanart study.",
    img:   "images/2d/silk.png",
    size:  "wide",
    year:  "2025"
  },

  /* ── 3D ── */
  {
    id:    "3d-mockup1",
    cat:   "3d",
    title: "Design Mockup I",
    desc:  "Design mockup for an academic project.",
    img:   "images/3d/Mockup.png",
    size:  "wide",
    year:  "2026"
  },
  {
    id:    "3d-mockup2",
    cat:   "3d",
    title: "Design Mockup II",
    desc:  "Design mockup for an academic project.",
    img:   "images/3d/mockup2.png",
    size:  "normal",
    year:  "2026"
  },

  /* ── DESIGN ── */
  {
    id:    "design-book-pdf",
    cat:   "design",
    title: "Type Specimen Booklet",
    desc:  "Experimental typography booklet. A multi-page interactive catalog rendered dynamically from a PDF document. Press on the screen sides or swipe to turn pages.",
    pdf:   "images/design/Househol_Specimen.pdf",
    img:   "images/design/placeholder.svg",
    size:  "wide",
    year:  "2026"
  },
  {
    id:    "design-book-images",
    cat:   "design",
    title: "Manifesto Booklet",
    desc:  "Academic project. An interactive 3D digital scrapbook compiled from separate design sheets. Press on the screen sides or swipe to turn pages.",
    pages: [
      "images/design/manifesto-cover.png",
      "images/design/manifesto-00.png",
      "images/design/manifesto-02.png",
      "images/design/manifesto-h (1).png",
      "images/design/manifesto-h (2).png",
      "images/design/manifesto-h (3).png",
      "images/design/manifesto-h (4).png"
    ],
    img:   "images/design/manifesto-cover.png",
    size:  "normal",
    year:  "2026"
  },
  {
    id:    "design-manifesto-animation",
    cat:   "design",
    title: "Manifesto Animation",
    desc:  "Academic project, animated manifesto design.",
    img:   "images/design/ezgif.com-gif-maker.gif",
    size:  "normal",
    year:  "2026"
  },
  {
    id:    "design-greenmap-main",
    cat:   "design",
    title: "Greenmap Poster",
    desc:  "Academic project, main design layout.",
    img:   "images/design/greenmap.png",
    size:  "wide",
    year:  "2026"
  },
  {
    id:    "design-greenmap-animation",
    cat:   "design",
    title: "Greenmap Animation",
    desc:  "Academic project, animated map concept.",
    img:   "images/design/gif-greenmap.gif",
    size:  "normal",
    year:  "2026"
  },
  {
    id:    "design-greenmap-details",
    cat:   "design",
    title: "Greenmap Details",
    desc:  "Academic project, layout sheets detailing parts of the design.",
    img:   "images/design/greenmap1.png",
    size:  "tall",
    year:  "2026"
  },
  {
    id:    "design-greenmap-icon1",
    cat:   "design",
    title: "Greenmap Iconography I",
    desc:  "Academic project, custom icons designed for the project.",
    img:   "images/design/greenmap-icon.png",
    size:  "square",
    year:  "2026"
  },
  {
    id:    "design-greenmap-icon2",
    cat:   "design",
    title: "Greenmap Iconography II",
    desc:  "Academic project, icon design variants.",
    img:   "images/design/greenmap-icon2.png",
    size:  "square",
    year:  "2026"
  }

];
