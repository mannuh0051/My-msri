export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Idempotency-Key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.PAYLOR_API_KEY;
  const channelId = process.env.PAYLOR_CHANNEL_ID || 'PAYL-FFJZR5';

  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: PAYLOR_API_KEY not set' });
  }

  if (req.method === 'POST') {
    const { phone, amount, reference, description } = req.body || {};
    if (!phone || amount == null || !reference) {
      return res.status(400).json({ error: 'Missing required fields: phone, amount, reference' });
    }

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount < 1 || numAmount > 150000) {
      return res.status(400).json({ error: 'Amount must be between 1 and 150,000 KES' });
    }

    let normalised = String(phone).replace(/[\s+]/g, '');
    if (normalised.startsWith('0')) normalised = '254' + normalised.slice(1);
    if (!/^254[17]\d{8}$/.test(normalised)) {
      return res.status(400).json({ error: 'Invalid phone. Use 254XXXXXXXXX (e.g. 254712345678)' });
    }

    try {
      const response = await fetch('https://api.paylorke.com/api/v1/merchants/payments/stk-push', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: normalised,
          amount: numAmount,
          reference,
          channelId,
          description: description || 'Payment'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || data.error || data.details?.message || `Paylor error (${response.status})`,
          raw: data
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error('[pay] STK push failed:', err);
      return res.status(502).json({ error: 'Payment gateway unreachable. Try again.' });
    }
  }

  if (req.method === 'GET') {
    const { transactionId } = req.query;
    if (!transactionId) return res.status(400).json({ error: 'Missing transactionId' });

    try {
      const response = await fetch(
        `https://api.paylorke.com/api/v1/merchants/payments/transactions/${encodeURIComponent(transactionId)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || data.error || `Query failed (${response.status})`,
          raw: data
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error('[pay] Transaction query failed:', err);
      return res.status(502).json({ error: 'Payment gateway unreachable.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
