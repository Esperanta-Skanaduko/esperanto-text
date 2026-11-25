#!/usr/bin/env node
/**
 * Bundles the library into site/esperanto-text.js so the demo page works from
 * any static host without npm. Run after changing src/.
 */
import { build } from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
await build({
  entryPoints: [join(root, 'scripts', 'site-entry.ts')],
  outfile: join(root, 'site', 'esperanto-text.js'),
  bundle: true,
  format: 'esm',
  minify: true,
  target: 'es2022',
  legalComments: 'none',
});
console.log('site/esperanto-text.js written');
