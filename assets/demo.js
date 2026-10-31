/*
 * Anotou? — app screens drawn in HTML for the landing page.
 * - #demo: interactive demo (list → activity → home) with sample data.
 * - [data-mock="home"|"activity"|"list"]: the same screens, static, in the Features section.
 * Mirrors the look of the real app screens. No dependencies; nothing is sent anywhere.
 * Copy uses <span lang>, like the rest of the site, so the i18n.js PT/EN switch applies here too.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function L(pt, en) { return pt === en ? pt : '<span lang="pt-BR">' + pt + '</span><span lang="en">' + en + '</span>'; }
  function money(n) { var s = n.toFixed(2); return L('R$ ' + s.replace('.', ','), 'R$' + s); }
  function hhmm(t) { var d = new Date(t); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  var P = 'viewBox="0 0 24 24" aria-hidden="true"';
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var IC = {
    back: '<svg ' + S + '><path d="m15 18-6-6 6-6"/></svg>',
    search: '<svg ' + P + '><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
    bell: '<svg ' + P + '><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',
    more: '<svg ' + P + '><path fill="currentColor" d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
    share: '<svg ' + S + '><path d="M12 15V3"/><path d="m8 7 4-4 4 4"/><path d="M8 10H6v11h12V10h-2"/></svg>',
    cart: '<svg ' + P + '><path fill="currentColor" d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 2v2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 7 17h12v-2H7.42a.25.25 0 0 1-.22-.37l.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
    grill: '<svg ' + S + '><path d="M4 10h16a8 8 0 0 1-16 0z"/><path d="M9 17.5 6.5 22M15 17.5 17.5 22M12 18v4"/><path d="M9 3c-.8.9-.8 2.1 0 3M12 3c-.8.9-.8 2.1 0 3M15 3c-.8.9-.8 2.1 0 3"/></svg>',
    plus: '<svg ' + S + ' stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>',
    scan: '<svg ' + S + '><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M8 8v8M11 8v8M14 8v8M17 8v8" stroke-width="1.6"/></svg>',
    mic: '<svg ' + P + '><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg>',
    assign: '<svg ' + S + '><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M19 8v6M16 11h6"/></svg>',
    check: '<svg ' + S + ' stroke-width="3"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    doneAll: '<svg ' + S + '><path d="m2 13 5 5M7 18 18 7M12 18 23 7"/></svg>',
    clock: '<svg ' + S + '><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    warn: '<svg ' + P + '><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    archive: '<svg ' + S + '><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M12 12v5M9.5 14.5 12 17l2.5-2.5"/></svg>',
    chevDown: '<svg ' + S + '><path d="m6 9 6 6 6-6"/></svg>',
    lists: '<svg ' + S + '><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M8 9h1M11 9h5M8 12h1M11 12h5M8 15h1M11 15h5"/></svg>',
    person: '<svg ' + S + '><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>',
    signal: '<svg viewBox="0 0 34 12" aria-hidden="true"><g fill="currentColor"><rect x="0" y="5" width="6" height="6" rx="1" opacity=".35"/><rect x="9" y="5" width="6" height="6" rx="1" opacity=".35"/><rect x="18" y="5" width="6" height="6" rx="1" opacity=".35"/><rect x="27" y="5" width="6" height="6" rx="1" opacity=".35"/></g></svg>',
    wifi: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 20.5 8.6 16.9a4.8 4.8 0 0 1 6.8 0L12 20.5zM5.8 14a8.8 8.8 0 0 1 12.4 0l-1.6 1.6a6.6 6.6 0 0 0-9.2 0L5.8 14zM3 11.2a12.8 12.8 0 0 1 18 0l-1.6 1.6a10.5 10.5 0 0 0-14.8 0L3 11.2z"/></svg>',
    battery: '<svg viewBox="0 0 28 14" aria-hidden="true"><rect x="0.5" y="0.5" width="24" height="13" rx="4" fill="currentColor"/><rect x="25.5" y="4.5" width="2" height="5" rx="1" fill="currentColor"/></svg>'
  };

  /* ---------- sample data ---------- */
  var PEOPLE = { me: 'Bruno', ana: 'Ana', diego: 'Diego' };
  function av(p, cls) { return '<span class="av' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + PEOPLE[p].charAt(0) + '</span>'; }

  var CATS = [
    { id: 'drinks', emoji: '🥤', pt: 'Bebidas', en: 'Drinks' },
    { id: 'meat', emoji: '🥩', pt: 'Carnes', en: 'Meat' },
    { id: 'other', emoji: '📦', pt: 'Outros itens', en: 'Other items' }
  ];
  function freshItems() {
    return [
      { id: 'beer', cat: 'drinks', pt: 'Cerveja', en: 'Beer', q: ['2 pct', '2 packs'], price: 59.8 },
      { id: 'soda', cat: 'drinks', pt: 'Refrigerante 2 L', en: 'Soda 2 L', q: ['3 un', '3 units'], price: 26.97 },
      { id: 'picanha', cat: 'meat', pt: 'Picanha', en: 'Picanha', q: ['1,2 kg', '1.2 kg'], price: 89.9 },
      { id: 'sausage', cat: 'meat', pt: 'Linguiça', en: 'Sausage', q: ['1 kg', '1 kg'], price: 32.5 },
      { id: 'charcoal', cat: 'other', pt: 'Carvão', en: 'Charcoal', q: ['2 pct', '2 packs'], price: 24.9 },
      { id: 'garlic-bread', cat: 'other', pt: 'Pão de alho', en: 'Garlic bread', q: ['2 pct', '2 packs'], price: 15.8 }
    ].map(function (it) { it.by = null; it.at = 0; return it; });
  }
  function freshActivity() {
    var now = Date.now(), day = 86400000;
    return [
      { who: 'ana', kind: 'added', t: now - 35 * 60000 },
      { who: 'me', kind: 'added', t: now - 52 * 60000 },
      { who: 'diego', kind: 'added', t: now - day - 2 * 3600000 },
      { who: 'ana', kind: 'added', t: now - day - 3 * 3600000 }
    ];
  }
  function newState() { return { screen: 'list', items: freshItems(), activity: freshActivity() }; }

  function find(st, id) { for (var i = 0; i < st.items.length; i++) if (st.items[i].id === id) return st.items[i]; return null; }
  function stats(st) {
    var n = 0, est = 0, spent = 0;
    st.items.forEach(function (it) { est += it.price; if (it.by) { n++; spent += it.price; } });
    return { n: n, total: st.items.length, est: est, spent: spent, pct: Math.round(n / st.items.length * 100) };
  }
  function unread(st) { return st.activity.some(function (a) { return a.unread; }); }

  /* ---------- screens ---------- */
  function statusBar() {
    return '<div class="sb"><span class="sb-time">' + hhmm(Date.now()) + '</span><span class="sb-icons">' + IC.signal + IC.wifi + IC.battery + '</span></div>';
  }
  function bellBtn(st, live) {
    var dot = unread(st) ? '<span class="bell-dot"></span>' : '';
    return live
      ? '<button type="button" class="ib" data-go="activity" aria-label="Atividade" data-label-pt="Atividade" data-label-en="Activity">' + IC.bell + dot + '</button>'
      : '<span class="ib">' + IC.bell + dot + '</span>';
  }
  function bar(pct) { return '<div class="pbar"><span style="width:' + pct + '%"></span></div>'; }

  function screenList(st, live) {
    var s = stats(st), left = s.total - s.n;
    var h = statusBar() +
      '<div class="ah">' +
      (live ? '<button type="button" class="ib" data-go="home" aria-label="Voltar" data-label-pt="Voltar" data-label-en="Back">' + IC.back + '</button>' : '<span class="ib">' + IC.back + '</span>') +
      '<div class="ah-t"><p class="ah-name">Anotou?</p><p class="ah-sub">' + L('Detalhes da Lista', 'List Details') + '</p></div>' +
      bellBtn(st, live) + av('me', 'av-lg') + '</div>' +
      '<div class="as" data-scroll>' +
      '<div class="lt"><span class="lt-ic">' + IC.grill + '</span><p class="lt-name">' + L('Churrasco de sábado', 'Saturday barbecue') + '</p><span class="ib">' + IC.share + '</span><span class="ib ib-sm">' + IC.more + '</span></div>' +
      '<div class="card members">' + av('me') + av('ana') + av('diego') + '</div>' +
      '<div class="card status"><p class="st-h">' + L('Status das compras', 'Shopping status') + '</p>' +
      '<p class="st-row"><span>' + L(s.n + ' de ' + s.total + ' itens no carrinho', s.n + ' of ' + s.total + ' items in the cart') + '</span><strong>' + s.pct + '%</strong></p>' +
      bar(s.pct) +
      '<p class="st-left">' + (left ? L('Faltam apenas ' + left + (left === 1 ? ' item!' : ' itens!'), 'Only ' + left + (left === 1 ? ' item' : ' items') + ' left!') : L('Tudo no carrinho!', 'Everything is in the cart!')) + '</p>' +
      '<div class="st-money"><p>' + L('Estimado', 'Estimated') + '<span>' + money(s.est) + '</span></p>' +
      '<p class="r">' + L('Gasto até agora', 'Spent so far') + '<span class="green">' + money(s.spent) + '</span></p></div></div>' +
      '<div class="card quick"><span class="q-plus">' + IC.plus + '</span><span class="q-ph">' + L('Digitar ou falar item rápido', 'Type or say an item') + '</span>' + IC.scan + IC.mic + '</div>';

    CATS.forEach(function (c) {
      var its = st.items.filter(function (it) { return it.cat === c.id; });
      h += '<p class="cat"><span class="cat-e" aria-hidden="true">' + c.emoji + '</span>' + L(c.pt, c.en) + ' (' + its.length + ')</p><ul class="items">';
      its.forEach(function (it) {
        var b = !!it.by;
        var tag = live ? 'button type="button" data-item="' + it.id + '" aria-pressed="' + b + '"' : 'div';
        var close = live ? 'button' : 'div';
        var chip = b
          ? '<span class="chip chip-on">' + PEOPLE[it.by] + ' ' + (Date.now() - it.at < 60000 ? L('agora mesmo', 'just now') : L('há ' + Math.floor((Date.now() - it.at) / 60000) + ' min', Math.floor((Date.now() - it.at) / 60000) + ' min ago')) + '</span>'
          : '<span class="chip">' + IC.assign + L('Atribuir item', 'Assign item') + '</span>';
        h += '<li><' + tag + ' class="item' + (b ? ' is-bought' : '') + '">' +
          '<span class="cb">' + (b ? IC.check : '') + '</span>' +
          '<span class="it-main"><span class="it-name">' + L(it.pt, it.en) + '</span><span class="it-q">' + L(it.q[0], it.q[1]) + '</span>' + chip + '</span>' +
          (b ? '<span class="it-paid"><span>' + money(it.price) + '</span>' + L('pago', 'paid') + '</span>' : '') +
          '</' + close + '></li>';
      });
      h += '</ul>';
    });
    h += '</div><span class="fab fab-green" aria-hidden="true">' + IC.plus + '</span>';
    return h;
  }

  function screenHome(st, live) {
    var s = stats(st);
    var missing = CATS.filter(function (c) {
      return c.id !== 'other' && st.items.some(function (it) { return it.cat === c.id && !it.by; });
    });
    var bbq = (live ? '<button type="button" class="lc" data-go="list">' : '<div class="lc">') +
      '<span class="lc-top"><span class="lt-ic">' + IC.grill + '</span><span class="lc-name">' + L('Churrasco de sábado', 'Saturday barbecue') + '</span><span class="ib ib-sm">' + IC.more + '</span></span>' +
      (missing.length ? '<span class="warn">' + IC.warn + L('Faltam ' + missing.map(function (c) { return c.pt; }).join(', '), 'Missing ' + missing.map(function (c) { return c.en; }).join(', ')) + '</span>' : '') +
      bar(s.pct) +
      '<span class="lc-row"><span>' + L(s.n + ' de ' + s.total + ' itens comprados', s.n + ' of ' + s.total + ' items bought') + '</span><strong>' + s.pct + '%</strong></span>' +
      '<span class="lc-av">' + av('me', 'av-sm') + av('ana', 'av-sm') + av('diego', 'av-sm') + '</span>' +
      (live ? '</button>' : '</div>');
    var market = (live ? '<button type="button" class="lc" data-locked>' : '<div class="lc">') +
      '<span class="lc-top"><span class="lt-ic">' + IC.cart + '</span><span class="lc-name">' + L('Mercado', 'Groceries') + '</span><span class="ib ib-sm">' + IC.more + '</span></span>' +
      bar(0) + '<span class="lc-row"><span>' + L('0 de 4 itens comprados', '0 of 4 items bought') + '</span><strong>0%</strong></span>' +
      '<span class="lc-av">' + av('me', 'av-sm') + '</span>' + (live ? '</button>' : '</div>');

    return statusBar() +
      '<div class="ah"><div class="ah-t ah-t-pad"><p class="ah-name">Anotou?</p><p class="ah-sub">' + L('Minhas Listas', 'My Lists') + '</p></div>' +
      '<span class="ib">' + IC.search + '</span>' + bellBtn(st, live) + av('me', 'av-lg') + '</div>' +
      '<div class="as" data-scroll>' +
      '<p class="hi">' + L('Oi, Bruno!', 'Hi, Bruno!') + ' <span aria-hidden="true">👋</span></p>' +
      '<p class="hi-sub">' + L('2 listas ativas rolando agora', '2 active lists going on') + '</p>' +
      '<div class="chips"><span class="fchip is-on">' + L('Todas', 'All') + '</span><span class="fchip">' + L('Criadas por mim', 'Created by me') + '</span><span class="fchip">' + L('Compartilhadas comigo', 'Shared with me') + '</span></div>' +
      '<p class="rec">' + IC.clock + L('Recentes', 'Recent') + '<span> · 2</span></p>' +
      bbq + market +
      '<div class="arch"><span class="arch-ic">' + IC.archive + '</span><span>' + L('Arquivadas (0)', 'Archived (0)') + '</span>' + IC.chevDown + '</div>' +
      '</div>' +
      '<div class="nav"><span class="nav-i is-on">' + IC.lists + L('Minhas Listas', 'My Lists') + '</span><span class="fab fab-orange" aria-hidden="true">' + IC.plus + '</span><span class="nav-i">' + IC.person + L('Perfil', 'Profile') + '</span></div>';
  }

  function dayLabel(t) {
    var d = new Date(t), today = new Date();
    var start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    if (t >= start) return L('Hoje', 'Today');
    if (t >= start - 86400000) return L('Ontem', 'Yesterday');
    return L(d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }), d.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' }));
  }
  function screenActivity(st, live) {
    var h = statusBar() +
      '<div class="ah ah-center">' +
      (live ? '<button type="button" class="ib" data-go="list" aria-label="Voltar" data-label-pt="Voltar" data-label-en="Back">' + IC.back + '</button>' : '<span class="ib">' + IC.back + '</span>') +
      '<p class="ah-title">' + L('Atividade', 'Activity') + '</p>' +
      (live ? '<button type="button" class="ib" data-read aria-label="Marcar tudo como lido" data-label-pt="Marcar tudo como lido" data-label-en="Mark all as read">' + IC.doneAll + '</button>' : '<span class="ib">' + IC.doneAll + '</span>') +
      '</div><div class="as as-feed" data-scroll>';
    var last = '';
    st.activity.slice().sort(function (a, b) { return b.t - a.t; }).forEach(function (a) {
      var lbl = dayLabel(a.t);
      if (lbl !== last) { h += '<p class="day">' + lbl + '</p>'; last = lbl; }
      var verb = a.kind === 'bought' ? L('comprou', 'bought') : L('adicionou', 'added');
      h += '<div class="ev">' + av(a.who, 'av-xl') +
        '<span class="ev-t"><span class="ev-l"><strong class="ev-n">' + PEOPLE[a.who] + '</strong> ' + verb + ' <strong>' + L('um item', 'an item') + '</strong></span>' +
        '<span class="ev-s">' + L('Churrasco de sábado', 'Saturday barbecue') + ' · ' + hhmm(a.t) + '</span></span>' +
        (a.unread ? '<span class="ev-dot" aria-label="Não lida" data-label-pt="Não lida" data-label-en="Unread"></span>' : '') + '</div>';
    });
    return h + '</div>';
  }

  var SCREENS = { list: screenList, home: screenHome, activity: screenActivity };

  // Labels of buttons created after load follow the page's current language.
  function syncLabels(scope) {
    var lang = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'pt';
    var nodes = scope.querySelectorAll('[data-label-pt]');
    for (var i = 0; i < nodes.length; i++) nodes[i].setAttribute('aria-label', nodes[i].getAttribute('data-label-' + lang));
  }

  /* ---------- static screens (Features section) ---------- */
  var mocks = document.querySelectorAll('[data-mock]');
  if (mocks.length) {
    var ms = newState();
    var pic = find(ms, 'picanha'); pic.by = 'ana'; pic.at = Date.now() - 4 * 60000;
    var lin = find(ms, 'sausage'); lin.by = 'me'; lin.at = Date.now() - 9 * 60000;
    ms.activity.push({ who: 'ana', kind: 'bought', t: Date.now() - 4 * 60000, unread: true });
    ms.activity.push({ who: 'me', kind: 'bought', t: Date.now() - 9 * 60000 });
    for (var i = 0; i < mocks.length; i++) {
      var name = mocks[i].getAttribute('data-mock');
      if (SCREENS[name]) mocks[i].innerHTML = SCREENS[name](ms, false);
    }
  }

  /* ---------- interactive demo ---------- */
  var root = document.getElementById('demo');
  if (!root) return;
  var screenEl = root.querySelector('[data-demo-screen]');
  var toastEl = root.querySelector('[data-demo-toast]');
  var state = newState();
  var timers = [];

  function render(focusSel) {
    var sc = screenEl.querySelector('[data-scroll]');
    var keep = sc && screenEl.getAttribute('data-on') === state.screen ? sc.scrollTop : 0;
    screenEl.innerHTML = SCREENS[state.screen](state, true);
    screenEl.setAttribute('data-on', state.screen);
    screenEl.className = 'phone-screen scr-' + state.screen;
    sc = screenEl.querySelector('[data-scroll]');
    if (sc) sc.scrollTop = keep;
    syncLabels(screenEl);
    if (focusSel) { var f = screenEl.querySelector(focusSel); if (f) f.focus({ preventScroll: true }); }
  }

  var toastTimer;
  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3000);
  }

  function buy(id, who) {
    var it = find(state, id);
    if (!it || it.by) return;
    it.by = who; it.at = Date.now();
    state.activity.push({ who: who, kind: 'bought', item: id, t: it.at, unread: who !== 'me' });
    render(who === 'me' ? '[data-item="' + id + '"]' : null);
    if (who !== 'me') {
      toast(av(who, 'av-sm') + '<span><strong>' + PEOPLE[who] + '</strong> ' + L('comprou', 'bought') + ' ' + L(it.pt, it.en) + '</span>');
      if (!reduce) {
        var el = screenEl.querySelector('[data-item="' + id + '"]');
        if (el) { el.classList.add('is-new'); setTimeout(function () { el.classList.remove('is-new'); }, 1400); }
      }
    }
  }

  function tapItem(id) {
    var it = find(state, id);
    if (it.by && it.by !== 'me') {
      toast(av(it.by, 'av-sm') + '<span>' + L(PEOPLE[it.by] + ' já comprou este item', PEOPLE[it.by] + ' already bought this') + '</span>');
      return;
    }
    if (it.by === 'me') {
      it.by = null;
      for (var i = state.activity.length - 1; i >= 0; i--) {
        if (state.activity[i].item === id) { state.activity.splice(i, 1); break; }
      }
      render('[data-item="' + id + '"]');
    } else {
      buy(id, 'me');
    }
  }

  root.addEventListener('click', function (e) {
    var t = e.target;
    var el;
    if ((el = t.closest('[data-item]'))) { tapItem(el.getAttribute('data-item')); return; }
    if ((el = t.closest('[data-go]'))) {
      state.screen = el.getAttribute('data-go');
      render('[data-go]');
      return;
    }
    if (t.closest('[data-read]')) {
      state.activity.forEach(function (a) { a.unread = false; });
      render('[data-read]');
      return;
    }
    if (t.closest('[data-locked]')) {
      toast('<span>' + L('Nesta demonstração, só o Churrasco de sábado abre.', 'In this demo, only Saturday barbecue opens.') + '</span>');
      return;
    }
    if (t.closest('[data-demo-reset]')) reset();
  });

  function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function script() {
    later(4000, function () { buy('picanha', 'ana'); });
    later(10000, function () { buy('charcoal', 'diego'); });
  }
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    state = newState();
    toastEl.classList.remove('is-on');
    render();
    script();
  }

  root.classList.add('is-live');
  render();
  // Refresh the clock and the "N min ago" labels every 30 s.
  setInterval(function () { if (!root.contains(document.activeElement)) render(); }, 30000);

  // Ana and Diego only start buying once the demo is on screen.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { script(); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(root);
  } else {
    script();
  }
})();
