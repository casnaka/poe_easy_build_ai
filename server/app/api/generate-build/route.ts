import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface Poe2Data {
  skillGems: Array<{
    id: string
    name: string
    slug: string
    tags: string[]
    weaponTypes: string[]
    description: string
  }>
  supportGems: Array<{
    id: string
    name: string
    slug: string
    tags: string[]
    weaponTypes: string[]
  }>
  modifiers: Array<{ name: string; category: string }>
  passives?: Array<{ name: string; category: string; description: string }>
  styles: Record<string, string[]>
}

async function loadPoe2Data(): Promise<Poe2Data> {
  const dataPath = path.join(process.cwd(), 'poe2_data.json')
  const raw = await readFile(dataPath, 'utf-8')
  return JSON.parse(raw) as Poe2Data
}

function filterDataByBuild(
  data: Poe2Data,
  classe: string,
  arma: string,
  estilo: string
) {
  const styleTags = data.styles[estilo] ?? [estilo]
  const armaNorm = arma.toLowerCase().replace(/\s/g, '')
  const weaponMatch = (w: string) =>
    w.toLowerCase().replace(/\s/g, '').includes(armaNorm) ||
    armaNorm.includes(w.toLowerCase())

  const skills = data.skillGems.filter(
    (s) =>
      s.weaponTypes.some(weaponMatch) &&
      (styleTags.some((t) => s.tags.includes(t)) || s.tags.some((t) => styleTags.includes(t)))
  )
  const supports = data.supportGems.filter(
    (g) =>
      g.weaponTypes.some(weaponMatch) &&
      (styleTags.some((t) => g.tags.includes(t)) || g.tags.some((t) => styleTags.includes(t)))
  )
  const mods = data.modifiers
  const passives = data.passives ?? []

  return {
    skillGems: skills.length ? skills : data.skillGems.filter((s) => s.weaponTypes.some(weaponMatch)),
    supportGems: supports.length ? supports : data.supportGems.filter((g) => g.weaponTypes.some(weaponMatch)),
    modifiers: mods,
    passives,
  }
}

async function callOpenRouter(
  prompt: string,
  apiKey: string,
  siteUrl: string,
  model: string
): Promise<string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': siteUrl,
    'X-OpenRouter-Title': 'Poe Easy Build AI',
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter: ${res.status} - ${err}`)
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> }
  const content = data.choices?.[0]?.message?.content
  if (typeof content !== 'string') throw new Error('Resposta da IA sem conteúdo')
  return content
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY não configurada. Crie um arquivo .env com OPENROUTER_API_KEY=sua_chave (veja https://openrouter.ai/docs/quickstart)' },
        { status: 500 }
      )
    }

    const siteUrl = process.env.OPENROUTER_SITE_URL ?? 'https://openrouter.ai/docs/quickstart'
    const model = process.env.OPENROUTER_MODEL ?? 'z-ai/glm-4.5-air:free'

    const body = (await request.json()) as {
      classe?: string
      arma?: string
      estilo?: string
      class?: string
      weapon?: string
      style?: string
    }
    const classe = (body.classe ?? body.class ?? '').trim()
    const arma = (body.arma ?? body.weapon ?? '').trim()
    const estilo = (body.estilo ?? body.style ?? '').trim()

    if (!classe || !arma || !estilo) {
      return NextResponse.json(
        { error: 'Envie classe, arma e estilo no body (JSON). Ex: { "classe": "Ranger", "arma": "Lança", "estilo": "Veneno" }' },
        { status: 400 }
      )
    }

    const data = await loadPoe2Data()
    const filtered = filterDataByBuild(data, classe, arma, estilo)

    const prompt = `Você é um guia de builds para Path of Exile 2. Abaixo estão dados reais do PoE2DB (skills, gemas de suporte, modificadores e passivas) filtrados para: Classe ${classe}, Arma ${arma}, Estilo ${estilo}.

## Dados do PoE2DB (use APENAS estes nomes e informações)

### Skill Gems compatíveis
${JSON.stringify(filtered.skillGems, null, 2)}

### Support Gems compatíveis
${JSON.stringify(filtered.supportGems, null, 2)}

### Modificadores de itens recomendados
${JSON.stringify(filtered.modifiers, null, 2)}

### Passivas (árvore passiva) disponíveis — use TODAS na montagem do fluxo
${JSON.stringify(filtered.passives, null, 2)}

---

Com base APENAS nesses dados, crie um guia completo em português do Brasil para um iniciante jogando **${classe} de ${estilo} com ${arma}**. Responda em Markdown, com as seções abaixo na ordem.

1. **Skill principal:** uma skill recomendada (nome exato do JSON) e por quê.
2. **Gemas de suporte:** até 3 (nomes exatos do JSON).
3. **Modificadores nos itens:** quais priorizar (nomes do JSON).
4. **Fluxo de passivas (ordem de progressão):** monte o caminho que a pessoa deve seguir na árvore passiva. Use TODAS as passivas listadas acima, na ordem em que o jogador deve pegá-las (1, 2, 3...). Para cada uma: nome exato + uma linha explicando por que nessa ordem (ex.: "1. Heart of the Warrior — vida primeiro para não morrer; 2. Fatal Toxins — ...").
5. **Itens por fase do jogo:** o que a pessoa deve usar em cada fase. Para cada fase, sugira por slot (arma, armadura, elmo, luvas, botas, cinto, acessórios) e quais modificadores priorizar. Use apenas modificadores e categorias dos dados acima.
   - **Early game** (início da campanha)
   - **Mid game** (meio da campanha / mapas iniciais)
   - **Late game** (endgame / mapas altos)
6. **Dica de ouro:** uma frase final para o iniciante.

Seja direto e use somente nomes e informações que existem nos dados. Formate com títulos em Markdown (## e ###).`

    const text = await callOpenRouter(prompt, apiKey, siteUrl, model)

    return NextResponse.json({
      success: true,
      guide: text,
      dataUsed: {
        skillGems: filtered.skillGems.length,
        supportGems: filtered.supportGems.length,
        modifiers: filtered.modifiers.length,
        passives: filtered.passives.length,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: 'Erro ao gerar build: ' + message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST com body JSON: { "classe": "Ranger", "arma": "Lança", "estilo": "Veneno" }',
    example: { classe: 'Ranger', arma: 'Lança', estilo: 'Veneno' },
  })
}
