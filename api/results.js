// GET /api/results  (header x-admin-key)  -> placar
import { TEAMS, TEAM_IDS } from './_lib/teams.js';
import { getCounts, getState, isAdmin, send, usingMemory } from './_lib/store.js';

export default async function handler(req, res) {
  if (!isAdmin(req)) return send(res, 401, { error: 'Senha incorreta.' });
  try {
    const state = await getState();
    const counts = await getCounts(state.round, TEAM_IDS);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    send(res, 200, { ...state, counts, total, teams: TEAMS, memoryMode: usingMemory });
  } catch (e) {
    send(res, 500, { error: 'Falha ao ler o placar: ' + e.message });
  }
}
