import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

async function callOpenRouter(
  prompt: string,
  apiKey: string,
  siteUrl: string,
  model: string
): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': siteUrl,
      'X-OpenRouter-Title': 'Poe Easy Build AI',
    },
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
        { error: 'OPENROUTER_API_KEY não configurada.' },
        { status: 500 }
      )
    }

    const siteUrl = process.env.OPENROUTER_SITE_URL ?? 'https://openrouter.ai/docs/quickstart'
    const model = process.env.OPENROUTER_MODEL ?? 'z-ai/glm-4.5-air:free'

    const body = (await request.json()) as {
      buildName?: string
      classe?: string
      arma?: string
      foco?: string
      skillPrincipal?: { nome: string; porQue: string }
      gemasSuporte?: Array<{ nome: string; url: string }>
      statusPrioritarios?: string[]
      passivasSugeridas?: Array<{ nome: string; descricao: string }>
      dicaDeOuro?: string
    }

    const buildName = body.buildName ?? 'Build'
    const classe = body.classe ?? ''
    const arma = body.arma ?? ''
    const foco = body.foco ?? ''
    const skill = body.skillPrincipal
    const gemas = body.gemasSuporte ?? []
    const status = body.statusPrioritarios ?? []
    const passivas = body.passivasSugeridas ?? []
    const dica = body.dicaDeOuro ?? ''

    const prompt = `Você é um especialista em Path of Exile 2. Explique esta build para um iniciante em português do Brasil.

## Build: ${buildName}
- **Classe:** ${classe} | **Arma:** ${arma} | **Foco:** ${foco}

### Skill principal
- ${skill?.nome ?? 'N/A'}: ${skill?.porQue ?? ''}

### Gemas de suporte
${gemas.map((g) => `- ${g.nome}`).join('\n')}

### Status prioritários nos itens
${status.join(', ')}

### Passivas principais
${passivas.map((p) => `- **${p.nome}**: ${p.descricao}`).join('\n')}

### Dica de ouro
${dica}

---

Escreva uma explicação em Markdown com as seções:
1. **Por que essa build funciona** – sinergia entre classe, arma e foco.
2. **Por que cada gema de suporte** – o que cada uma agrega à skill principal.
3. **Por que priorizar esses status nos itens** – vida, resistências, dano, etc.
4. **Por que essas passivas** – ordem e importância de cada uma.
5. **Resumo** – em 2 ou 3 frases, o que o jogador deve ter em mente.

Seja direto e didático. Use apenas as informações fornecidas acima.`

    const explanation = await callOpenRouter(prompt, apiKey, siteUrl, model)

    return NextResponse.json({ success: true, explanation })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: 'Erro ao explicar build: ' + message },
      { status: 500 }
    )
  }
}
