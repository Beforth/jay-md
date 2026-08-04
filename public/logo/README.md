# /public/logo — Beforth brand assets (reserved)

Drop the official Beforth asset files into this folder. The site references
these exact paths (placeholder wordmark/B-mark components fall back to styled
text until the real files are present).

| File | Usage |
| --- | --- |
| `beforth-wordmark-navy.png` | Navbar wordmark (light background, desktop) |
| `beforth-wordmark-white.png` | Footer wordmark (dark background) |
| `beforth-mark-black.png` | Mobile navbar icon + favicon (`app/layout.tsx` metadata) |
| `beforth-mark-white.png` | Dark-background B-mark (reserved) |

Brand rules enforced by the components:

- **Never** add drop shadows, gradients, or effects to the logo.
- Use the full wordmark on light backgrounds (navy version) and white on dark/blue.
- The B-mark is used only where the wordmark can't fit (favicon, mobile navbar).
- The dot-grid texture never appears on dark/colored surfaces.
