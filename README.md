# ZeroByte.ID

Responsive community portal built with HTML, CSS and vanilla JavaScript. No build or package installation required.

## Run

From this directory: `python -m http.server 4173 --bind 127.0.0.1`, then open http://127.0.0.1:4173.

## Deployment

Upload `index.html`, `style.css`, `app.js`, and `assets/` to your static web host. This workspace does not deploy or modify zerobyte.id automatically.

## Design

- ASCII animation samples the original logo from https://zerobyte.id/img/zerobyteid-icon.png. Rotates the sampled glyph geometry around the Y axis with perspective.
- Reduced-motion support, hidden-tab suspension, 30 FPS cap, responsive canvas.
- Original blog and social URLs retained. No invented membership counts, events, or signup endpoints.
- Fonts use Google Fonts with local system fallbacks. All animation and interactions work without a framework.
- Inspired by the ASCII treatment of https://horizonx.so/explore/imago-ascii-login; implementation is original, no paid template source used.

Content and identity source: https://zerobyte.id/.
