# /public/logo — Beforth brand assets

Official Beforth assets, sourced from the brand guidelines at
<https://brand.beforth.in> (wordmarks = "Full Size logo" black/white lockups,
marks = `assets/beforth-mark-black/white.png`). The site references these
exact paths; if a file is ever absent, the components fall back to styled text.

| File | Usage |
| --- | --- |
| `beforth-wordmark-navy.png` | Navbar wordmark (light background, desktop) |
| `beforth-wordmark-white.png` | Footer wordmark (dark background) |
| `beforth-mark-black.png` | Mobile navbar icon + favicon (`app/layout.tsx` metadata) |
| `beforth-mark-white.png` | Dark-background B-mark |

Brand rules enforced by the components:

- **Never** add drop shadows, gradients, or effects to the logo.
- Use the full wordmark on light backgrounds (navy version) and white on dark/blue.
- The B-mark is used only where the wordmark can't fit (favicon, mobile navbar).
- The dot-grid texture never appears on dark/colored surfaces.
