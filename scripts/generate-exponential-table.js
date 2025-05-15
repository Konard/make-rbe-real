#!/usr/bin/env node
/**
 * Generate (or overwrite) a Markdown file that shows how petition
 * signatures can double daily, starting from an initial count and
 * capped at the current world-population limit.
 *
 *   node scripts/generate-exponential-table.js --initial 41
 *
 * Only one CLI flag is accepted:
 *   --initial   Starting number of signatures (default = 41)
 *
 * K – May 2025
 */

const fs   = require('fs');
const path = require('path');

// ─── Parse CLI flags (no deps) ────────────────────────────────────────────────
const flags = {};
process.argv.slice(2).forEach((arg, i, arr) => {
  if (!arg.startsWith('--')) return;
  const key = arg.slice(2);
  const val = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true;
  flags[key] = val;
});

// ─── Constants ───────────────────────────────────────────────────────────────
const TARGET_FILE = 'docs/people-reach-growth.md';
const HEADING     = '# People Reach Growth';
const DOUBLINGS   = 30;                 // ≈ one month of daily doubling
const POP_LIMIT   = 8_223_141_035;     // world population (May 2025)
const BASE        = 2;

const initial = +flags.initial || 41;  // starting signatures

// ─── Build the markdown table ────────────────────────────────────────────────
const rows = [
  '| Day | Signatures |',
  '|----:|-----------:|',
];

for (let d = 0; d <= DOUBLINGS; d++) {
  let value = initial * BASE ** d;
  if (value >= POP_LIMIT) {
    rows.push(`| ${d} | ${POP_LIMIT} *(population limit)* |`);
    break;                          // further rows would not change
  }
  rows.push(`| ${d} | ${value} |`);
}

const content = `${HEADING}

${rows.join('\n')}\n`;

// ─── Write the file ──────────────────────────────────────────────────────────
fs.mkdirSync(path.dirname(TARGET_FILE), { recursive: true });
fs.writeFileSync(TARGET_FILE, content);

console.log(`✅  Wrote ${path.relative(process.cwd(), TARGET_FILE)}`);