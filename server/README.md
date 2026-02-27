# API Poe Easy Build (Next.js)

Servidor Next.js com a rota **POST /api/generate-build** que gera um guia de build usando dados do `poe2_data.json` e a **Google Gemini API**.

## Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` e adicione sua API Key do Google Gemini:
   ```
   GEMINI_API_KEY=sua_chave_aqui
   ```
   Obtenha a chave em: https://aistudio.google.com/app/apikey

3. Instale as dependências e rode:
   ```bash
   npm install
   npm run dev
   ```

A API estará em **http://localhost:3000**.

## Uso da rota

- **POST /api/generate-build**  
  Body (JSON): `{ "classe": "Ranger", "arma": "Lança", "estilo": "Veneno" }`  
  Resposta: `{ "success": true, "guide": "...", "dataUsed": { ... } }`

- **GET /api/generate-build**  
  Retorna instruções e exemplo de body.

## Arquivos

- `app/api/generate-build/route.ts` — lê `poe2_data.json`, filtra por classe/arma/estilo, monta o prompt e chama o Gemini.
- `poe2_data.json` — dados locais no estilo PoE2DB (skill gems, support gems, modifiers, styles).

A API Key é lida somente de `process.env.GEMINI_API_KEY` (arquivo `.env`); nunca é exposta ao frontend.
