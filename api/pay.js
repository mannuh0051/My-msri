export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Your Paylor Credentials
  const apiKey = process.env.PAYLOR_API_KEY || "pk_wfJ7Gna0GNzrF9HFwyWgTEQub_VEdmUL"; 
  const channelId = process.env.PAYLOR_CHANNEL_ID || "PAYL-FFJZR5";

  // --- INITIATE STK PUSH (POST) ---
  if (req.method === 'POST') {
    const { phone, amount, reference, description } = req.body || {};
    if (!phone || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const response = await fetch('https://api.paylorke.com/api/v1/merchants/payments/stk-push', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, amount, reference, channelId, description })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Paylor error');
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // --- CHECK STATUS (GET) ---
  if (req.method === 'GET') {
    const { transactionId } = req.query;
    if (!transactionId) return res.status(400).json({ error: 'Missing transactionId' });

    try {
      const response = await fetch(`https://api.paylorke.com/api/v1/merchants/payments/transactions/${transactionId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Query failed');
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}
