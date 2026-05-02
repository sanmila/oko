/**
 * OKO — Lightweight Order Backend
 * Node.js HTTP server (no heavy frameworks)
 * Handles: static file serving + POST /api/order
 *
 * Usage:
 *   node server.js
 *
 * Env vars (create a .env file or set in your shell):
 *   PORT          — default 3000
 *   SMTP_HOST     — e.g. smtp.yandex.ru
 *   SMTP_PORT     — e.g. 465
 *   SMTP_USER     — your@email.ru
 *   SMTP_PASS     — your-password
 *   OWNER_EMAIL   — email that receives order notifications
 *   SITE_URL      — https://oko.co (used in email links)
 */

'use strict';

// ── Dependencies ──────────────────────────────────────────────
const http     = require('http');
const https    = require('https');
const fs       = require('fs');
const path     = require('path');
const url      = require('url');
const crypto   = require('crypto');

// ── Config ────────────────────────────────────────────────────
loadEnv('.env');

const PORT       = parseInt(process.env.PORT || '3000', 10);
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'hello@oko.co';
const SITE_URL   = process.env.SITE_URL     || 'https://oko.co';
const ORDERS_LOG = path.join(__dirname, 'orders.json');

// ── MIME types ────────────────────────────────────────────────
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.mp4':  'video/mp4',
    '.mov':  'video/quicktime',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
    '.ttf':  'font/ttf',
    '.otf':  'font/otf',
};

// ── Rate limiting (in-memory, per IP) ─────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT   = { windowMs: 60_000, max: 5 };   // 5 orders / minute / IP

function isRateLimited(ip) {
    const now  = Date.now();
    const rec  = rateLimitMap.get(ip) || { count: 0, start: now };
    if (now - rec.start > RATE_LIMIT.windowMs) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return false;
    }
    rec.count += 1;
    rateLimitMap.set(ip, rec);
    return rec.count > RATE_LIMIT.max;
}

// ── Sanitise: strip HTML tags, trim, limit length ─────────────
function sanitise(val, maxLen) {
    if (typeof val !== 'string') return '';
    return val.replace(/<[^>]*>/g, '').trim().slice(0, maxLen || 500);
}

// ── Read body ─────────────────────────────────────────────────
function readBody(req) {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', chunk => {
            raw += chunk;
            if (raw.length > 16_384) reject(new Error('Payload too large'));
        });
        req.on('end',   () => resolve(raw));
        req.on('error', reject);
    });
}

// ── Persist order to JSON log ─────────────────────────────────
function logOrder(order) {
    let orders = [];
    try { orders = JSON.parse(fs.readFileSync(ORDERS_LOG, 'utf8')); } catch {}
    orders.push(order);
    fs.writeFileSync(ORDERS_LOG, JSON.stringify(orders, null, 2), 'utf8');
}

// ── Email template renderer ───────────────────────────────────
function renderTemplate(templatePath, vars) {
    let tpl = fs.readFileSync(templatePath, 'utf8');
    Object.entries(vars).forEach(([k, v]) => {
        tpl = tpl.replaceAll(`{{${k}}}`, v || '—');
    });
    return tpl;
}

