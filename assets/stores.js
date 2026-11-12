/*
 * Anotou? — store links and availability. THE single place to change them.
 * Flip the *_AVAILABLE flags to true when each store listing goes live.
 *
 * Loaded in <head> WITHOUT defer on pages that show store badges, so the iOS
 * Smart App Banner meta (invite page only) is in place before Safari reads it.
 *
 * Badges: any element with data-store="play" or data-store="appstore" gets its
 * content rendered here on DOMContentLoaded:
 *   - flag false: "coming soon" badge, no link (same as the static HTML, so
 *     pages look right even without JS);
 *   - flag true: linked badge. A page can override the link with
 *     data-store-href (the invite page uses it for the Play install referrer).
 */
(function () {
  'use strict';

  var STORES = {
    APP_STORE_ID: '6833691522',
    APP_STORE_URL: 'https://apps.apple.com/app/id6833691522',
    PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=dev.barrt.anotou',
    APP_STORE_AVAILABLE: false,
    PLAY_STORE_AVAILABLE: false
  };
  window.ANOTOU_STORES = STORES;

  // iOS Smart App Banner: only on pages that opt in (<html data-smart-banner>)
  // and only once the App Store listing is live.
  var root = document.documentElement;
  if (STORES.APP_STORE_AVAILABLE && root.hasAttribute('data-smart-banner')) {
    var meta = document.createElement('meta');
    meta.name = 'apple-itunes-app';
    meta.content = 'app-id=' + STORES.APP_STORE_ID + ', app-argument=' + window.location.href;
    document.head.appendChild(meta);
  }

  function L(pt, en) { return '<span lang="pt-BR">' + pt + '</span><span lang="en">' + en + '</span>'; }

  var COPY = {
    play: {
      name: 'Google Play',
      live: L('Disponível no', 'Get it on'),
      soon: L('Em breve no', 'Coming soon to')
    },
    appstore: {
      name: 'App Store',
      live: L('Baixar na', 'Download on the'),
      soon: L('Em breve na', 'Coming soon to the')
    }
  };

  function render() {
    var nodes = document.querySelectorAll('[data-store]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var store = el.getAttribute('data-store');
      var copy = COPY[store];
      if (!copy) continue;
      var available = store === 'play' ? STORES.PLAY_STORE_AVAILABLE : STORES.APP_STORE_AVAILABLE;
      var href = el.getAttribute('data-store-href') || (store === 'play' ? STORES.PLAY_STORE_URL : STORES.APP_STORE_URL);
      el.innerHTML = available
        ? '<a class="badge is-live" href="' + href.replace(/"/g, '&quot;') + '" rel="noopener noreferrer"><small>' +
          copy.live + '</small><strong>' + copy.name + '</strong></a>'
        : '<span class="badge"><small>' + copy.soon + '</small><strong>' + copy.name + '</strong></span>';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
