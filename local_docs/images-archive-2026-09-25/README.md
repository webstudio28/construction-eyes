# Image archive — 2026-09-25

Full-resolution originals before web optimization.

**Live site uses:** `src/assets/images/` (optimized WebP / resized logo)
**This folder is not served** — it sits outside `src/`, so Eleventy does not copy it to `_site`.

## What changed in the live set
- PNG backgrounds (`hero-bg`, `services-bg`) → WebP
- Photos resized (longest side ~1400–1800px) and re-encoded WebP q≈76–78
- Logo PNG resized to 480px wide
- Rough size: **15.5 MB → 3.8 MB** (~75% smaller)

To restore an original, copy from here back into `src/assets/images/` (matching path).
