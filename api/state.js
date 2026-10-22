// GET /api/state  -> status da votação + equipes (público)
import { TEAMS } from './_lib/teams.js';
import { getState, send } from './_lib/store.js';

export default async function handler(req, res) {
  try {
    const state = await getState();
    send(res, 200, { ...state, teams: TEAMS });
  } catch (e) {
    send(res, 500, { error: 'Falha ao ler o estado: ' + e.message });
  }
}
