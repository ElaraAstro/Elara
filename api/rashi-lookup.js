// api/rashi-lookup.js
import { computeRashi } from './rashi.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { birth } = req.body || {};
  try {
    if (!birth || !birth.year || !birth.month || !birth.day) {
      return res.status(400).json({ error: 'Birth date is required' });
    }
    const hasTime = birth.hour !== undefined && birth.hour !== null && birth.hour !== '';
    const h = hasTime ? Number(birth.hour) : 12;
    const m = hasTime && birth.minute !== undefined && birth.minute !== '' ? Number(birth.minute) : 0;
    const result = computeRashi(Number(birth.year), Number(birth.month), Number(birth.day), h, m);
    return res.status(200).json({ rashi: result.rashi });
  } catch (e) {
    console.error('rashi-lookup error:', e);
    return res.status(500).json({ error: 'Could not compute rashi' });
  }
}
