/*
 * Anotou? — invite fallback page (/invite/, served by a Cloudflare Worker at /l/<token>).
 * Shown only to people who don't have the app installed.
 * The token is read from the URL and used ONLY to build the Google Play install referrer.
 * It is never sent to analytics, to our backend or to any other service, and never shown.
 */
(function () {
  'use strict';

  // Store URLs, platform detection and the badges live in /assets/stores.js.

  // /l/<token> (optional trailing slash). Anything else, including /invite/, is the generic version.
  function readToken() {
    var m = /^\/l\/([^\/?#]+)\/?$/.exec(window.location.pathname);
    if (!m) return null;
    var token;
    try { token = decodeURIComponent(m[1]); } catch (e) { return null; }
    // Accept only URL-safe token characters; anything odd falls back to the generic version.
    return /^[A-Za-z0-9._~-]{1,512}$/.test(token) ? token : null;
  }

  function show(sel, on) {
    var nodes = document.querySelectorAll(sel);
    for (var i = 0; i < nodes.length; i++) nodes[i].hidden = !on;
  }

  var token = readToken();
  var ios = window.ANOTOU_STORES_API && window.ANOTOU_STORES_API.detectPlatform(navigator.userAgent, navigator.maxTouchPoints) === 'ios';

  show('[data-invite="with-token"]', !!token);
  show('[data-invite="generic"]', !token);
  show('[data-invite="ios-tip"]', ios);

  // Google Play: with a token, pass it as the install referrer ("invite=<token>").
  // stores.js appends it (URL-encoded) to the Play links when it renders the badges.
  var badges = document.querySelector('[data-store-badges]');
  if (badges && token) badges.setAttribute('data-play-referrer', 'invite=' + token);
})();
