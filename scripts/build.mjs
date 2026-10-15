// Generates the static site from scripts/i18n.mjs
// Usage: node scripts/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, SITE } from './i18n.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (p, s) => { const f = join(ROOT, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, s); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (s) => s.replaceAll('{email}', SITE.email).replaceAll('{phone}', SITE.phoneDisplay);

const LEGAL_SLUGS = {
  de: { impressum: 'impressum', privacy: 'datenschutz' },
  en: { impressum: 'legal-notice', privacy: 'privacy' },
  hr: { impressum: 'impressum', privacy: 'privatnost' },
};
const url = (code, page = '') => `/${code}/${page ? page + '/' : ''}`;
const wa = (t) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t.contact.waMsg)}`;

const icon = (name, cls = 'ic') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true">
<defs>
<symbol id="i-layout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M9 9v11"/></symbol>
<symbol id="i-devices" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="14" height="10" rx="1.5"/><path d="M6 18h7"/><rect x="16" y="9" width="5.5" height="11" rx="1.3"/><path d="M18.2 17.8h1"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></symbol>
<symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></symbol>
<symbol id="i-rocket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.5 8.5 12C10 7.5 13 4.5 19.5 4.5c0 6.5-3 9.5-7.5 11Z"/><path d="M8.5 12 5 11.5l2.5-3h4M12 15.5l.5 3.5 3-2.5v-4"/><path d="M6.5 17.5 4.5 19.5"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 7l10 10M17 7 7 17"/></symbol>
<symbol id="i-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
<symbol id="i-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4.5A1.5 1.5 0 0 1 4.5 3H12l9 9-9 9Z"/><circle cx="7.5" cy="7.5" r="1.3"/></symbol>
<symbol id="i-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.4-3.6 4.4-5.5 8-5.5s6.6 1.9 8 5.5"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></symbol>
<symbol id="i-card" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></symbol>
<symbol id="i-ads" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1Z"/><path d="M17 9a4 4 0 0 1 0 6"/></symbol>
<symbol id="i-social" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/></symbol>
<symbol id="i-lang" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h9M7.5 3v2M5 5c.5 3.5 2.5 6 6 7.5M10 5c-.6 3.6-2.7 6.4-6.5 8"/><path d="m12.5 21 4-10 4 10M14 17.5h5"/></symbol>
<symbol id="i-plug" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0Z"/><path d="M12 16v5"/></symbol>
<symbol id="i-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 20 4.5-1L19 8.5 15.5 5 5 15.5Z"/><path d="m13.5 7 3.5 3.5"/></symbol>
<symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6Z"/><path d="m8.8 12 2.3 2.3 4.2-4.3"/></symbol>
<symbol id="i-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12Z"/></symbol>
<symbol id="i-grow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 17.5 9.5 11.5l4 4 7-7.5"/><path d="M15 8h5.5v5.5"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2.5a9.4 9.4 0 0 0-8.1 14.18L2.5 21.5l4.95-1.4A9.4 9.4 0 1 0 12.04 2.5Zm0 17.2a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-2.94.83.85-2.86-.19-.3a7.8 7.8 0 1 1 6.55 3.6Zm4.28-5.84c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.73.91-.14.16-.27.18-.5.06a6.4 6.4 0 0 1-3.2-2.8c-.24-.41.24-.38.69-1.27.08-.16.04-.29-.02-.41-.06-.12-.52-1.26-.72-1.73-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.3c-.21.23-.82.8-.82 1.95s.84 2.26.96 2.42c.12.16 1.65 2.52 4 3.53 1.49.64 2.07.7 2.81.59.45-.07 1.38-.57 1.58-1.11.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.44-.28Z"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></symbol>
</defs></svg>`;

const LOGO = (t) => `<a class="logo" href="${url(t.code)}" aria-label="${esc(t.nav.home)}">
  <svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor"/><path d="M10 8v16" stroke="#F6F4EF" stroke-width="3" stroke-linecap="round"/><path d="M22 8 14.5 16 22 24" stroke="#365CEB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
  <span class="logo-word">KLARSEITE<span>STUDIO</span></span>
</a>`;

