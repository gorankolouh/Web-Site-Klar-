(() => {
  'use strict';
  document.documentElement.classList.add('js');
  let T = {};
  try { T = JSON.parse(document.getElementById('i18n-data').textContent); } catch (e) { /* no-op */ }

  /* Sticky header state */
  const header = document.querySelector('[data-header]');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  const setMenu = (open) => {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? burger.dataset.close : burger.dataset.open);
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (burger && nav) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); } });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });
  }

  /* Keep the visitor on the same section when switching language */
  const sections = [...document.querySelectorAll('main section[id]')];
  const currentSection = () => {
    const mid = window.innerHeight * 0.4;
    const hit = sections.find((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
    return hit && window.scrollY > 40 ? hit.id : '';
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lang-link]');
    if (!a || !sections.length) return;
    const base = a.getAttribute('href').split('#')[0];
    const id = currentSection();
    a.setAttribute('href', id ? `${base}#${id}` : base);
  }, true);

  /* Reveal on scroll */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => ro.observe(el));
  } else { reveals.forEach((el) => el.classList.add('in')); }

  /* Open FAQ / details when linked by hash */
  const openHash = () => { const el = location.hash && document.querySelector(location.hash); if (el && el.tagName === 'DETAILS') el.open = true; };
  openHash(); window.addEventListener('hashchange', openHash);

  /* Contact form */
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const V = T.v || {};
  const ts = form.querySelector('[data-ts]'); if (ts) ts.value = String(Date.now());
  const status = form.querySelector('[data-status]');
  const summary = form.querySelector('[data-summary]');
  const btn = form.querySelector('[data-submit]');
  const label = form.querySelector('[data-submit-label]');

  const rules = {
    name: (v) => v.trim().length >= 2,
    company: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    whatsapp: (v) => !v.trim() || /^\+?[0-9 ()\-/]{6,24}$/.test(v.trim()),
    industry: (v) => v.trim().length >= 2,
    description: (v) => v.trim().length >= 20,
    url: (v) => { if (!v.trim()) return true; try { const u = new URL(v.trim()); return /^https?:$/.test(u.protocol) && u.hostname.includes('.'); } catch { return false; } },
    consent: (_, el) => el.checked,
  };

  const setErr = (name, msg) => {
    const el = form.elements[name]; const field = el.closest('.field'); const p = form.querySelector(`[data-for="${name}"]`);
    field.classList.toggle('invalid', !!msg); el.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (p) p.textContent = msg || '';
  };
  const check = (name) => { const el = form.elements[name]; const ok = rules[name](el.value, el); setErr(name, ok ? '' : V[name]); return ok; };

  Object.keys(rules).forEach((name) => {
    const el = form.elements[name];
    el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') check(name); });
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => { if (el.closest('.field').classList.contains('invalid')) check(name); });
  });

  const setLoading = (on) => {
    btn.disabled = on; label.textContent = on ? T.sending : T.submit;
    const sp = btn.querySelector('.spinner'); if (on && !sp) { const s = document.createElement('span'); s.className = 'spinner'; s.setAttribute('aria-hidden', 'true'); btn.appendChild(s); } else if (!on && sp) sp.remove();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = ''; status.className = 'form-status';
    const invalid = Object.keys(rules).filter((n) => !check(n));
    if (invalid.length) {
      summary.textContent = V.summary; summary.hidden = false;
      form.elements[invalid[0]].focus();
      return;
    }
    summary.hidden = true;
    const data = Object.fromEntries(new FormData(form).entries());
    data.consent = form.elements.consent.checked;
    setLoading(true);
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'failed');
      form.reset(); if (ts) ts.value = String(Date.now());
      status.className = 'form-status ok'; status.textContent = T.success;
    } catch (err) {
      status.className = 'form-status fail'; status.textContent = T.error;
    } finally { setLoading(false); }
  });
})();

/* Portfolio carousel (mobile / tablet) */
(() => {
  const track = document.querySelector('[data-pf]');
  const prev = document.querySelector('[data-pf-prev]');
  const next = document.querySelector('[data-pf-next]');
  const count = document.querySelector('[data-pf-count]');
  if (!track || !prev || !next) return;
  const items = [...track.children];
  const of = track.dataset.of || '/';
  const index = () => {
    const left = track.scrollLeft;
    let best = 0, dist = Infinity;
    items.forEach((el, i) => { const d = Math.abs(el.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft) - left); if (d < dist) { dist = d; best = i; } });
    return best;
  };
  const update = () => {
    const i = index();
    if (count) count.textContent = `${i + 1} ${of} ${items.length}`;
    prev.disabled = i === 0;
    next.disabled = i === items.length - 1;
  };
  const go = (dir) => {
    const i = Math.min(items.length - 1, Math.max(0, index() + dir));
    track.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  let raf; track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
