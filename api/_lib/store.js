// Acesso ao Redis (Upstash) via REST, sem dependências.
// Na Vercel, ao conectar um banco Upstash Redis pelo Marketplace,
// as variáveis KV_REST_API_URL e KV_REST_API_TOKEN são criadas sozinhas.
// Sem essas variáveis, usa memória local (apenas para teste em desenvolvimento).

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const usingMemory = !REDIS_URL || !REDIS_TOKEN;

const mem = (globalThis.__syntheticaMem ||= new Map());

function memCmd([op, ...a]) {
  switch (op.toUpperCase()) {
    case 'GET':
      return mem.has(a[0]) ? String(mem.get(a[0])) : null;
    case 'SET': {
      const nx = a.slice(2).map((x) => String(x).toUpperCase()).includes('NX');
      if (nx && mem.has(a[0])) return null;
      mem.set(a[0], String(a[1]));
      return 'OK';
    }
    case 'INCR': {
      const v = Number(mem.get(a[0]) || 0) + 1;
      mem.set(a[0], String(v));
      return v;
    }
    case 'MGET':
      return a.map((k) => (mem.has(k) ? String(mem.get(k)) : null));
    default:
      throw new Error('Comando não suportado em memória: ' + op);
  }
}

export async function redis(...command) {
  if (usingMemory) return memCmd(command);
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await r.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// ---- chaves ----
// "round" permite zerar a votação sem apagar chaves: cada rodada usa prefixo novo.
export const K = {
  status: 'syn:status', // 'open' | 'closed'
  round: 'syn:round',
  votes: (round, team) => `syn:r${round}:votes:${team}`,
  voter: (round, id) => `syn:r${round}:voter:${id}`,
};

export async function getState() {
  const [status, round] = await redis('MGET', K.status, K.round);
  return { status: status === 'open' ? 'open' : 'closed', round: Number(round || 1) };
}

export async function getCounts(round, ids) {
  const vals = await redis('MGET', ...ids.map((id) => K.votes(round, id)));
  const counts = {};
  ids.forEach((id, i) => (counts[id] = Number(vals[i] || 0)));
  return counts;
}

export function isAdmin(req) {
  const pass = process.env.ADMIN_PASSWORD || (usingMemory ? 'synthetica' : '');
  if (!pass) return false;
  return (req.headers['x-admin-key'] || '') === pass;
}

export function send(res, code, body) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
