# If you somehow found this repo, ignore it. This is just the boring stuff. 

# Portfolio Codebase Documentation for AI Agents

This document contains essential context and constraints for AI agents generating or modifying code for this portfolio site.

## Tech Stack & Architecture
- **Tech**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+).
- **Build Step**: None. This is a purely static site. No npm, no bundlers.
- **Data Source**: Gallery content is statically defined in `js/works.js` as an array of objects.
- **Layout**: Gallery uses CSS multi-column layout (`column-count`) for a masonry effect.
- **Theme**: Base theme is defined in `style.css` using CSS variables (`:root`), with dark mode overrides in a `@media (prefers-color-scheme: dark)` block.

## Directory Structure
- `/` - Root contains all HTML pages (`index.html`, `gallery-2d.html`, `gallery-3d.html`, `gallery-design.html`, `about.html`).
- `/css/style.css` - Single stylesheet for the entire site. All design tokens (colors, fonts, sizes, easings) are defined as CSS variables at the top of this file.
- `/js/works.js` - Contains the `WORKS` array (the data layer).
- `/js/main.js` - Contains the view layer logic (injecting DOM elements, filtering, lightbox functionality, scroll reveal).
- `/images/` - Subdirectories (`2d`, `3d`, `design`) for storing gallery assets.

## Data Structure (`js/works.js`)
The `WORKS` array populates the gallery. Each object must follow this schema:

| Property | Type   | Description |
|----------|--------|-------------|
| `id`     | String | Unique identifier (e.g., "2d-01"). Required. |
| `cat`    | String | Category enum: `"2d"` \| `"3d"` \| `"design"`. Required. |
| `title`  | String | Title shown on hover and in lightbox. Required. |
| `desc`   | String | Description shown in the lightbox. Optional. |
| `img`    | String | Path to the image relative to root (e.g., `"images/2d/art.jpg"`). Required. |
| `thumb`  | String | Path to a separate thumbnail image. Optional (falls back to `img`). |
| `size`   | String | Tile aspect ratio class enum: `"normal"` (default) \| `"tall"` \| `"wide"` \| `"square"`. Optional. |
| `year`   | String | Year of creation shown on hover and in lightbox. Optional. |

## Coding Guidelines for Agents
1. **No Frameworks**: Do not introduce React, Vue, Tailwind, or any other frameworks/libraries unless explicitly requested by the user. Keep it Vanilla.
2. **Vanilla DOM API**: Use vanilla `document.querySelector`, `document.createElement`, etc., in `main.js`.
3. **CSS Architecture**: Maintain the existing class naming conventions. Use existing CSS variables for any new styles (e.g., `var(--ink)`, `var(--accent)`, `var(--paper)`). Do not hardcode colors if a suitable variable exists.
4. **Responsive Design**: Ensure any new UI components are responsive using standard CSS techniques.
5. **Accessibility**: Keep semantic HTML tags and ARIA attributes (e.g., `aria-hidden`, `aria-label`) intact and add them to new interactive elements.
