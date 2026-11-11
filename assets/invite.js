/*
 * Anotou? — invite fallback page (/invite/, served by a Cloudflare Worker at /l/<token>).
 * Shown only to people who don't have the app installed.
 * The token is read from the URL and used ONLY to build the Google Play install referrer.
 * It is never sent to analytics, to our backend or to any other service, and never shown.
 */
(function () {
  'use strict';

  // Store links. Fill APP_STORE_URL once the App Store ID exists
  // (e.g. 'https://apps.apple.com/app/id0000000000'); while empty, the badge shows "coming soon".
  var PLAY_URL = 'https://play.google.com/store/apps/details?id=dev.barrt.anotou';
  var APP_STORE_URL = '';

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
  var play = document.querySelector('[data-store="play"] a');
  if (play) {
    play.href = token ? PLAY_URL + '&referrer=' + encodeURIComponent('invite=' + token) : PLAY_URL;
  }

  // App Store: a live link once APP_STORE_URL is set; "coming soon" until then.
  var appItem = document.querySelector('[data-store="appstore"]');
  if (appItem && APP_STORE_URL) {
    appItem.innerHTML =
      '<a class="badge is-live" href="' + APP_STORE_URL + '" rel="noopener noreferrer">' +
      '<small><span lang="pt-BR">Baixar na</span><span lang="en">Download on the</span></small>' +
      '<strong>App Store</strong></a>';
  }

  // On iPhone/iPad, list the App Store first.
  if (ios && appItem && appItem.parentNode) appItem.parentNode.insertBefore(appItem, appItem.parentNode.firstChild);
})();
