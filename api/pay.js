export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.PAYLOR_API_KEY || "pk_wfJ7Gna0GNzrF9HFwyWgTEQub_VEdmUL";
  const channelId = process.env.PAYLOR_CHANNEL_ID; // Omit if not explicitly configured so Paylor uses default active channel

  // 1. INITIATE STK PUSH (POST)
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON request body' });
      }
    }

    const { phone, amount, reference, description } = body || {};

    if (!phone || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required parameters: phone, amount, or reference' });
    }

    // Format phone to 254XXXXXXXXX
    let cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) cleanPhone = '254' + cleanPhone;
    if (!cleanPhone.startsWith('254')) cleanPhone = '254' + cleanPhone;

    const payload = {
      phone: cleanPhone,
      amount: Number(amount),
      reference: String(reference),
      description: description || 'M-Shwari Verification'
    };

    // Only attach channelId if provided and non-empty
    if (channelId && channelId.trim().length > 0) {
      payload.channelId = channelId.trim();
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('https://api.paylorke.com/api/v1/merchants/payments/stk-push', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || data.error || `Paylor STK error (${response.status})`,
          details: data
        });
      }

      return res.status(200).json(data);
    } catch (err) {
      clearTimeout(timeout);
      return res.status(500).json({
        error: err.name === 'AbortError' ? 'STK gateway request timed out' : err.message
      });
    }
  }

  // 2. QUERY TRANSACTION STATUS (GET)
  if (req.method === 'GET') {
    const { transactionId } = req.query || {};

    if (!transactionId) {
      return res.status(400).json({ error: 'Missing transactionId query parameter' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(
        `https://api.paylorke.com/api/v1/merchants/payments/transactions/${encodeURIComponent(transactionId)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeout);
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || 'Transaction query failed',
          details: data
        });
      }

      return res.status(200).json(data);
    } catch (err) {
      clearTimeout(timeout);
      return res.status(500).json({
        error: err.name === 'AbortError' ? 'Query gateway timed out' : err.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
