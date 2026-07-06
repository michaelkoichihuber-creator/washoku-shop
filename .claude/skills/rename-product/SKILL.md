---
name: rename-product
description: Rename a freshly generated "ChatGPT Image ...png" product photo in public/products/ to its proper slug-based filename, fix the matching image reference in src/data/products.js, then commit and push. Use when the user says "/rename-product <product>" or asks to rename/commit/push a product image for washoku-shop.
user_invocable: true
---

# Rename Product Image

Takes one freshly generated `ChatGPT Image ....png` file sitting in `public/products/`, matches it to a product entry in `src/data/products.js`, renames it to that product's slug, fixes the `image` reference, and ships the change.

## Input

The argument is a product name or slug, e.g. `/rename-product ponzu citrus sauce` or `/rename-product ponzu-citrus-sauce`.

If no argument is given, ask which product the image belongs to — don't guess from a single unrenamed file alone, since the filename tells you nothing about content.

## Steps

### 1. Find the product entry

Search `src/data/products.js` for a product matching the argument by `name`, `slug`, or `tags`.

- No match: list the closest few product names and ask the user to pick.
- Multiple matches: show them and ask which one.
- Exactly one match: note its `slug` (e.g. `ponzu-citrus-sauce`) and its current `image` field. The target filename is **always `<slug>.png`**, regardless of what extension is currently in `image` — several entries were seeded with placeholder `.jpg` paths that don't match any real file.

### 2. Find the unrenamed image

```bash
ls -la public/products/
```

Look for untracked files matching `ChatGPT Image *.png`:

```bash
git status --short public/products/
```

- Zero candidates: tell the user no unrenamed ChatGPT image exists in `public/products/` yet — nothing to do.
- One candidate: use it, but still verify in step 3 before touching anything.
- Multiple candidates: don't guess by recency. View each with Read until one visually matches, or ask the user which file to use.

### 3. Visually verify before renaming

Read the candidate image file (Read tool renders it). Confirm the picture actually shows the requested product (packaging text, product shape, label) before renaming. If it doesn't match, say so and stop — check for a different candidate instead of forcing the match.

### 4. Rename

The file is untracked, so a plain rename is enough (no `git mv` needed):

```bash
mv "public/products/ChatGPT Image <timestamp>.png" "public/products/<slug>.png"
```

If `git status --short` shows the file as already tracked (unusual, but check), use `git mv` instead so the rename is recorded as a rename, not a delete+add.

### 5. Fix the reference in products.js

Edit the matched product's `image` field to `/products/<slug>.png`. This is a pure string replace on the `image:` line for that entry — don't touch other products' entries even if they have the same stale-extension issue; handle those in their own `/rename-product` run.

### 6. Stage only the two relevant paths

```bash
git status --short
git add "public/products/<slug>.png" "src/data/products.js"
```

Never `git add -A` here — other unrelated unrenamed `ChatGPT Image ...png` files for *future* products may be sitting untracked in the same folder, and unrelated edits may exist elsewhere in the tree.

### 7. Commit

Follow the established message pattern:

```
Add <Product Name> product image

Renamed the generated image to match the product image naming convention and fixed the product data reference (was pointing to a nonexistent .<old-ext>).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

If the `image` field already pointed at the right filename (no mismatch to fix), drop the second sentence of the body.

### 8. Push

```bash
git push
```

Report the renamed file, the commit hash, and confirm the push succeeded.

## Edge cases

- **Ambiguous product name**: ask, don't assume.
- **Image doesn't match product visually**: stop, report the mismatch, don't rename.
- **No unrenamed image**: say so, don't fabricate one or push a no-op commit.
- **`image` field already correct**: skip the products.js edit, just rename + commit + push the image.
- **Unrelated uncommitted changes elsewhere in the repo**: leave them alone — only stage the image and the one line in products.js.
- **Push rejected (remote ahead)**: don't force-push; report the conflict and ask how to proceed.