// ── Send email via SMTP (nodemailer if available, else raw SMTP)
async function sendEmail({ to, subject, html }) {
    // Try nodemailer first (installed separately)
    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host:   process.env.SMTP_HOST,
            port:   parseInt(process.env.SMTP_PORT || '465', 10),
            secure: (process.env.SMTP_PORT || '465') === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        await transporter.sendMail({
            from: `"OKO" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        return true;
    } catch (err) {
        console.error('[MAIL ERROR]', err.message);
        return false;
    }
}

// ── /api/order handler ────────────────────────────────────────
async function handleOrder(req, res) {
    // CORS preflight
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    if (req.method !== 'POST') { jsonError(res, 405, 'Method Not Allowed'); return; }

    // Rate limit
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    if (isRateLimited(ip)) { jsonError(res, 429, 'Too many requests. Please wait a minute.'); return; }

    // Parse body
    let body;
    try {
        const raw = await readBody(req);
        body = JSON.parse(raw);
    } catch {
        jsonError(res, 400, 'Invalid request body'); return;
    }

    // Validate & sanitise
    const name    = sanitise(body.name,    80);
    const phone   = sanitise(body.phone,   30);
    const email   = sanitise(body.email,   100);
    const comment = sanitise(body.comment, 500);

    if (!name || !phone || !email) {
        jsonError(res, 422, 'Name, phone and email are required'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        jsonError(res, 422, 'Invalid email address'); return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
        jsonError(res, 422, 'Invalid phone number'); return;
    }

    // Build order record
    const order = {
        id:      crypto.randomBytes(6).toString('hex').toUpperCase(),
        date:    new Date().toISOString(),
        name, phone, email, comment,
        product: 'ОкО — №001',
        price:   '24 900 ₽',
        ip,
    };

    // Log to file
    logOrder(order);
    console.log(`[ORDER] ${order.date} | ${order.id} | ${name} | ${phone} | ${email}`);

    // Prepare template vars
    const tplVars = {
        name,
        phone,
        email,
        comment: comment || 'Не указан',
        date:    new Date(order.date).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
        orderId: order.id,
        siteUrl: SITE_URL,
    };

    const ownerTplPath  = path.join(__dirname, 'emails', 'email-owner.html');
    const clientTplPath = path.join(__dirname, 'emails', 'email-client.html');

    // Send both emails in parallel (fire & forget on email errors)
    const emailPromises = [];

    if (fs.existsSync(ownerTplPath)) {
        emailPromises.push(
            sendEmail({
                to:      OWNER_EMAIL,
                subject: `🛎 Новая заявка OKO — ${name} (${order.id})`,
                html:    renderTemplate(ownerTplPath, tplVars),
            })
        );
    }

    if (fs.existsSync(clientTplPath)) {
        emailPromises.push(
            sendEmail({
                to:      email,
                subject: 'Ваша заявка на ОкО принята',
                html:    renderTemplate(clientTplPath, tplVars),
            })
        );
    }

    // Don't block the response on email sending
    Promise.all(emailPromises).catch(err => console.error('[EMAIL BATCH]', err));

    // Respond success
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, orderId: order.id }));
}

// ── Static file server ────────────────────────────────────────
function serveStatic(req, res) {
    let filePath = req.url.split('?')[0];

    // Route /creator → creator.html, etc.
    const PAGE_MAP = {
        '/':        '/index.html',
        '/creator': '/creator.html',
        '/theory':  '/theory.html',
        '/privacy': '/privacy.html',
        '/terms':   '/terms.html',
    };
    if (PAGE_MAP[filePath]) filePath = PAGE_MAP[filePath];

    const absPath = path.join(__dirname, filePath);
    const ext     = path.extname(absPath).toLowerCase();

    // Security: prevent path traversal
    if (!absPath.startsWith(__dirname)) {
        res.writeHead(403); res.end('Forbidden'); return;
    }

    fs.stat(absPath, (err, stat) => {
        if (err || !stat.isFile()) {
            // 404 — serve index.html as SPA fallback
            const idx = path.join(__dirname, 'index.html');
            fs.readFile(idx, (e2, data) => {
                if (e2) { res.writeHead(404); res.end('Not found'); return; }
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            });
            return;
        }

        const mime    = MIME[ext] || 'application/octet-stream';
        const headers = { 'Content-Type': mime };

        // Cache: 1 year for immutable assets, 0 for HTML
        if (['.html'].includes(ext)) {
            headers['Cache-Control'] = 'no-cache, must-revalidate';
        } else if (['.mp4', '.mov'].includes(ext)) {
            headers['Cache-Control']   = 'public, max-age=86400';
            headers['Accept-Ranges']   = 'bytes';
        } else {
            headers['Cache-Control'] = 'public, max-age=31536000, immutable';
        }

        // Range support for video
        const rangeHeader = req.headers['range'];
        if (rangeHeader && ['.mp4', '.mov'].includes(ext)) {
            const fileSize = stat.size;
            const [startStr, endStr] = rangeHeader.replace('bytes=', '').split('-');
            const start = parseInt(startStr, 10);
            const end   = endStr ? parseInt(endStr, 10) : Math.min(start + 1_048_576, fileSize - 1);
            const chunkSize = end - start + 1;

            res.writeHead(206, {
                ...headers,
                'Content-Range':  `bytes ${start}-${end}/${fileSize}`,
                'Content-Length': chunkSize,
            });
            fs.createReadStream(absPath, { start, end }).pipe(res);
            return;
        }

        headers['Content-Length'] = stat.size;
        res.writeHead(200, headers);
        fs.createReadStream(absPath).pipe(res);
    });
}

// ── Helpers ───────────────────────────────────────────────────
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function jsonError(res, code, message) {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: message }));
}

// ── .env loader (no dotenv dependency) ────────────────────────
function loadEnv(file) {
    try {
        const lines = fs.readFileSync(path.join(__dirname, file), 'utf8').split('\n');
        lines.forEach(line => {
            const m = line.match(/^([A-Z_]+)\s*=\s*(.*)$/);
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
        });
    } catch {}
}

// ── Main request router ───────────────────────────────────────
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (parsedUrl.pathname === '/api/order') {
        handleOrder(req, res).catch(err => {
            console.error('[UNHANDLED]', err);
            jsonError(res, 500, 'Internal server error');
        });
    } else {
        serveStatic(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`\n  ┌──────────────────────────────────────┐`);
    console.log(`  │  OKO Server running on port ${PORT}     │`);
    console.log(`  │  http://localhost:${PORT}              │`);
    console.log(`  │  Orders log: orders.json             │`);
    console.log(`  │  SMTP: ${process.env.SMTP_HOST || 'NOT CONFIGURED ⚠'}  │`);
    console.log(`  └──────────────────────────────────────┘\n`);
});

server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[ERROR] Port ${PORT} already in use. Set PORT= in .env`);
    } else {
        console.error('[SERVER ERROR]', err);
    }
    process.exit(1);
});

// ── Graceful shutdown ─────────────────────────────────────────
['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
        console.log(`\n[${sig}] Shutting down…`);
        server.close(() => process.exit(0));
    });
});
