/* Torben Riise — site behaviour (progressive enhancement; site works without JS) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // ---- Footer year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---- Sticky header shadow ----
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav ----
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
  }

  // ---- Reveal on scroll + active nav ----
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

    var links = {};
    document.querySelectorAll('.site-nav a[href^="#"]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { navObs.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Logo and "Back to top" links scroll to the very top ----
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href="#top"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    });
  });

  // ---- Only one song plays at a time ----
  var players = document.querySelectorAll('audio');
  players.forEach(function (p) {
    p.addEventListener('play', function () {
      players.forEach(function (o) { if (o !== p) o.pause(); });
    });
  });

  // ---- Sample chapter window ----
  var dialog = document.getElementById('sample-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    var sTitle = document.getElementById('sample-title');
    var sBody = document.getElementById('sample-body');
    var TBD = '<p class="sample-tbd">A sample chapter will appear here soon.</p>';
    var cache = {};

    function openSample(slug, title) {
      sTitle.textContent = title;
      if (!cache[slug]) {
        var tpl = document.querySelector('template[data-sample="' + slug + '"]');
        if (tpl) cache[slug] = tpl.innerHTML.trim() || TBD;
      }
      sBody.innerHTML = cache[slug] || '<p class="sample-tbd">Loading…</p>';
      sBody.scrollTop = 0;
      dialog.showModal();
      if (cache[slug]) return;
      fetch('samples/' + slug + '.html')
        .then(function (r) { return r.ok ? r.text() : ''; })
        .catch(function () { return ''; })
        .then(function (text) {
          var clean = text.replace(/<!--[\s\S]*?-->/g, '').trim();
          cache[slug] = clean || TBD;
          if (dialog.open && sTitle.textContent === title) sBody.innerHTML = cache[slug];
        });
    }

    document.querySelectorAll('.sample-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openSample(btn.dataset.sample, btn.dataset.title);
      });
    });
    dialog.querySelector('.sample-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  }

  // ---- Contact form → composes an email to the right inbox ----
  var form = document.getElementById('contact-form');
  if (form) {
    var ROUTES = {
      general:    { to: 'torben.riise@gmail.com', subject: 'Note from a reader' },
      speaking:   { to: 'torben.riise@gmail.com', subject: 'Speaking invitation' },
      consulting: { to: 'exec.kaizen@gmail.com',  subject: 'Consulting inquiry' },
      order:      { to: 'exec.kaizen@gmail.com',  subject: 'Book order' }
    };
    var errorEl = document.getElementById('cf-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name;
      var msg = form.elements.message;
      var missing = [];
      [name, msg].forEach(function (f) {
        var bad = !f.value.trim();
        f.setAttribute('aria-invalid', String(bad));
        if (bad) missing.push(f);
      });
      if (missing.length) {
        errorEl.textContent = 'Please add your name and a message.';
        errorEl.hidden = false;
        missing[0].focus();
        return;
      }
      errorEl.hidden = true;

      var route = ROUTES[form.elements.topic.value] || ROUTES.general;
      var body = msg.value.trim() + '\n\n— ' + name.value.trim();
      window.location.href = 'mailto:' + route.to +
        '?subject=' + encodeURIComponent(route.subject + ' — ' + name.value.trim()) +
        '&body=' + encodeURIComponent(body);
    });
  }
})();
