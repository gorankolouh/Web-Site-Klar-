# Klarseite Studio – Website

Multilingual (DE / EN / HR) static website with a Vercel serverless contact form.

```
/de/  /en/  /hr/           Homepages (German is the default; "/" redirects to /de/)
/de/impressum/ …           Legal pages per language (placeholders – noindex until filled in)
/api/contact.js            Serverless function that emails form enquiries via Resend
/assets/css, js, img, fonts
/scripts/i18n.mjs          ALL site text in all three languages – edit here
/scripts/build.mjs         Generates the HTML pages, sitemap.xml and robots.txt
vercel.json                Redirects, security headers (CSP), caching
```

The generated HTML is already committed, so Vercel needs **no build step**. After editing text, run `node scripts/build.mjs` and redeploy.

## Before going live – checklist

1. **Font:** download `InterVariable.woff2` from https://rsms.me/inter/ and place it in `assets/fonts/`. (Self-hosted on purpose: loading Google Fonts from Google's servers is a known GDPR risk in Germany.) Without it, the site falls back to the system font.
2. **Contact form (required):**
   - Create a free account at https://resend.com, add and verify the domain `klarseitestudio.online` (DNS records).
   - In Vercel → Project → Settings → Environment Variables, set:
     - `RESEND_API_KEY` – your Resend API key
     - `CONTACT_TO_EMAIL` – `info@klarseitestudio.online`
     - `CONTACT_FROM_EMAIL` – e.g. `Klarseite Studio <anfrage@klarseitestudio.online>`
     - `ALLOWED_ORIGIN` – `https://klarseitestudio.online`
   - Until these are set, the form shows an honest error and points visitors to WhatsApp/email. It never shows a fake success.
   - Note: `info@klarseitestudio.online` must be a real mailbox (Resend only sends; it does not receive mail).
3. **Legal pages:** fill in `legal.impressum` and `legal.privacy` in `scripts/i18n.mjs` (name, address, VAT/OIB, responsible person, retention periods, Vercel/Resend processor details). Then remove `robots: 'noindex,follow'` in `legalPage()` in `build.mjs` if you want them indexed.
4. **Your business terms** – the copy deliberately says these are "confirmed in writing before you order". Decide and, ideally, state them on the site:
   - hosting model and any recurring cost
   - domain renewal price from year 2, eligible extensions, in whose name the domain is registered
   - number of revision rounds and content limit (e.g. sections, images)
   - payment method and timing; ownership and handover
5. **WhatsApp:** number is set in `SITE.whatsapp` in `scripts/i18n.mjs` (`385919002057`).

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Vercel → Add New → Project → import the repo. Framework preset: **Other**. No build command, output directory: root.
3. Add the environment variables above, deploy.
4. Vercel → Settings → Domains → add `klarseitestudio.online` and follow the DNS instructions.
5. Submit `https://klarseitestudio.online/sitemap.xml` in Google Search Console.

## What's built in

- Language-specific URLs, `hreflang` (incl. `x-default`), canonical URLs, Open Graph per language, social image (`assets/img/og-image.png`).
- The language switcher keeps the visitor on the same section.
- Structured data: Organization, WebSite, Service/Offer (€99) and FAQPage – no address or LocalBusiness data is invented.
- Accessible: skip link, labelled form fields, keyboard-friendly mobile menu (Esc closes), `prefers-reduced-motion` respected.
- Spam protection: honeypot field, minimum fill time, per-IP rate limit, origin check.
- No cookies, no tracking, no external requests → no cookie banner needed. If you later add analytics or ads pixels, you will need a consent solution.
- Portfolio and hero mockups are pure HTML/CSS, clearly labelled as fictional design examples.
