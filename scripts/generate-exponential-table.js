#!/usr/bin/env node
/**
 * Generate (or overwrite) a Markdown file that shows powers of `base`
 * up to `limit`, in a tidy table.  Intended to run in CI, but you can
 * run it locally too:
 *
 *   node scripts/generate-exponential-table.js \
 *        --file docs/exponential-growth.md --base 3 --limit 12
 *
 * All CLI flags are optional; sensible defaults are provided.
 *
 * K – May 2025
 */

const fs = require('fs');
const path = require('path');

// ─── Simple flag parsing without deps ──────────────────────────────────────────
const flags = {};
process.argv.slice(2).forEach((arg, i, arr) => {
  if (!arg.startsWith('--')) return;
  const key = arg.slice(2);
  const val = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true;
  flags[key] = val;
});

const targetFile = flags.file  || 'docs/exponential-growth.md';
const base       = +flags.base || 2;
const limit      = +flags.limit || 10;
const heading    = flags.heading || '# Exponential Growth';

const rows = [`| n | ${base}<sup>n</sup> |`, '|---|---|'];
for (let n = 0; n <= limit; n++) {
  rows.push(`| ${n} | ${base ** n} |`);
}

const content = `${heading}

${rows.join('\n')}\n`;

// Ensure parent dir exists (useful for fresh clones)
fs.mkdirSync(path.dirname(targetFile), { recursive: true });
fs.writeFileSync(targetFile, content);

console.log(`✅  Wrote ${path.relative(process.cwd(), targetFile)}`);