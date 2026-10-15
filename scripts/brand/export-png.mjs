/**
 * The raster copies of the logo, from the SVGs in public/brand (run after build.py):
 *   node scripts/brand/export-png.mjs
 * icon 192/512 (transparent) for the manifest, apple-icon 180 on ivory, favicon.ico
 * (16/32/48), and the 1200×630 share image.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const brand = (f) => join(root, 'public/brand', f);
const IVORY = '#FBF7EF';
const icon = readFileSync(brand('logo-icon.svg'));
const full = readFileSync(brand('logo-full.svg'));

const png = (svg, size, bg) =>
  sharp(svg, { density: 600 })
    .resize(size, size, { fit: 'contain', background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

writeFileSync(brand('icon-192.png'), await png(icon, 192));
writeFileSync(brand('icon-512.png'), await png(icon, 512));
writeFileSync(join(root, 'src/app/apple-icon.png'), await png(icon, 180, IVORY));

// favicon.ico: an ICO container holding PNG images (every browser since IE11 reads these).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(icon, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync(join(root, 'src/app/favicon.ico'), Buffer.concat([header, ...images]));

// The share image: ivory with a dune band, the full logo left, the words right.
const W = 1200, H = 630;
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE6B0"/><stop offset="1" stop-color="${IVORY}"/></linearGradient>
  <linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7C65A"/><stop offset="1" stop-color="#F3D9A4"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#s)"/>
  <path fill="#E8A93A" opacity=".55" d="M0 520 C 220 450 420 450 640 500 C 860 550 1020 520 1200 470 L1200 630 L0 630 Z"/>
  <path fill="url(#d)" d="M0 570 C 240 520 460 520 700 560 C 920 596 1060 580 1200 545 L1200 630 L0 630 Z"/>
  <text x="640" y="250" font-family="Georgia, serif" font-size="46" fill="#8E1B1B">Rajasthan tours</text>
  <text x="640" y="315" font-family="Georgia, serif" font-size="46" fill="#1E3A7B">Cab with driver</text>
  <rect x="640" y="350" width="220" height="3" fill="#E0A93B"/>
  <text x="640" y="400" font-family="Georgia, serif" font-size="30" fill="#1B1B1F">Jaipur · Udaipur · Jodhpur · Jaisalmer</text>
</svg>`);
const logo = await sharp(full, { density: 400 }).resize({ height: 540 }).png().toBuffer();
const meta = await sharp(logo).metadata();
await sharp(bg)
  .composite([{ input: logo, left: Math.round(320 - meta.width / 2), top: 45 }])
  .png({ compressionLevel: 9 })
  .toFile(join(root, 'src/app/opengraph-image.png'));

console.log('brand PNGs written');
