# Code Review Triage — 2026-07-06

Review scope: the session that renamed 11 ChatGPT-exported product photos into
`public/products/`, fixed their `image:` references in `src/data/products.js`,
and added the `.claude/skills/rename-product/SKILL.md` skill.

## Fixed

### 1. Product image cropping bug
- **Finding**: `ProductImage.css` forced every product photo into a 1:1 square
  (`aspect-ratio: 1` + `object-fit: cover`), but the photos are non-square
  (~4:5 portrait or ~5:4 landscape). Center-cropping cut off content some
  images place near the top/bottom edges (spec tables, feature-icon rows,
  "MADE IN JAPAN" stamps).
- **Reason fixed**: real, user-facing defect on the live product grid, cart,
  and detail views.
- **Fix**: changed `.product-image__img` from `object-fit: cover` to
  `object-fit: contain` in `src/components/ProductImage.css`. The container
  already has a neutral `background-color: #f3efe8`, so letterboxed images
  show a clean neutral backdrop instead of a hard crop.

### 2. Unoptimized images
- **Finding**: the new PNGs were ~2.0-2.5MB each (~34MB total across all 16
  product photos), shipped verbatim with no resizing/compression step
  anywhere in the build.
- **Reason fixed**: real performance cost — full-resolution, poorly-compressed
  PNGs downloaded on every product page/cart view.
- **Fix**: added `scripts/optimize-images.js` (uses `sharp`, new devDependency)
  and an `npm run optimize:images` script. It caps dimensions at 1400px on the
  long side and re-encodes as PNG with palette-based quantization
  (`compressionLevel: 9, effort: 10, palette: true, quality: 90`). Ran once
  against all 16 files in `public/products/`: **34.3MB → 10.7MB** (~66-76%
  smaller per file), with no visible quality loss on spot-check (compared
  rendered output before/after — text stayed crisp, no visible banding on
  gradients). Kept the `.png` extension so no reference changes were needed
  and the `/rename-product` skill's `.png` assumption still holds.
  Re-run `npm run optimize:images` after adding new product photos.

## Skipped

### 3. Whole-file `git add` in SKILL.md
- **Finding**: step 6 of `.claude/skills/rename-product/SKILL.md` runs
  `git add "src/data/products.js"`, which stages the entire file's working
  diff, not just the one edited line — could sweep in an unrelated
  uncommitted edit sitting in the same file.
- **Reason skipped**: low-risk internal workflow tooling, not part of the
  customer-facing app; the skill already tells the operator to run
  `git status --short` first, which surfaces unrelated changes for a human
  to notice before staging.

### 4. Rename overwrite edge case in SKILL.md
- **Finding**: step 4's `mv` has no check for a pre-existing destination file,
  so re-running the skill on a product whose image already exists silently
  overwrites it.
- **Reason skipped**: low severity and unlikely in normal use — the skill's
  step 3 visual-verification gate is the intended safeguard, and the file
  lives in git history if a bad overwrite ever needs recovering.
