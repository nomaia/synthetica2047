// ============================================================
//  EDITE AQUI as equipes que vão concorrer.
//  - id: não mude depois que a votação começar
//  - url: link do portal publicado (opcional, deixe '' para esconder)
//  - cor: cor de destaque do card / barra do placar
// ============================================================
export const TEAMS = [
  {
    id: '1',
    equipe: 'Equipe 1',
    portal: 'Time A', // nome do time (aparece em destaque)
    descricao: '', // opcional: slogan do portal
    url: '',
    cor: '#22e1ff', // ciano neon
  },
  {
    id: '2',
    equipe: 'Equipe 2',
    portal: 'Time B', // nome do time (aparece em destaque)
    descricao: '', // opcional: slogan do portal
    url: '',
    cor: '#ff3df2', // magenta neon
  },
  {
    id: '3',
    equipe: 'Equipe 3',
    portal: 'Time C', // nome do time (aparece em destaque)
    descricao: '', // opcional: slogan do portal
    url: '',
    cor: '#c6ff3d', // verde ácido
  },
];

export const TEAM_IDS = TEAMS.map((t) => t.id);
