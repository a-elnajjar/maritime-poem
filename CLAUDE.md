# Arabic Poetry Interactive Collection — CLAUDE.md

## Project Overview

A static multi-page website presenting interactive Arabic poetry with bilingual (Arabic/English) support, immersive visual effects, and RTL/LTR layout switching.

## Project Structure

```
Arabic-Poetry-Interactive-Collection/
├── shared/
│   ├── common.js      # Shared logic: cursor, stanza reveal, language toggle (localStorage-backed)
│   └── common.css     # Shared styles: layout, language visibility, fade transitions
├── maritime-poem/     # "القصيدة البحرية" — Nizar Qabbani (sea theme, ambient sound, falling light)
├── ThinkofOthers/     # "فكِّر بغيرك" — Mahmoud Darwish (aurora, doves, constellation)
├── notebook-poem/     # "سيدتي" — Nizar Qabbani (notebook aesthetic, word particles)
└── README.md
```

Each page folder contains: `index.html`, `script.js`, `style.css`.

## Architecture Rules

### Language Toggle
- **All language toggle logic lives in `shared/common.js`** — do NOT duplicate it in page scripts.
- Every `index.html` must load `../shared/common.js` **before** its own `script.js`.
- Language preference is persisted via `localStorage` key `preferredLang` (`'ar'` | `'en'`).
- Default language is Arabic (`lang-ar` body class, `dir="rtl"`).

### CSS Layering
- `shared/common.css` owns: `.lang-ar`/`.lang-en` visibility rules, `.switching` fade, global layout.
- Page-level `style.css` files may only add **page-specific** language overrides (e.g. per-element direction).
- Do NOT redeclare `body.lang-ar .en-content`, `body.lang-en .ar-content`, or `body.lang-en { direction }` in page CSS — these are already in `common.css`.

### Adding a New Page
1. Create `<page-name>/index.html`, `script.js`, `style.css`.
2. In `index.html`, include scripts in this order:
   ```html
   <script src="../shared/common.js" defer></script>
   <script src="script.js" defer></script>
   ```
3. Set `<body class="lang-ar">` as the initial state.
4. Use `ar-content` / `en-content` classes on all bilingual elements.

## Key Conventions

- **No frameworks** — vanilla HTML/CSS/JS only.
- **No build step** — open files directly in a browser or serve with any static server.
- Arabic text uses `'Reem Kufi'` or `'Noto Naskh Arabic'` Google Fonts; English uses `'Cormorant Garamond'`.
- Visual effects (canvas, cursor trails, particles) belong in the page's own `script.js`.
- Shared behaviours (cursor, stanza reveal, language toggle) belong in `shared/common.js`.

## Development

```bash
# Serve locally (Python)
python3 -m http.server 8080

# Serve locally (Node)
npx serve .
```

No tests, no linter, no package.json. Just open the browser.
