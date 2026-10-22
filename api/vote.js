// POST /api/vote  { team: '1', voterId: 'uuid' }
// Um voto por aparelho (cookie + id salvo no navegador) por rodada.
import crypto from 'node:crypto';
import { TEAM_IDS } from './_lib/teams.js';
import { K, getState, redis, send } from './_lib/store.js';

function readCookie(req, name) {
  const m = (req.headers.cookie || '').match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Use POST' });

  try {
    const body = await readBody(req);
    const team = String(body.team || '');
    if (!TEAM_IDS.includes(team)) return send(res, 400, { error: 'Equipe inválida.' });

    const { status, round } = await getState();
    if (status !== 'open') return send(res, 403, { error: 'A votação não está aberta.', code: 'closed' });

    const clean = (v) => (typeof v === 'string' && /^[\w-]{8,64}$/.test(v) ? v : null);
    const voterId = clean(readCookie(req, 'syn_vid')) || clean(body.voterId) || crypto.randomUUID();

    res.setHeader(
      'Set-Cookie',
      `syn_vid=${voterId}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; HttpOnly; Secure`
    );

    // SET NX: só grava se esse aparelho ainda não votou nesta rodada
    const ok = await redis('SET', K.voter(round, voterId), team, 'NX', 'EX', 60 * 60 * 48);
    if (ok === null) {
      const votedTeam = await redis('GET', K.voter(round, voterId));
      return send(res, 409, { error: 'Este aparelho já votou.', code: 'already', round, team: votedTeam });
    }

    await redis('INCR', K.votes(round, team));
    send(res, 200, { ok: true, team, round });
  } catch (e) {
    send(res, 500, { error: 'Falha ao registrar o voto: ' + e.message });
  }
}
