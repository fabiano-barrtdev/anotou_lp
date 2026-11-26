// Writes the "both badges" initial HTML into every page's <div data-store-badges>.
// Usage: node scripts/inject-store-badges.mjs [--check]
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { renderBadges } = createRequire(import.meta.url)('../assets/stores.js');

export const PAGES = [
  { file: 'index.html', base: '', referrer: '' },
  { file: 'invite/index.html', base: '/', referrer: '' }
];
const RE = /(<div class="store-badges"[^>]*data-store-badges[^>]*>)[\s\S]*?(<\/div><!--\/store-badges-->)/;

export function expected(page, html) {
  return html.replace(RE, (_, open, close) => open + renderBadges('desktop', { base: page.base }) + close);
}

if (process.argv[1].endsWith('inject-store-badges.mjs')) {
  const check = process.argv.includes('--check');
  let bad = 0;
  for (const p of PAGES) {
    const cur = readFileSync(new URL('../' + p.file, import.meta.url), 'utf8');
    const next = expected(p, cur);
    if (cur !== next) { bad++; if (!check) writeFileSync(new URL('../' + p.file, import.meta.url), next); }
  }
  if (check && bad) { console.error('store badges out of sync; run node scripts/inject-store-badges.mjs'); process.exit(1); }
}
