import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { PAGES, expected } from '../scripts/inject-store-badges.mjs';

const { STORES, detectPlatform, renderBadges, renderForUserAgent } = createRequire(import.meta.url)('../assets/stores.js');
const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const UA = {
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  ipad: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  waIos: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 WhatsApp/24.10.80 Safari/604.1',
  waAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.0.0 Mobile Safari/537.36 WhatsApp/2.24.10.80',
  igAndroid: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.0.0 Mobile Safari/537.36 Instagram 330.0.0.35.108 Android (34/14; 420dpi; 1080x2400; Google/google; Pixel 8)',
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  safariMac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
};

test('detectPlatform', () => {
  assert.equal(detectPlatform(UA.iphone, 5), 'ios');
  assert.equal(detectPlatform(UA.ipad, 5), 'ios');
  assert.equal(detectPlatform(UA.android, 5), 'android');
  assert.equal(detectPlatform(UA.waIos, 5), 'ios');
  assert.equal(detectPlatform(UA.waAndroid, 5), 'android');
  assert.equal(detectPlatform(UA.igAndroid, 5), 'android');
  assert.equal(detectPlatform(UA.chrome, 0), 'desktop');
  assert.equal(detectPlatform(UA.safariMac, 0), 'desktop');
  assert.equal(detectPlatform(UA.safariMac, 1), 'desktop');
  assert.equal(detectPlatform(undefined, undefined), 'desktop');
});

const hrefs = (html) => [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
const only = (html, lang) => html.match(new RegExp(`<a [^>]*lang="${lang}"[^>]*>(?:<img[^>]*>)?[^<]*`, 'g')) || [];

test('constants: four store links, with country, none without', () => {
  assert.deepEqual([STORES.APP_STORE_URL.pt, STORES.APP_STORE_URL.en, STORES.PLAY_STORE_URL.pt, STORES.PLAY_STORE_URL.en], [
    'https://apps.apple.com/br/app/anotou/id6833691522',
    'https://apps.apple.com/us/app/anotou/id6833691522',
    'https://play.google.com/store/apps/details?id=dev.barrt.anotou&hl=pt_BR',
    'https://play.google.com/store/apps/details?id=dev.barrt.anotou&hl=en_US'
  ]);
});

test('desktop: both badges, App Store first, correct language badge and link', () => {
  const html = renderBadges('desktop');
  const pt = only(html, 'pt-BR'), en = only(html, 'en');
  assert.equal(pt.length, 2); assert.equal(en.length, 2);
  assert.match(pt[0], /apps\.apple\.com\/br\/.*app-store-pt-BR\.svg.*alt="Baixar na App Store"/s);
  assert.match(pt[1], /hl=pt_BR.*google-play-pt-BR\.svg.*alt="Disponível no Google Play"/s);
  assert.match(en[0], /apps\.apple\.com\/us\/.*app-store-en-US\.svg.*alt="Download on the App Store"/s);
  assert.match(en[1], /hl=en_US.*google-play-en-US\.svg.*alt="Get it on Google Play"/s);
  assert.ok(!/store-also/.test(html));
});

test('ios: only App Store badge + "Also on Google Play" text link', () => {
  const html = renderBadges('ios');
  assert.ok(!/google-play-/.test(html));
  assert.equal((html.match(/app-store-/g) || []).length, 2);
  assert.match(html, /lang="pt-BR" href="[^"]*hl=pt_BR[^>]*>Também no Google Play</);
  assert.match(html, /lang="en" href="[^"]*hl=en_US[^>]*>Also on Google Play</);
});

test('android: only Google Play badge + "Also on the App Store" text link', () => {
  const html = renderBadges('android');
  assert.ok(!/app-store-(pt|en)/.test(html));
  assert.equal((html.match(/google-play-/g) || []).length, 2);
  assert.match(html, /lang="pt-BR" href="https:\/\/apps\.apple\.com\/br\/[^>]*>Também na App Store</);
  assert.match(html, /lang="en" href="https:\/\/apps\.apple\.com\/us\/[^>]*>Also on the App Store</);
});

test('links open in new tab with rel=noopener; Play referrer is URL-encoded', () => {
  for (const p of ['desktop', 'ios', 'android']) {
    for (const a of renderBadges(p).match(/<a [^>]*>/g)) assert.match(a, /target="_blank" rel="noopener"/);
  }
  const h = hrefs(renderBadges('android', { playReferrer: 'invite=a b' }));
  assert.ok(h.filter((x) => x.includes('play.google')).every((x) => x.endsWith('&referrer=invite%3Da%20b')));
  assert.ok(h.filter((x) => x.includes('apple.com')).every((x) => !x.includes('referrer')));
});

test('no filter/opacity/shadow/border/animation/transform on badges (CSS and markup)', () => {
  const css = read('assets/styles.css');
  const rules = css.match(/\.store-(badge|badges|row)[^{]*\{[^}]*\}/g).join('\n');
  assert.ok(!/filter|opacity|shadow|border|animation|transition|transform|rotate|clip|overflow|object-fit/i.test(rules), rules);
  for (const p of ['desktop', 'ios', 'android']) assert.ok(!/style=|class="[^"]*(opacity|gray)/i.test(renderBadges(p)));
});

test('official badge files untouched in size and present; Google Play >= App Store height', () => {
  for (const f of ['app-store-pt-BR', 'app-store-en-US', 'google-play-pt-BR', 'google-play-en-US']) assert.ok(existsSync(new URL(`../badges/${f}.svg`, import.meta.url)));
  const css = read('assets/styles.css');
  assert.match(css, /--badge-h: 4[4-9]px|--badge-h: [5-9]\dpx/); // >= 40px min
  assert.ok(!/store-badge--play[^{]*\{[^}]*height/.test(css)); // same rule for both -> Play height == App Store height
});

test('pages: no "coming soon" store cards, initial HTML in sync, smart banner', () => {
  for (const p of PAGES) {
    const html = read(p.file);
    assert.ok(!/Em breve n[ao]|Coming soon to/i.test(html), p.file);
    assert.equal(expected(p, html), html, p.file + ' out of sync: run node scripts/inject-store-badges.mjs');
  }
  assert.match(read('index.html'), /<head>[\s\S]*<meta name="apple-itunes-app" content="app-id=6833691522">[\s\S]*<\/head>/);
  assert.ok(!/apps\.apple\.com|play\.google\.com/.test(read('index.html').replace(/<div class="store-badges"[\s\S]*?<!--\/store-badges-->/, '')));
});

test('end to end by userAgent (detection feeding the component)', () => {
  const has = (html, re) => re.test(html);
  for (const [ua, touch] of [[UA.iphone, 5], [UA.ipad, 5], [UA.waIos, 5]]) {
    const h = renderForUserAgent(ua, touch);
    assert.ok(has(h, /app-store-pt-BR/) && !has(h, /google-play-/) && has(h, /Também no Google Play/), ua);
  }
  for (const ua of [UA.android, UA.waAndroid, UA.igAndroid]) {
    const h = renderForUserAgent(ua, 5);
    assert.ok(has(h, /google-play-pt-BR/) && !has(h, /app-store-(pt|en)/) && has(h, /Também na App Store/), ua);
  }
  for (const [ua, touch] of [[UA.chrome, 0], [UA.safariMac, 0]]) {
    const h = renderForUserAgent(ua, touch);
    assert.ok(has(h, /app-store-pt-BR/) && has(h, /google-play-pt-BR/) && !has(h, /store-also/), ua);
  }
});
