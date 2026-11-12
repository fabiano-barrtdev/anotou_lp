/*
 * Anotou? — invite fallback page (/invite/, served by a Cloudflare Worker at /l/<token>).
 * Shown only to people who don't have the app installed.
 * The token is read from the URL and used ONLY to build the Google Play install referrer.
 * It is never sent to analytics, to our backend or to any other service, and never shown.
 */
(function () {
  'use strict';

  // Store URLs and availability live in /assets/stores.js (window.ANOTOU_STORES),
  // which also renders the badges and the iOS Smart App Banner.
  var STORES = window.ANOTOU_STORES || {};

  // /l/<token> (optional trailing slash). Anything else, including /invite/, is the generic version.
  function readToken() {
    var m = /^\/l\/([^\/?#]+)\/?$/.exec(window.location.pathname);
    if (!m) return null;
    var token;
    try { token = decodeURIComponent(m[1]); } catch (e) { return null; }
    // Accept only URL-safe token characters; anything odd falls back to the generic version.
    return /^[A-Za-z0-9._~-]{1,512}$/.test(token) ? token : null;
  }

  function isIOS() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return true;
    // iPadOS reports itself as a Mac; tell them apart by touch support.
    return /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  }

  function show(sel, on) {
    var nodes = document.querySelectorAll(sel);
    for (var i = 0; i < nodes.length; i++) nodes[i].hidden = !on;
  }

  var token = readToken();
  var ios = isIOS();

  show('[data-invite="with-token"]', !!token);
  show('[data-invite="generic"]', !token);
  show('[data-invite="ios-tip"]', ios);

  // Google Play: with a token, pass it as the install referrer ("invite=<token>", URL-encoded).
  // stores.js uses data-store-href when it renders the badge (only if PLAY_STORE_AVAILABLE).
  var playItem = document.querySelector('[data-store="play"]');
  if (playItem && token && STORES.PLAY_STORE_URL) {
    playItem.setAttribute('data-store-href',
      STORES.PLAY_STORE_URL + '&referrer=' + encodeURIComponent('invite=' + token));
  }

  var appItem = document.querySelector('[data-store="appstore"]');

  // On iPhone/iPad, list the App Store first.
  if (ios && appItem && appItem.parentNode) appItem.parentNode.insertBefore(appItem, appItem.parentNode.firstChild);
})();
