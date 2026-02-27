# Poe Easy Build AI

Assistente de builds para **Path of Exile 1** e **Path of Exile 2**, focado em jogadores iniciantes. Você escolhe o jogo, a classe, a arma e o foco (dano em área, sobrevivência ou velocidade) e recebe uma recomendação com skill principal, gemas de suporte, status prioritários nos itens e uma dica de ouro — tudo com links para as páginas oficiais das gemas nas bases de dados do jogo.

## O que o projeto faz

- **Escolha do jogo:** PoE 1 ([poedb.tw](https://poedb.tw/us/)) ou PoE 2 ([poe2db.tw](https://poe2db.tw/us/)).
- **Wizard em 4 passos:** Jogo → Classe → Arma → Foco.
- **Recomendação gerada a partir de dados locais:** skill principal, 3 gemas de suporte, modificadores de itens (prefixos/sufixos) para priorizar e uma dica curta para não quebrar a build.
- **Links externos:** cada gema e a skill principal têm link para a página correspondente na base do jogo escolhido (poedb.tw para PoE 1, poe2db.tw para PoE 2).

## Tecnologias

- **React** + **TypeScript**
- **Vite** (build e dev server)
- **Tailwind CSS** (estilo)
- **Lucide React** (ícones)

A interface é em dark mode inspirado na estética de PoE (dourado, cinza escuro, vermelho sangue), responsiva e com animações leves entre os passos do wizard.

## Como rodar

```bash
# Instalar dependências
npm install

# Desenvolvimento (abre em http://localhost:5173)
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## Estrutura do projeto

```
src/
├── components/
│   └── PoeBuildGenerator.tsx   # Wizard e tela de resultado
├── data/
│   ├── buildRecommendations.ts # Tipos e getBuildRecommendation(game, classe, arma, foco)
│   ├── buildData.ts            # Arquétipos populares (PoE 2)
│   ├── gameData.ts             # Dados e generateBuildFromData para PoE 2 (poe2db.tw)
│   └── gameDataPoe1.ts         # Dados e generateBuildFromDataPoe1 para PoE 1 (poedb.tw)
├── App.tsx
├── main.tsx
└── index.css
```

- **PoE 2:** skills e support gems com slugs do [poe2db.tw](https://poe2db.tw/us/); modificadores de itens no estilo PoE 2.
- **PoE 1:** skills e support gems com slugs do [poedb.tw](https://poedb.tw/us/); nomes de modificadores no estilo PoE 1.

A “IA” é simulada por filtros nos dados locais: a função `generateBuildFromData` (PoE 2) ou `generateBuildFromDataPoe1` (PoE 1) escolhe skill principal e gemas conforme arma e foco, e devolve modificadores recomendados para iniciantes.

## Licença

Uso livre para estudo e diversão. Path of Exile é marca da Grinding Gear Games. Este projeto não é oficial e não tem vínculo com a GGG.
