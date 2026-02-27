import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

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

  return {
    skillGems: skills.length ? skills : data.skillGems.filter((s) => s.weaponTypes.some(weaponMatch)),
    supportGems: supports.length ? supports : data.supportGems.filter((g) => g.weaponTypes.some(weaponMatch)),
    modifiers: mods,
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada. Crie um arquivo .env com GEMINI_API_KEY=sua_chave' },
        { status: 500 }
      )
    }

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

    const prompt = `Você é um guia de builds para Path of Exile 2. Abaixo estão dados reais do PoE2DB (skills, gemas de suporte e modificadores de itens) filtrados para a combinação: Classe ${classe}, Arma ${arma}, Estilo ${estilo}.

## Dados do PoE2DB (use apenas estes nomes e informações)

### Skill Gems compatíveis
${JSON.stringify(filtered.skillGems, null, 2)}

### Support Gems compatíveis
${JSON.stringify(filtered.supportGems, null, 2)}

### Modificadores de itens recomendados
${JSON.stringify(filtered.modifiers, null, 2)}

---

Com base APENAS nesses dados reais, crie um guia curto e amigável para um iniciante que quer jogar de **${classe} de ${estilo} com ${arma}**. Inclua:
1. Uma skill principal recomendada e por quê.
2. Até 3 gemas de suporte sugeridas (use os nomes exatos do JSON).
3. Quais status/modificadores priorizar nos itens (use os nomes do JSON).
4. Uma "dica de ouro" em uma frase para o iniciante não quebrar a build.

Seja direto e use apenas informações que existem nos dados acima. Responda em português do Brasil.`

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    if (!text) {
      return NextResponse.json(
        { error: 'A IA não retornou texto. Tente novamente.' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      guide: text,
      dataUsed: {
        skillGems: filtered.skillGems.length,
        supportGems: filtered.supportGems.length,
        modifiers: filtered.modifiers.length,
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
