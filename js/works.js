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
    id:    "2d-01",
    cat:   "2d",
    title: "Halcyon Blades",
    desc:  "A series of high-fantasy weapon designs, each with its own mythology and visual language.",
    img:   "images/2d/2d-01.jpg",
    size:  "wide",
    year:  "2024"
  },
  {
    id:    "2d-02",
    cat:   "2d",
    title: "Creature Study 741",
    desc:  "Specimens from an unnamed reality. Ink and digital.",
    img:   "images/2d/2d-02.jpg",
    size:  "tall",
    year:  "2024"
  },
  {
    id:    "2d-03",
    cat:   "2d",
    title: "Character Development",
    desc:  "Loose sketches exploring adventurer archetypes for an unrealised fantasy project.",
    img:   "images/2d/2d-03.jpg",
    size:  "normal",
    year:  "2023"
  },
  {
    id:    "2d-04",
    cat:   "2d",
    title: "Robot Warm-ups",
    desc:  "Morning sketch routine. Ten minutes each, no corrections.",
    img:   "images/2d/2d-04.jpg",
    size:  "square",
    year:  "2023"
  },
  {
    id:    "2d-05",
    cat:   "2d",
    title: "Lullaby",
    desc:  "A personal piece about quiet and memory.",
    img:   "images/2d/2d-05.jpg",
    size:  "normal",
    year:  "2023"
  },
  {
    id:    "2d-06",
    cat:   "2d",
    title: "Dino Studies",
    desc:  "Distinctly-coloured dinosaurs and their strange relationship with birds.",
    img:   "images/2d/2d-06.jpg",
    size:  "normal",
    year:  "2022"
  },

  /* ── 3D ── */
  {
    id:    "3d-01",
    cat:   "3d",
    title: "Portrait Sketches",
    desc:  "Blender sculpts exploring expressive portraiture. Goal was comfort with digital clay, not polish.",
    img:   "images/3d/3d-01.jpg",
    size:  "wide",
    year:  "2024"
  },
  {
    id:    "3d-02",
    cat:   "3d",
    title: "Light Shapers",
    desc:  "A study of light, shape, and shadow using procedural geometry.",
    img:   "images/3d/3d-02.jpg",
    size:  "tall",
    year:  "2024"
  },
  {
    id:    "3d-03",
    cat:   "3d",
    title: "Nuclear Landscape",
    desc:  "Environmental render for the Nuclear Maw world — a post-collapse racing territory.",
    img:   "images/3d/3d-03.jpg",
    size:  "normal",
    year:  "2023"
  },
  {
    id:    "3d-04",
    cat:   "3d",
    title: "Creature Prop",
    desc:  "3D proxy model built to support sculptors during production.",
    img:   "images/3d/3d-04.jpg",
    size:  "square",
    year:  "2023"
  },
  {
    id:    "3d-05",
    cat:   "3d",
    title: "Barrow Downs",
    desc:  "Environmental study for an untitled Lord of the Rings game project.",
    img:   "images/3d/3d-05.jpg",
    size:  "normal",
    year:  "2022"
  },

  /* ── DESIGN ── */
  {
    id:    "design-01",
    cat:   "design",
    title: "Aegis of Champions",
    desc:  "Design process and final product for a living tournament trophy — forged from bronze, silver, and leather.",
    img:   "images/design/de-01.jpg",
    size:  "wide",
    year:  "2024"
  },
  {
    id:    "design-02",
    cat:   "design",
    title: "Item Icon System",
    desc:  "In-game item icons built for immediate readability — colour, shape, and type as a visual language.",
    img:   "images/design/de-02.jpg",
    size:  "square",
    year:  "2023"
  },
  {
    id:    "design-03",
    cat:   "design",
    title: "Update Pages",
    desc:  "Key art and header illustrations for game update pages, 2009–2015.",
    img:   "images/design/de-03.jpg",
    size:  "tall",
    year:  "2023"
  },
  {
    id:    "design-04",
    cat:   "design",
    title: "Graphic T-Shirts",
    desc:  "Graphic illustrations used for exclusive merchandise drops.",
    img:   "images/design/de-04.jpg",
    size:  "normal",
    year:  "2022"
  },
  {
    id:    "design-05",
    cat:   "design",
    title: "Brand System",
    desc:  "A cohesive visual identity project including typography, colour, and mark.",
    img:   "images/design/de-05.jpg",
    size:  "normal",
    year:  "2022"
  }

];
