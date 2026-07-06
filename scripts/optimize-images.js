#!/usr/bin/env node
// Re-compresses public/products/*.png in place with lossless PNG optimization
// (ChatGPT image exports ship uncompressed and run 2-2.5MB each). Also caps
// dimensions at MAX_DIMENSION so future oversized exports don't slip through.
import { readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const PRODUCTS_DIR = join(import.meta.dirname, '..', 'public', 'products')
const MAX_DIMENSION = 1400

async function optimize(file) {
  const path = join(PRODUCTS_DIR, file)
  const before = (await stat(path)).size

  const buffer = await sharp(path)
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, effort: 10, palette: true, quality: 90 })
    .toBuffer()

  await writeFile(path, buffer)
  return { file, before, after: buffer.length }
}

const files = (await readdir(PRODUCTS_DIR)).filter((f) => f.endsWith('.png'))

let totalBefore = 0
let totalAfter = 0

for (const file of files) {
  const { before, after } = await optimize(file)
  totalBefore += before
  totalAfter += after
  const pct = (100 * (1 - after / before)).toFixed(0)
  console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${pct}%)`)
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
)
