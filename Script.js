/* =========================================================
   ACD Yard Care and Landscaping — script.js
   Plain JavaScript. No libraries, no build step.
   ========================================================= */

/* ---------------------------------------------------------
   CONFIG — edit these two lines if the number ever changes.
   WHATSAPP uses the international format without + or spaces.
   --------------------------------------------------------- */
var CONFIG = {
  WHATSAPP: '27765800121',      // 076 580 0121 in international format
  PHONE_DISPLAY: '076 580 0121'
};

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Current year in the footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: solid background once scrolled ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 60);
    if (!reduceMotion && heroMedia && window.scrollY < window.innerHeight) {
      heroMedia.style.transform = 'translateY(' + (window.scrollY * 0.18) + 'px)';
    }
  }

  /* ---------- Hero parallax (very gentle) ---------- */
  var heroMedia = document.getElementById('heroMedia');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      header.classList.toggle('is-solid', open || window.scrollY > 60);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Highlight the section you're reading ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal sections on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* ---------- Before / after comparison ---------- */
  var ba = document.getElementById('ba');
  if (ba) {
    var after = document.getElementById('baAfter');
    var handle = document.getElementById('baHandle');
    var dragging = false;

    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }
    function fromEvent(e) {
      var rect = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      setPos((x / rect.width) * 100);
    }
    function start(e) { dragging = true; fromEvent(e); }
    function move(e) { if (dragging) { fromEvent(e); if (e.cancelable) e.preventDefault(); } }
    function end() { dragging = false; }

    ba.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    ba.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);

    handle.addEventListener('keydown', function (e) {
      var now = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft') { setPos(now - 4); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(now + 4); e.preventDefault(); }
    });

    setPos(50);
  }

  /* ---------- Gallery viewer ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lastFocused = null;

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    if (lastFocused) lastFocused.focus();
  }
  if (lightbox) {
    Array.prototype.forEach.call(document.querySelectorAll('.shot'), function (fig) {
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      function open() {
        var img = fig.querySelector('img');
        lastFocused = fig;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('is-open');
        document.getElementById('lightboxClose').focus();
      }
      fig.addEventListener('click', open);
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { open(); e.preventDefault(); }
      });
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.id === 'lightboxClose') closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ---------- Quote form -> WhatsApp ----------
     The form has no server behind it. On submit it builds a
     WhatsApp message and opens the chat with ACD.

     TO EMAIL ENQUIRIES INSTEAD: sign up for a free form service
     (e.g. Formspree), then in index.html set
       <form ... action="https://formspree.io/f/YOUR_ID" method="POST">
     and delete this whole block.
  -------------------------------------------------------- */
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f['name'].value.trim();
      var phone = f['phone'].value.trim();
      var service = f['service'].value;
      var message = f['message'].value.trim();
      var note = document.getElementById('formNote');

      if (!name || !phone || !service) {
        note.textContent = 'Please add your name, phone number and the service you need.';
        note.style.color = '#A6412F';
        (!name ? f['name'] : !phone ? f['phone'] : f['service']).focus();
        return;
      }

      var text =
        'Hi ACD Yard Care and Landscaping,\n\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Service: ' + service + '\n' +
        (message ? 'Details: ' + message + '\n' : '') +
        '\nPlease send me a quote.';

      note.textContent = 'Opening WhatsApp with your details…';
      note.style.color = '';
      window.open('https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
})();
