# API Poe Easy Build (Next.js)

Servidor Next.js com a rota **POST /api/generate-build** que gera um guia de build (incluindo **passivas**) usando dados do `poe2_data.json` e a **[OpenRouter](https://openrouter.ai/docs/quickstart)** (um único endpoint para vários modelos de IA).

## Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` e adicione sua API Key da OpenRouter:
   ```
   OPENROUTER_API_KEY=sua_chave_aqui
   ```
   Obtenha a chave em: https://openrouter.ai/keys  
   Documentação: https://openrouter.ai/docs/quickstart

3. (Opcional) No `.env` você pode definir:
   - **OPENROUTER_SITE_URL** — URL do seu site (para ranking no OpenRouter). Ex: `https://seu-app.vercel.app`
   - **OPENROUTER_MODEL** — modelo a usar. Padrão: `google/gemini-2.0-flash-exp:free`. Lista: https://openrouter.ai/models

4. Instale as dependências e rode:
   ```bash
   npm install
   npm run dev
   ```

A API estará em **http://localhost:3000**.

## Uso da rota

- **POST /api/generate-build**  
  Body (JSON): `{ "classe": "Ranger", "arma": "Lança", "estilo": "Veneno" }`  
  Resposta: `{ "success": true, "guide": "...", "dataUsed": { ... } }`  
  O campo `guide` inclui skill principal, gemas, modificadores, **passivas sugeridas** e dica de ouro.

- **GET /api/generate-build**  
  Retorna instruções e exemplo de body.

## Arquivos

- `app/api/generate-build/route.ts` — lê `poe2_data.json`, filtra por classe/arma/estilo, monta o prompt e chama a OpenRouter.
- `poe2_data.json` — dados locais no estilo PoE2DB (skill gems, support gems, modifiers, **passives**, styles).

A API Key é lida somente de `process.env.OPENROUTER_API_KEY` (arquivo `.env`); nunca é exposta ao frontend.