const langSwitch = (t, page, cls = '') => `<nav class="lang ${cls}" aria-label="${esc(t.nav.lang)}"><ul>${LANGS.map((l) => {
  const href = page ? url(l.code, LEGAL_SLUGS[l.code][page]) : url(l.code);
  return `<li><a href="${href}" hreflang="${l.code}" lang="${l.code}" data-lang-link${l.code === t.code ? ' aria-current="true"' : ''}>${l.label}</a></li>`;
}).join('')}</ul></nav>`;

function head(t, { title, description, path, alternates, robots = 'index,follow' }) {
  const canonical = SITE.domain + path;
  const alt = alternates.map((a) => `<link rel="alternate" hreflang="${a.code}" href="${SITE.domain}${a.path}">`).join('\n  ');
  const xdef = alternates.find((a) => a.code === 'de');
  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${canonical}">
  ${alt}
  <link rel="alternate" hreflang="x-default" href="${SITE.domain}${xdef.path}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Klarseite Studio">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${t.ogLocale}">
  ${LANGS.filter((l) => l.code !== t.code).map((l) => `<meta property="og:locale:alternate" content="${l.ogLocale}">`).join('\n  ')}
  <meta property="og:image" content="${SITE.domain}/assets/img/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#F6F4EF">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="preload" href="/assets/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/style.css">`;
}

function header(t, page) {
  const base = page ? url(t.code) : '';
  const links = [['services', t.nav.services], ['process', t.nav.process], ['extras', t.nav.extras], ['faq', t.nav.faq], ['contact', t.nav.contact]];
  return `<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="site-header" data-header>
  <div class="wrap header-inner">
    ${LOGO(t)}
    <nav class="main-nav" id="main-nav" aria-label="${esc(t.nav.services)}" data-nav>
      <ul>${links.map(([id, l]) => `<li><a href="${base}#${id}">${esc(l)}</a></li>`).join('')}</ul>
      ${langSwitch(t, page, 'lang-mobile')}
      <a class="btn btn-primary btn-block nav-mobile-cta" href="${base}#contact">${esc(t.nav.cta)}</a>
    </nav>
    <div class="header-actions">
      ${langSwitch(t, page)}
      <a class="btn btn-primary btn-sm header-cta" href="${base}#contact">${esc(t.nav.cta)}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="main-nav" data-burger data-open="${esc(t.nav.menu)}" data-close="${esc(t.nav.close)}" aria-label="${esc(t.nav.menu)}"><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

function footer(t) {
  const s = LEGAL_SLUGS[t.code];
  const base = url(t.code);
  const links = [['services', t.nav.services], ['pricing', t.pricing.eyebrow], ['process', t.nav.process], ['portfolio', t.portfolio.eyebrow], ['extras', t.nav.extras], ['faq', t.nav.faq], ['contact', t.nav.contact]];
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      ${LOGO(t)}
      <p>${esc(t.footer.desc)}</p>
      ${langSwitch(t, null, 'lang-footer')}
    </div>
    <div>
      <h2 class="footer-h">${esc(t.footer.nav)}</h2>
      <ul class="footer-list">${links.map(([id, l]) => `<li><a href="${base}#${id}">${esc(l)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="footer-h">${esc(t.footer.contact)}</h2>
      <ul class="footer-list">
        <li><a href="mailto:${SITE.email}">${icon('mail')}${SITE.email}</a></li>
        <li><a href="tel:${SITE.phoneHref}">${icon('phone')}${SITE.phoneDisplay}</a></li>
        <li><a href="${wa(t)}" target="_blank" rel="noopener">${icon('wa')}WhatsApp</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">${esc(t.footer.legal)}</h2>
      <ul class="footer-list">
        <li><a href="${url(t.code, s.impressum)}">${esc(t.footer.impressum)}</a></li>
        <li><a href="${url(t.code, s.privacy)}">${esc(t.footer.privacy)}</a></li>
        <li><details class="cookie-note"><summary>${esc(t.footer.cookies)}</summary><p>${esc(t.footer.cookiesText)}</p></details></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© <span data-year>${SITE.year}</span> Klarseite Studio. ${esc(t.footer.rights)}</p>
  </div>
</footer>`;
}

/* ---------- Mockups (fictional design examples) ---------- */
const browser = (inner, urlText, cls = '') => `<div class="browser ${cls}"><div class="browser-bar"><i></i><i></i><i></i><span>${urlText}</span></div><div class="browser-body">${inner}</div></div>`;

const heroDesktop = `<div class="mk-bakery">
  <div class="mk-nav"><b>Morgenrot</b><span>Brot</span><span>Café</span><span>Kontakt</span><em>Vorbestellen</em></div>
  <div class="mk-hero"><div><small>Handwerksbäckerei seit Generationen</small><strong>Ehrliches Brot.<br>Jeden Morgen frisch.</strong><em>Sortiment ansehen</em></div><div class="mk-loaf" aria-hidden="true"><i></i><i></i><i></i></div></div>
  <div class="mk-row"><span><b>Sauerteig</b>48 h Teigführung</span><span><b>Café</b>Mo–Sa ab 6:30</span><span><b>Vorbestellung</b>per WhatsApp</span></div>
</div>`;
const heroPhone = `<div class="phone"><div class="phone-notch"></div><div class="mk-bakery mk-bakery-m">
  <div class="mk-nav"><b>Morgenrot</b><i class="mk-burger"></i></div>
  <div class="mk-loaf mk-loaf-m" aria-hidden="true"><i></i><i></i><i></i></div>
  <strong>Ehrliches Brot. Jeden Morgen frisch.</strong>
  <em>Vorbestellen</em><em class="ghost">Anrufen</em>
</div></div>`;

const demoTrades = `<div class="dm dm-trades">
  <div class="dm-nav"><b><i></i>Elektro Brandt</b><span>Leistungen</span><span>Über uns</span><em>Notdienst</em></div>
  <div class="dm-hero"><small>Meisterbetrieb · Region Hannover</small><strong>Elektroinstallation, auf die Sie sich verlassen können.</strong><div class="dm-btns"><em>Angebot anfordern</em><span>0511 000000</span></div></div>
  <div class="dm-grid"><span><b>Installation</b>Neubau &amp; Sanierung</span><span><b>E-Mobilität</b>Wallboxen</span><span><b>Smart Home</b>Planung &amp; Einbau</span></div>
  <div class="dm-area"><span>Einzugsgebiet</span><b>Hannover · Laatzen · Garbsen · Langenhagen</b></div>
  <div class="dm-foot"><span>Mo–Fr 7–17 Uhr</span><em>Rückruf anfordern →</em></div>
</div>`;
const demoBarber = `<div class="dm dm-barber">
  <div class="dm-nav"><b>NOVAK<span>barber co.</span></b><span>Services</span><span>Team</span><em>Termin</em></div>
  <div class="dm-hero"><small>Est. Zagreb</small><strong>Sharp cuts.<br>Quiet confidence.</strong></div>
  <ul class="dm-prices"><li><span>Haircut</span><i></i><b>25 €</b></li><li><span>Beard trim</span><i></i><b>15 €</b></li><li><span>Cut &amp; beard</span><i></i><b>35 €</b></li></ul>
  <div class="dm-hours"><span>Tue–Fri<b>10–20</b></span><span>Sat<b>9–15</b></span><em>Book a chair</em></div>
</div>`;
const demoStay = `<div class="dm dm-stay">
  <div class="dm-nav"><b>Apartmani Lavanda</b><span>Smještaj</span><span>Lokacija</span><em>Upit</em></div>
  <div class="dm-scene" aria-hidden="true"><i class="sun"></i><i class="sea"></i><i class="hill"></i></div>
  <div class="dm-hero"><small>Hvar · 120 m do mora</small><strong>Mirni dani uz more.</strong></div>
  <ul class="dm-amen"><li>Wi-Fi</li><li>Klima</li><li>Parking</li><li>Terasa</li><li>4 osobe</li></ul>
  <div class="dm-book"><span>Dolazak<b>12.06.</b></span><span>Odlazak<b>19.06.</b></span><em>Pošalji upit</em></div>
</div>`;
const DEMOS = [
  { html: demoTrades, url: 'klarseitestudio.online/demo/elektro', icon: 'bolt' },
  { html: demoBarber, url: 'klarseitestudio.online/demo/barber', icon: 'pen' },
  { html: demoStay, url: 'klarseitestudio.online/demo/apartmani', icon: 'pin' },
];

/* ---------- Home page ---------- */
function home(t) {
  const priv = url(t.code, LEGAL_SLUGS[t.code].privacy);
  const featIcons = ['layout', 'devices', 'chat', 'search', 'globe', 'rocket'];
  const trustIcons = ['tag', 'devices', 'clock', 'user'];
  const extraIcons = ['pen', 'calendar', 'clock', 'card', 'search', 'ads', 'social', 'lang', 'plug'];
  const whyIcons = ['tag', 'shield', 'bolt', 'grow'];
  const visIcons = ['globe', 'clock', 'search'];
  const groupIcons = ['check', 'x', 'doc'];
  const alternates = LANGS.map((l) => ({ code: l.code, path: url(l.code) }));
  const c = t.contact, f = c.f;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${SITE.domain}/#org`, name: 'Klarseite Studio', url: SITE.domain + '/', email: SITE.email, telephone: SITE.phoneHref, logo: `${SITE.domain}/assets/img/apple-touch-icon.png` },
      { '@type': 'WebSite', '@id': `${SITE.domain}/#website`, url: SITE.domain + '/', name: 'Klarseite Studio', inLanguage: ['de', 'en', 'hr'], publisher: { '@id': `${SITE.domain}/#org` } },
      { '@type': 'Service', name: t.pricing.product, provider: { '@id': `${SITE.domain}/#org` }, serviceType: 'Web design', offers: { '@type': 'Offer', price: '99', priceCurrency: 'EUR', url: SITE.domain + url(t.code) + '#pricing' } },
      { '@type': 'FAQPage', inLanguage: t.code, mainEntity: t.faq.items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) },
    ],
  };
  const clientI18n = { v: c.v, sending: f.sending, submit: f.submit, success: c.success, error: c.error, open: t.nav.menu, close: t.nav.close };

  return `${head(t, { title: t.meta.title, description: t.meta.description, path: url(t.code), alternates })}
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${SPRITE}
${header(t)}
<main id="main">

<section class="hero" aria-labelledby="hero-h">
  <div class="wrap hero-grid">
    <div class="hero-copy reveal">
      <p class="eyebrow">${esc(t.hero.eyebrow)}</p>
      <h1 id="hero-h">${esc(t.hero.h1).replace('{price}', `<span class="hl">${esc(t.hero.price).replace(' ', '&nbsp;')}</span>`)}</h1>
      <p class="hero-sub">${esc(t.hero.sub)}</p>
      <p class="lead">${esc(t.hero.lead)}</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="#contact">${esc(t.hero.cta1)}${icon('arrow')}</a>
        <a class="btn btn-ghost btn-lg" href="#portfolio">${esc(t.hero.cta2)}</a>
      </div>
      <p class="hero-direct">${esc(t.hero.direct)} <a href="${wa(t)}" target="_blank" rel="noopener">${icon('wa')}${esc(t.hero.directLink)}</a></p>
    </div>
    <div class="hero-visual reveal" role="img" aria-label="${esc(t.hero.mockAlt)}">
      <div class="hero-stage">
        ${browser(heroDesktop, 'klarseitestudio.online/demo/baeckerei', 'hero-browser')}
        ${heroPhone}
        <span class="tag-sample">${esc(t.portfolio.label)}</span>
      </div>
      <aside class="price-panel" aria-label="${esc(t.hero.panelLabel)} ${esc(t.hero.price)}">
        <div class="pp-top"><span class="pp-label">${esc(t.hero.panelLabel)}</span><span class="pp-price">${esc(t.hero.price)}</span></div>
        <ul class="checks">${t.hero.items.map((i) => `<li>${icon('check')}${esc(i)}</li>`).join('')}</ul>
        <p class="pp-delivery">${icon('clock')}${esc(t.hero.delivery)}</p>
        <p class="pp-trust">${esc(t.hero.trust)}</p>
      </aside>
    </div>
  </div>
</section>

<section class="trust" aria-label="${esc(t.pricing.eyebrow)}">
  <ul class="wrap trust-list">${t.trust.map((x, i) => `<li>${icon(trustIcons[i])}<span>${esc(x)}</span></li>`).join('')}</ul>
</section>

<section class="section" id="why-website" aria-labelledby="problem-h">
  <div class="wrap split">
    <div class="reveal">
      <p class="eyebrow">${esc(t.problem.eyebrow)}</p>
      <h2 id="problem-h">${esc(t.problem.h2)}</h2>
      <p class="body-l">${esc(t.problem.p1)}</p>
      <p class="body-l">${esc(t.problem.p2)}</p>
      <a class="btn btn-primary" href="#contact">${esc(t.problem.cta)}${icon('arrow')}</a>
    </div>
    <div class="benefit-card reveal">
      <h3>${esc(t.problem.listTitle)}</h3>
      <ol class="benefits">${t.problem.items.map((x, i) => `<li><span class="num">${String(i + 1).padStart(2, '0')}</span>${esc(x)}</li>`).join('')}</ol>
    </div>
  </div>
</section>

<section class="section section-white" id="services" aria-labelledby="inc-h">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">${esc(t.included.eyebrow)}</p>
      <h2 id="inc-h">${esc(t.included.h2)}</h2>
      <p class="body-l">${esc(t.included.lead)}</p>
    </div>
    <div class="feature-grid">${t.included.cards.map((x, i) => `<article class="feature reveal"><span class="feature-ic">${icon(featIcons[i])}</span><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></article>`).join('')}</div>
    <p class="note reveal">${icon('shield')}<span>${esc(t.included.note)}</span></p>
  </div>
</section>

<section class="section section-portfolio" id="portfolio" aria-labelledby="pf-h">
  <div class="wrap">
    <div class="pf-head">
      <div class="section-head reveal">
        <p class="eyebrow">${esc(t.portfolio.eyebrow)}</p>
        <h2 id="pf-h">${esc(t.portfolio.h2)}</h2>
        <p class="body-l">${esc(t.portfolio.lead)}</p>
      </div>
      <div class="pf-controls" data-pf-controls>
        <button class="pf-btn" type="button" data-pf-prev aria-label="${esc(t.portfolio.prev)}">${icon('arrow', 'ic flip')}</button>
        <span class="pf-count" aria-live="polite" data-pf-count>1 ${esc(t.portfolio.of)} ${t.portfolio.items.length}</span>
        <button class="pf-btn" type="button" data-pf-next aria-label="${esc(t.portfolio.next)}">${icon('arrow')}</button>
      </div>
    </div>
    <div class="portfolio" data-pf data-of="${esc(t.portfolio.of)}">${t.portfolio.items.map((p, i) => `<article class="work reveal">
      <div class="work-visual" role="img" aria-label="${esc(t.portfolio.label)}: ${esc(p.t)}">${browser(DEMOS[i].html, DEMOS[i].url)}<span class="tag-sample">${esc(t.portfolio.label)}</span></div>
      <div class="work-copy"><h3>${icon(DEMOS[i].icon)}${esc(p.t)}</h3><p>${esc(p.d)}</p><ul class="chips">${p.f.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    </article>`).join('')}</div>
    <p class="disclaimer reveal">${esc(t.portfolio.disclaimer)}</p>
  </div>
</section>

<section class="section" id="pricing" aria-labelledby="price-h">
  <div class="wrap">
    <div class="section-head center reveal">
      <p class="eyebrow">${esc(t.pricing.eyebrow)}</p>
      <h2 id="price-h">${esc(t.pricing.h2)}</h2>
      <p class="body-l">${esc(t.pricing.lead)}</p>
    </div>
    <div class="pricing-wrap reveal">
      <article class="price-card">
        <div class="price-card-head">
          <h3>${esc(t.pricing.product)}</h3>
          <p class="price"><span class="amount">${esc(t.pricing.price)}</span><span class="suffix">${esc(t.pricing.priceSuffix)}</span></p>
        </div>
        <ul class="checks checks-lg">${t.pricing.items.map((i) => `<li>${icon('check')}${esc(i)}</li>`).join('')}</ul>
        <a class="btn btn-primary btn-lg btn-block" href="#contact">${esc(t.pricing.cta)}${icon('arrow')}</a>
        <p class="price-trust">${icon('shield')}${esc(t.pricing.trust)}</p>
        <p class="price-below">${esc(t.pricing.below)}</p>
      </article>
      <details class="disclosure" id="details">
        <summary><span>${esc(t.pricing.detailsTitle)}</span>${icon('plus', 'ic plus')}</summary>
        <div class="disclosure-body">
          <p class="details-lead">${esc(t.pricing.detailsLead)}</p>
          <dl class="terms">${t.pricing.terms.map((x) => `<div class="term"><dt>${esc(x.t)}</dt><dd>${esc(x.d)}</dd></div>`).join('')}</dl>
          <div class="groups">${t.pricing.groups.map((g, gi) => `<div class="group group-${gi}"><h4>${esc(g.t)}</h4><ul>${g.items.map((i) => `<li>${icon(groupIcons[gi])}${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div>
        </div>
      </details>
    </div>
  </div>
</section>

<section class="section section-white" id="process" aria-labelledby="proc-h">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">${esc(t.process.eyebrow)}</p>
      <h2 id="proc-h">${esc(t.process.h2)}</h2>
    </div>
    <ol class="steps">${t.process.steps.map((s, i) => `<li class="step reveal"><span class="step-n">${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('')}</ol>
    <div class="conditions reveal">
      <div class="conditions-body"><h3>${icon('clock')}${esc(t.process.condTitle)}</h3><ul>${t.process.conditions.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <a class="btn btn-primary" href="#contact">${esc(t.process.cta)}${icon('arrow')}</a>
    </div>
  </div>
</section>


<section class="section section-white" id="visibility" aria-labelledby="vis-h">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">${esc(t.visibility.eyebrow)}</p>
      <h2 id="vis-h">${esc(t.visibility.h2)}</h2>
      <p class="body-l">${esc(t.visibility.lead)}</p>
    </div>
    <div class="vis-grid">${t.visibility.points.map((p, i) => `<article class="vis reveal">${icon(visIcons[i])}<h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></article>`).join('')}</div>
    <blockquote class="statement reveal"><p>${esc(t.visibility.disclaimer)}</p></blockquote>
  </div>
</section>

<section class="section" id="extras" aria-labelledby="ex-h">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">${esc(t.extras.eyebrow)}</p>
      <h2 id="ex-h">${esc(t.extras.h2)}</h2>
      <p class="body-l">${esc(t.extras.sub)}</p>
    </div>
    <div class="extra-grid">${t.extras.items.map((x, i) => `<article class="extra reveal"><div class="extra-top"><span class="feature-ic">${icon(extraIcons[i])}</span><span class="badge">${esc(t.extras.badge)}</span></div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p><span class="extra-price">${esc(t.extras.price)}</span></article>`).join('')}</div>
    <div class="extras-foot reveal"><p>${esc(t.extras.note)}</p><a class="btn btn-dark" href="#contact">${esc(t.extras.cta)}${icon('arrow')}</a></div>
  </div>
</section>

<section class="section section-white" id="why" aria-labelledby="why-h">
  <div class="wrap split split-why">
    <div class="reveal">
      <p class="eyebrow">${esc(t.why.eyebrow)}</p>
      <h2 id="why-h">${esc(t.why.h2)}</h2>
      <p class="body-l">${esc(t.why.text)}</p>
    </div>
    <div class="why-grid">${t.why.items.map((x, i) => `<article class="why reveal">${icon(whyIcons[i])}<h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></article>`).join('')}</div>
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-h">
  <div class="wrap faq-layout">
    <div class="section-head reveal">
      <p class="eyebrow">${esc(t.faq.eyebrow)}</p>
      <h2 id="faq-h">${esc(t.faq.h2)}</h2>
    </div>
    <div class="faq-list">${t.faq.items.map((x) => `<details class="faq reveal"><summary><h3>${esc(x.q)}</h3>${icon('plus', 'ic plus')}</summary><div class="faq-a"><p>${esc(x.a)}</p></div></details>`).join('')}</div>
  </div>
</section>

<section class="final" aria-labelledby="final-h">
  <div class="wrap final-inner reveal">
    <h2 id="final-h">${esc(t.final.h2)}</h2>
    <p>${esc(t.final.text)}</p>
    <div class="btn-row center">
      <a class="btn btn-primary btn-lg" href="#contact">${esc(t.final.cta1)}${icon('arrow')}</a>
      <a class="btn btn-outline-light btn-lg" href="${wa(t)}" target="_blank" rel="noopener">${icon('wa')}${esc(t.final.cta2)}</a>
    </div>
  </div>
</section>

<section class="section" id="contact" aria-labelledby="ct-h">
  <div class="wrap contact-grid">
    <div class="contact-intro reveal">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h2 id="ct-h">${esc(c.h2)}</h2>
      <p class="body-l">${esc(c.lead)}</p>
      <ul class="assure">${c.assure.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
      <div class="alt-card">
        <h3>${esc(c.altTitle)}</h3>
        <p>${esc(c.altText)}</p>
        <a class="btn btn-wa btn-block" href="${wa(t)}" target="_blank" rel="noopener">${icon('wa')}${esc(c.waBtn)}</a>
        <ul class="contact-lines">
          <li><a href="mailto:${SITE.email}">${icon('mail')}${SITE.email}</a></li>
          <li><a href="tel:${SITE.phoneHref}">${icon('phone')}${SITE.phoneDisplay}</a></li>
        </ul>
      </div>
    </div>
    <form class="form reveal" action="/api/contact" method="post" novalidate data-form>
      <div class="form-summary" role="alert" tabindex="-1" hidden data-summary></div>
      <div class="field-row">
        <div class="field"><label for="f-name">${esc(f.name)} <abbr title="${esc(f.required)}">*</abbr></label><input id="f-name" name="name" type="text" autocomplete="name" required maxlength="120" aria-describedby="e-name"><p class="err" id="e-name" data-for="name"></p></div>
        <div class="field"><label for="f-company">${esc(f.company)} <abbr title="${esc(f.required)}">*</abbr></label><input id="f-company" name="company" type="text" autocomplete="organization" required maxlength="160" aria-describedby="e-company"><p class="err" id="e-company" data-for="company"></p></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="f-email">${esc(f.email)} <abbr title="${esc(f.required)}">*</abbr></label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="200" aria-describedby="e-email"><p class="err" id="e-email" data-for="email"></p></div>
        <div class="field"><label for="f-whatsapp">${esc(f.whatsapp)} <span class="opt">(${esc(f.optional)})</span></label><input id="f-whatsapp" name="whatsapp" type="tel" autocomplete="tel" inputmode="tel" maxlength="40" aria-describedby="e-whatsapp"><p class="err" id="e-whatsapp" data-for="whatsapp"></p></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="f-industry">${esc(f.industry)} <abbr title="${esc(f.required)}">*</abbr></label><input id="f-industry" name="industry" type="text" required maxlength="120" placeholder="${esc(f.industryPh)}" aria-describedby="e-industry"><p class="err" id="e-industry" data-for="industry"></p></div>
        <div class="field"><label for="f-language">${esc(f.language)}</label><div class="select"><select id="f-language" name="language">${f.languages.map((l, i) => `<option value="${['de', 'en', 'hr', 'multi'][i]}"${['de', 'en', 'hr'][i] === t.code ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div></div>
      </div>
      <div class="field"><label for="f-description">${esc(f.description)} <abbr title="${esc(f.required)}">*</abbr></label><textarea id="f-description" name="description" rows="5" required minlength="20" maxlength="3000" placeholder="${esc(f.descriptionPh)}" aria-describedby="e-description"></textarea><p class="err" id="e-description" data-for="description"></p></div>
      <div class="field"><label for="f-url">${esc(f.url)} <span class="opt">(${esc(f.optional)})</span></label><input id="f-url" name="url" type="url" inputmode="url" maxlength="300" placeholder="${esc(f.urlPh)}" aria-describedby="e-url"><p class="err" id="e-url" data-for="url"></p></div>
      <div class="hp" aria-hidden="true"><label for="f-website2">Website</label><input id="f-website2" name="website2" type="text" tabindex="-1" autocomplete="off"></div>
      <input type="hidden" name="locale" value="${t.code}">
      <input type="hidden" name="ts" value="" data-ts>
      <p class="privacy-text">${c.privacy.replaceAll('{privacy}', priv)}</p>
      <div class="field field-check"><input id="f-consent" name="consent" type="checkbox" required aria-describedby="e-consent"><label for="f-consent">${f.consent.replaceAll('{privacy}', priv)}</label><p class="err" id="e-consent" data-for="consent"></p></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit" data-submit><span data-submit-label>${esc(f.submit)}</span>${icon('arrow')}</button>
      <div class="form-status" role="status" aria-live="polite" data-status></div>
    </form>
  </div>
</section>

</main>
${footer(t)}
<script type="application/json" id="i18n-data">${JSON.stringify(clientI18n)}</script>
<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

function legalPage(t, kind) {
  const title = kind === 'impressum' ? t.legal.impressumTitle : t.legal.privacyTitle;
  const blocks = kind === 'impressum' ? t.legal.impressum : t.legal.privacy;
  const alternates = LANGS.map((l) => ({ code: l.code, path: url(l.code, LEGAL_SLUGS[l.code][kind]) }));
  return `${head(t, { title: `${title} | Klarseite Studio`, description: `${title} – Klarseite Studio`, path: url(t.code, LEGAL_SLUGS[t.code][kind]), alternates, robots: 'noindex,follow' })}
</head>
<body>
${SPRITE}
${header(t, kind)}
<main id="main" class="legal">
  <div class="wrap legal-wrap">
    <a class="back" href="${url(t.code)}">← ${esc(t.legal.back)}</a>
    <h1>${esc(title)}</h1>
    <p class="placeholder-flag">${esc(t.legal.placeholder)}</p>
    ${blocks.map(([h, b]) => `<section><h2>${esc(h)}</h2>${fill(b)}</section>`).join('\n    ')}
  </div>
</main>
${footer(t)}
<script type="application/json" id="i18n-data">${JSON.stringify({ open: t.nav.menu, close: t.nav.close })}</script>
<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

for (const t of LANGS) {
  out(`${t.code}/index.html`, home(t));
  out(`${t.code}/${LEGAL_SLUGS[t.code].impressum}/index.html`, legalPage(t, 'impressum'));
  out(`${t.code}/${LEGAL_SLUGS[t.code].privacy}/index.html`, legalPage(t, 'privacy'));
}

// Root: language-neutral entry that forwards to German (also handled server-side in vercel.json)
out('index.html', `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Klarseite Studio</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="${SITE.domain}/de/"><meta http-equiv="refresh" content="0; url=/de/">${LANGS.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${SITE.domain}/${l.code}/">`).join('')}<link rel="alternate" hreflang="x-default" href="${SITE.domain}/de/"></head><body><p><a href="/de/">Klarseite Studio – Deutsch</a> · <a href="/en/">English</a> · <a href="/hr/">Hrvatski</a></p></body></html>`);

// Sitemap with hreflang alternates
const today = new Date().toISOString().slice(0, 10);
const entry = (paths) => paths.map((p) => `  <url>\n    <loc>${SITE.domain}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n${paths.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.code}" href="${SITE.domain}${a.path}"/>`).join('\n')}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.domain}${paths[0].path}"/>\n  </url>`).join('\n');
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entry(LANGS.map((l) => ({ code: l.code, path: url(l.code) })))}
</urlset>
`);
out('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);

console.log('Built:', LANGS.map((l) => l.code).join(', '));
