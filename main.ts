// World News — Tuesday 24 November 2026 (Node 22, standard library only):
// the entry image is the entry.png beside this file, and the program copies
// it to /output/entry.png. The gate takes a whole PNG or JPEG of at most
// 1 MiB and 1024 by 1024 pixels, and the judge sees exactly the bytes copied.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// The entry must be a whole PNG of at most 1 MiB: check its signature and
// size before copying, so a broken or oversized file fails loudly instead
// of being submitted. A JPEG would start with FF D8 FF; this entry is PNG.
const source = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(source);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error('entry.png is not a PNG file (bad signature)');
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}
if (statSync(source).size !== bytes.length) {
  throw new Error('entry.png changed while being read');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'entry.png'));
