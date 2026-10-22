// Ambiente: chão em grade + horizonte neon + partículas de dados subindo
(function () {
  const amb = document.createElement('div');
  amb.className = 'mar';
  amb.innerHTML = '<div class="raios"></div><div class="leito"></div>';
  document.body.prepend(amb);

  const qtd = window.innerWidth < 600 ? 16 : 30;
  for (let i = 0; i < qtd; i++) criarParticula(amb, Math.random() * -20);

  function criarParticula(alvo, atraso = 0, x) {
    const p = document.createElement('span');
    const t = 2 + Math.random() * 4;
    p.className = 'bolha';
    p.style.width = p.style.height = t + 'px';
    p.style.left = (x ?? Math.random() * 100) + '%';
    p.style.animationDuration = 8 + Math.random() * 12 + 's';
    p.style.animationDelay = atraso + 's';
    alvo.appendChild(p);
    return p;
  }

  // rajada de partículas (usada ao confirmar o voto)
  window.rajadaBolhas = function () {
    for (let i = 0; i < 40; i++) {
      const p = criarParticula(amb, Math.random() * 0.5, 30 + Math.random() * 40);
      p.style.animationDuration = 1.8 + Math.random() * 2 + 's';
      p.style.animationIterationCount = '1';
      setTimeout(() => p.remove(), 5000);
    }
  };
})();
