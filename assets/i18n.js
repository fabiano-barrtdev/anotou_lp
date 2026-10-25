/*
 * Anotou? — alternância de idioma (PT/EN).
 * Carregado no <head>, sem defer, para aplicar o idioma antes da página
 * aparecer (sem "piscar" o idioma errado). Sem dependências, sem cookies.
 *
 * Ordem de escolha: ?lang=pt|en na URL > escolha salva > navigator.language
 * (pt* = português, qualquer outro = inglês).
 */
(function () {
  'use strict';

  var KEY = 'anotou-lang';
  var root = document.documentElement;

  function norm(v) {
    if (!v) return null;
    v = String(v).toLowerCase();
    if (v.indexOf('pt') === 0) return 'pt';
    if (v.indexOf('en') === 0) return 'en';
    return null;
  }

  function readUrl() {
    var m = /[?&]lang=([^&#]*)/i.exec(window.location.search);
    return m ? norm(decodeURIComponent(m[1])) : null;
  }

  function readStored() {
    try { return norm(window.localStorage.getItem(KEY)); } catch (e) { return null; }
  }

  function store(l) {
    try { window.localStorage.setItem(KEY, l); } catch (e) { /* modo privado etc. */ }
  }

  function detect() {
    return /^pt/i.test(navigator.language || '') ? 'pt' : 'en';
  }

  function setMeta(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.setAttribute('content', value);
  }

  var fromUrl = readUrl();
  var lang = fromUrl || readStored() || detect();
  if (fromUrl) store(fromUrl);

  // Atributos que não dá para alternar com CSS (alt, aria-label).
  function syncDom() {
    var nodes = document.querySelectorAll('[data-alt-pt],[data-label-pt]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var alt = n.getAttribute('data-alt-' + lang);
      if (alt !== null) n.setAttribute('alt', alt);
      var label = n.getAttribute('data-label-' + lang);
      if (label !== null) n.setAttribute('aria-label', label);
    }
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].setAttribute('aria-pressed', buttons[j].getAttribute('data-set-lang') === lang ? 'true' : 'false');
    }
  }

  function apply(l) {
    lang = l;
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'pt' ? 'pt-BR' : 'en-US');
    var title = root.getAttribute('data-title-' + l);
    if (title) document.title = title;
    var desc = root.getAttribute('data-desc-' + l);
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[name="twitter:description"]', desc);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[property="og:locale"]', l === 'pt' ? 'pt_BR' : 'en_US');
    if (document.body) syncDom();
  }

  apply(lang);

  // Imagens ainda não colocadas: mostra o espaço reservado com o nome do arquivo.
  function markMissing(img) {
    var holder = img.closest ? img.closest('[data-ph]') : null;
    if (holder) holder.classList.add('is-missing');
  }
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG') markMissing(t);
  }, true);

  document.addEventListener('DOMContentLoaded', function () {
    syncDom();

    var imgs = document.querySelectorAll('[data-ph] img');
    for (var k = 0; k < imgs.length; k++) {
      if (imgs[k].complete && imgs[k].naturalWidth === 0) markMissing(imgs[k]);
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-set-lang]') : null;
      if (!btn) return;
      var next = norm(btn.getAttribute('data-set-lang'));
      if (!next || next === lang) return;
      apply(next);
      store(next);
      // Se a URL trouxe ?lang=, atualiza para não voltar ao idioma antigo ao recarregar.
      if (readUrl() && window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        window.history.replaceState(null, '', url.toString());
      }
    });
  });
})();
