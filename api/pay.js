// api/pay.js
const PAYLOR_BASE = 'https://api.paylorke.com/api/v1/merchants/payments';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const apiKey = process.env.PAYLOR_API_KEY;
  const channelId = process.env.PAYLOR_CHANNEL_ID;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: PAYLOR_API_KEY missing' });
  }

  const authHeaders = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  // ---------- STK PUSH ----------
  if (req.method === 'POST' && req.url.includes('/pay')) {
    const { phone, amount, reference, description } = req.body || {};

    if (!phone || !amount || !reference) {
      return res.status(400).json({
        error: 'Missing required fields: phone, amount, reference',
      });
    }

    // Normalise: strip spaces/+, accept 07XX / 2547XX
    let normalised = String(phone).replace(/[\s+]/g, '');
    if (normalised.startsWith('0')) normalised = '254' + normalised.slice(1);

    if (!/^254[17]\d{8}$/.test(normalised)) {
      return res.status(400).json({
        error: 'Invalid phone number. Use format 254712345678',
      });
    }

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount < 1 || numAmount > 150000) {
      return res.status(400).json({
        error: 'Amount must be a number between 1 and 150,000 KES',
      });
    }

    const payload = {
      phone: normalised,
      amount: numAmount,
      reference: String(reference),
      description: description || 'Payment',
      ...(channelId ? { channelId } : {}),
    };

    // Optional idempotency support
    const idem = req.headers['idempotency-key'];
    if (idem) authHeaders['Idempotency-Key'] = idem;

    try {
      const upstream = await fetch(`${PAYLOR_BASE}/stk-push`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await upstream.json().catch(() => ({}));

      if (!upstream.ok) {
        return res.status(upstream.status).json({
          error:
            data.message ||
            data.error ||
            data.details?.message ||
            `Paylor error (${upstream.status})`,
          raw: data,
        });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error('[pay] STK push network error:', err);
      return res.status(502).json({
        error: 'Payment gateway unreachable. Please try again.',
      });
    }
  }

  // ---------- TRANSACTION QUERY ----------
  if (req.method === 'GET') {
    const { transactionId, limit, offset, flow } = req.query || {};

    const qs = new URLSearchParams();
    if (limit) qs.set('limit', limit);
    if (offset) qs.set('offset', offset);
    if (flow) qs.set('flow', flow);

    const path = transactionId
      ? `${PAYLOR_BASE}/transactions/${encodeURIComponent(transactionId)}`
      : `${PAYLOR_BASE}/transactions?${qs.toString()}`;

    try {
      const upstream = await fetch(path, {
        method: 'GET',
        headers: authHeaders,
      });
      const data = await upstream.json().catch(() => ({}));

      if (!upstream.ok) {
        return res.status(upstream.status).json({
          error:
            data.message ||
            data.error ||
            data.details?.message ||
            `Paylor error (${upstream.status})`,
          raw: data,
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error('[pay] Transaction query network error:', err);
      return res.status(502).json({ error: 'Payment gateway unreachable.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
