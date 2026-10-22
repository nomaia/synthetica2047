# VR CODE ARENA · SYNTHETICA 2047 — Votação do público

Plataforma simples de votação (3 equipes) com tema futurista neon (2047), pronta para a Vercel.
Sem framework e sem dependências: HTML/CSS/JS estático + funções serverless em `/api`.

## Páginas

| URL | Para quem | O que faz |
|---|---|---|
| `/` | Público (QR Code) | Mostra as 3 equipes; toque → confirma → voto registrado. 1 voto por aparelho. |
| `/desafio` | Telão | Chamada do CODE DROP (moodboard 2047) com inspiração na tela, sem rolagem. |
| `/resultados` | Organização / telão | Pede senha. Mostra QR Code, placar ao vivo (tanques de água enchendo), abrir/encerrar votação, ocultar placar e zerar. |

A votação começa **fechada**. Os celulares do público atualizam sozinhos quando você clicar em **Abrir votação**.

## 1. Editar as equipes

Abra `api/_lib/teams.js` e troque o nome de cada time no campo `portal` (Time A, B, C). Descrição, link e cor são opcionais.

## 2. Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New → Project** → importe o repositório → Framework Preset: **Other** → Deploy.
3. No projeto, aba **Storage → Create Database → Upstash (Redis)** → plano gratuito → **Connect** ao projeto.
   Isso cria sozinho as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
4. Em **Settings → Environment Variables**, crie `ADMIN_PASSWORD` com a senha do painel.
5. Vá em **Deployments → ⋯ → Redeploy** para aplicar as variáveis.

Pronto: o QR Code exibido em `/resultados` já aponta para o domínio do site.

## No dia

1. Abra `/resultados` no telão e entre com a senha.
2. Se quiser suspense, clique em **Ocultar placar** (o QR continua visível).
3. **Abrir votação** → público vota → **Encerrar votação** → **Mostrar placar**. A coroa 👑 aparece no vencedor quando a votação está encerrada.
4. **Zerar e nova rodada** apaga o placar e libera todos para votar de novo (útil para teste antes do evento).

## Observações

- Controle de voto: 1 voto por aparelho via cookie + identificador no navegador. Quem abrir uma aba anônima consegue votar de novo — para um público pequeno e presencial, é o equilíbrio entre simplicidade e controle.
- Sem o banco conectado, o sistema roda em "modo de teste" (votos na memória, podem sumir) e a senha padrão é `synthetica`. Um aviso aparece no painel.
- Teste local: `npm i -g vercel` e `vercel dev`.
