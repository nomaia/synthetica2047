// POST /api/admin  (header x-admin-key)  { action: 'open' | 'close' | 'reset' }
import { K, getState, isAdmin, redis, send } from './_lib/store.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Use POST' });
  if (!isAdmin(req)) return send(res, 401, { error: 'Senha incorreta.' });

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    if (!body || typeof body !== 'object') {
      let raw = '';
      for await (const c of req) raw += c;
      body = raw ? JSON.parse(raw) : {};
    }

    const { round } = await getState();
    switch (body.action) {
      case 'open':
        await redis('SET', K.status, 'open');
        break;
      case 'close':
        await redis('SET', K.status, 'closed');
        break;
      case 'reset':
        // nova rodada: placar zerado e todos podem votar de novo
        await redis('SET', K.round, String(round + 1));
        await redis('SET', K.status, 'closed');
        break;
      default:
        return send(res, 400, { error: 'Ação inválida.' });
    }
    send(res, 200, { ok: true, ...(await getState()) });
  } catch (e) {
    send(res, 500, { error: 'Falha na ação: ' + e.message });
  }
}
