// Vercel serverless function: POST /api/contact
// Sends contact-form enquiries by email via Resend (https://resend.com).
//
// Required environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY     – API key from Resend (never put this in frontend code)
//   CONTACT_TO_EMAIL   – where enquiries are delivered, e.g. info@klarseitestudio.online
//   CONTACT_FROM_EMAIL – verified sender on your Resend domain, e.g. "Klarseite Studio <anfrage@klarseitestudio.online>"
// Optional:
//   ALLOWED_ORIGIN     – e.g. https://klarseitestudio.online (requests from other origins are rejected)

const MIN_FILL_MS = 3000;           // submissions faster than this are treated as bots
const RATE_LIMIT = 5;               // max requests per IP per window (best effort, per instance)
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (s, n) => String(s ?? '').trim().slice(0, n);

function validate(b) {
  const errors = [];
  if (clip(b.name, 120).length < 2) errors.push('name');
  if (clip(b.company, 160).length < 2) errors.push('company');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clip(b.email, 200))) errors.push('email');
  if (b.whatsapp && !/^\+?[0-9 ()\-/]{6,24}$/.test(clip(b.whatsapp, 40))) errors.push('whatsapp');
  if (clip(b.industry, 120).length < 2) errors.push('industry');
  if (clip(b.description, 3000).length < 20) errors.push('description');
  if (b.url) { try { const u = new URL(clip(b.url, 300)); if (!/^https?:$/.test(u.protocol)) errors.push('url'); } catch { errors.push('url'); } }
  if (b.consent !== true && b.consent !== 'on' && b.consent !== 'true') errors.push('consent');
  return errors;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }

  const origin = req.headers.origin;
  if (process.env.ALLOWED_ORIGIN && origin && origin !== process.env.ALLOWED_ORIGIN) {
    return res.status(403).json({ ok: false, error: 'forbidden' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const rec = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (rec.length >= RATE_LIMIT) return res.status(429).json({ ok: false, error: 'rate_limited' });
  rec.push(now); hits.set(ip, rec);

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};

  // Spam checks: honeypot field must be empty and the form must not be submitted instantly.
  const ts = Number(b.ts);
  if (b.website2 || !ts || now - ts < MIN_FILL_MS) {
    // Pretend success to bots without sending anything.
    return res.status(200).json({ ok: true });
  }

  const errors = validate(b);
  if (errors.length) return res.status(422).json({ ok: false, error: 'validation', fields: errors });

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form is not configured: set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.');
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const f = {
    Name: clip(b.name, 120), Unternehmen: clip(b.company, 160), 'E-Mail': clip(b.email, 200),
    WhatsApp: clip(b.whatsapp, 40) || '–', Branche: clip(b.industry, 120),
    'Gewünschte Sprache': clip(b.language, 10) || '–', 'Bestehende Website': clip(b.url, 300) || '–',
    'Seitensprache (Formular)': clip(b.locale, 5) || '–',
  };
  const desc = clip(b.description, 3000);
  const rows = Object.entries(f).map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6A6E77;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${esc(v)}</td></tr>`).join('');
  const html = `<div style="font-family:system-ui,Arial,sans-serif;color:#171A20;font-size:15px">
    <h2 style="margin:0 0 16px">Neue Anfrage über klarseitestudio.online</h2>
    <table style="border-collapse:collapse">${rows}</table>
    <h3 style="margin:20px 0 8px">Beschreibung</h3>
    <p style="white-space:pre-wrap;margin:0">${esc(desc)}</p>
    <p style="color:#6A6E77;font-size:12px;margin-top:24px">Datenschutzhinweise bestätigt: ja · ${new Date(now).toISOString()}</p>
  </div>`;
  const text = Object.entries(f).map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nBeschreibung:\n${desc}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL.split(',').map((s) => s.trim()),
        reply_to: f['E-Mail'],
        subject: `Website-Anfrage: ${f.Unternehmen} (${f.Branche})`,
        html, text,
      }),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text().catch(() => ''));
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact send failed', err);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
