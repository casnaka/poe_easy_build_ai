import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 45

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
/** Aceita builds do poe.ninja: PoE 1 (poe1) ou PoE 2 (poe2 / poe2.ninja). */
function isValidPoeBuildUrl(u: string): boolean {
  const lower = u.toLowerCase()
  return (
    lower.includes('poe.ninja/poe1') ||
    lower.includes('poe.ninja/poe2') ||
    lower.includes('poe2.ninja') ||
    /poe\.ninja\/poe[12]\/builds\/[^/]+\/character\//.test(lower)
  )
}

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

/** Extrai texto legível do HTML (remove tags, reduz espaços). */
function extractTextFromHtml(html: string, maxChars: number): string {
  const noScript = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
  const noStyle = noScript.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
  let text = noStyle
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
  if (text.length > maxChars) text = text.slice(0, maxChars) + '...'
  return text
}

/** Dados extraídos da página poe.ninja (meta + props do Astro). */
interface PoeNinjaMeta {
  description: string
  league: string
  characterName: string
  account: string
  ascendancy: string
  game: 'poe1' | 'poe2'
}

/** Extrai meta e props do HTML do poe.ninja (título, descrição, liga, classe, conta). */
function parsePoeNinjaMeta(html: string, url: string): PoeNinjaMeta | null {
  const out: Partial<PoeNinjaMeta> = { description: '', league: '', characterName: '', account: '', ascendancy: '', game: 'poe1' }
  const metaDesc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
  if (metaDesc) out.description = metaDesc[1].replace(/&quot;/g, '"').trim()

  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)
  if (ogImage) {
    const m = ogImage[1].match(/\/(?:classes|ascendancies)\/([a-z0-9_-]+)\.(png|webp)/i)
    if (m) out.ascendancy = m[1].replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const charPageMatch = html.match(/CharPageWrapper[^>]*props="([^"]*)"/i) ?? html.match(/props="([^"]*league[^"]*)"\s+ssr/i)
  if (charPageMatch) {
    try {
      const raw = charPageMatch[1].replace(/&quot;/g, '"')
      const leagueMatch = raw.match(/"league"\s*:\s*\[\s*0\s*,\s*"([^"]*)"/) ?? raw.match(/"league"\s*:\s*"([^"]*)"/)
      const nameMatch = raw.match(/"name"\s*:\s*\[\s*0\s*,\s*"([^"]*)"/) ?? raw.match(/"name"\s*:\s*"([^"]*)"/)
      const accountMatch = raw.match(/"account"\s*:\s*\[\s*0\s*,\s*"([^"]*)"/) ?? raw.match(/"account"\s*:\s*"([^"]*)"/)
      if (leagueMatch) out.league = leagueMatch[1]
      if (nameMatch) out.characterName = nameMatch[1]
      if (accountMatch) out.account = accountMatch[1]
    } catch {
      // ignore
    }
  }
  if (!out.characterName && out.description) {
    const nameFromDesc = out.description.match(/^([^,]+),\s*level\s+\d+/i)
    if (nameFromDesc) out.characterName = nameFromDesc[1].trim()
  }
  if (!out.league) out.league = getLeagueFromUrl(url) ?? ''
  if (!out.account) out.account = getAccountFromUrl(url) ?? ''

  if (url.toLowerCase().includes('/poe2/') || url.toLowerCase().includes('poe2.ninja')) out.game = 'poe2'
  if (!out.description && !out.characterName && !out.league) return null
  return out as PoeNinjaMeta
}

/** Extrai a liga da URL (ex.: poe1/builds/keepers/... → keepers). */
function getLeagueFromUrl(url: string): string | null {
  const m = url.match(/poe[12]\.ninja\/builds\/([^/]+)/i) ?? url.match(/poe\.ninja\/poe[12]\/builds\/([^/]+)/i)
  return m ? m[1] : null
}

/** Extrai o nome da conta da URL (ex.: .../character/ACCOUNT/CHARNAME → ACCOUNT). */
function getAccountFromUrl(url: string): string | null {
  try {
    const path = new URL(url).pathname
    const parts = path.split('/').filter(Boolean)
    const i = parts.findIndex((p) => p.toLowerCase() === 'character')
    if (i !== -1 && parts[i + 1]) return decodeURIComponent(parts[i + 1])
  } catch {
    // ignore
  }
  return null
}

const NINJA_ORIGIN = 'https://poe.ninja'
const NINJA_HEADERS = { 'User-Agent': 'PoeEasyBuildAI/1.0 (explain build)', Origin: NINJA_ORIGIN }

/** Obtém a version do snapshot para liga+type (ex.: keepers, exp) da API do poe.ninja. */
async function getPoeNinjaBuildVersion(league: string, type = 'exp'): Promise<string | null> {
  try {
    const res = await fetch(`${NINJA_ORIGIN}/poe1/api/data/index-state`, { headers: NINJA_HEADERS })
    if (!res.ok) return null
    const data = (await res.json()) as { snapshotVersions?: Array<{ url: string; type: string; version: string }> }
    const list = data.snapshotVersions ?? []
    const snap = list.find((s) => s.url === league && s.type === type)
    return snap?.version ?? null
  } catch {
    return null
  }
}

/** Resposta da API de character do poe.ninja (PoE1). */
interface PoeNinjaCharacterResponse {
  account?: string
  name?: string
  league?: string
  defensiveStats?: Record<string, unknown>
  skills?: Array<{
    itemSlot?: number
    allGems?: Array<{ name?: string; level?: number; quality?: number; itemData?: { typeLine?: string; explicitMods?: string[] } }>
  }>
  items?: Array<{ slot?: string; itemData?: { baseType?: string; name?: string; typeLine?: string; explicitMods?: string[] } }>
  passiveSelection?: Record<string, unknown>
  hashesEx?: number[]
  keyStones?: unknown[]
  masteries?: unknown
  passiveTreeName?: string
  banditChoice?: string
  pantheonMajor?: string
  pantheonMinor?: string
}

/** Busca build completa (itens, skills, passivas) na API do poe.ninja (só PoE 1). */
async function fetchPoeNinjaCharacterFull(
  account: string,
  characterName: string,
  league: string,
  type = 'exp'
): Promise<PoeNinjaCharacterResponse | null> {
  const version = await getPoeNinjaBuildVersion(league, type)
  if (!version) return null
  const params = new URLSearchParams({
    account,
    name: characterName,
    overview: league,
    type,
    timeMachine: '',
  })
  try {
    const res = await fetch(
      `${NINJA_ORIGIN}/poe1/api/builds/${encodeURIComponent(version)}/character?${params}`,
      { headers: NINJA_HEADERS }
    )
    if (!res.ok) return null
    return (await res.json()) as PoeNinjaCharacterResponse
  } catch {
    return null
  }
}

/** Formata a resposta da API de character para texto legível no prompt da IA. */
function formatCharacterForPrompt(data: PoeNinjaCharacterResponse): string {
  const lines: string[] = ['=== Build completa (API poe.ninja) ===', '']
  if (data.league) lines.push(`Liga: ${data.league}`, '')
  if (data.defensiveStats) {
    const s = data.defensiveStats as Record<string, unknown>
    lines.push('--- Estatísticas defensivas ---')
    const keys = ['life', 'energyShield', 'mana', 'armour', 'evasionRating', 'strength', 'dexterity', 'intelligence']
    keys.forEach((k) => { if (s[k] != null) lines.push(`${k}: ${s[k]}`) })
    const res = ['fireResistance', 'coldResistance', 'lightningResistance', 'chaosResistance']
    res.forEach((k) => { if (s[k] != null) lines.push(`${k}: ${s[k]}`) })
    lines.push('')
  }
  if (data.items && data.items.length > 0) {
    lines.push('--- Equipamento ---')
    data.items.forEach((item) => {
      const id = item.itemData
      const name = id?.name || id?.baseType || id?.typeLine || '?'
      lines.push(`• ${item.slot ?? 'Slot'}: ${name}`)
      if (id?.explicitMods?.length) id.explicitMods.slice(0, 8).forEach((m: string) => lines.push(`  ${m}`))
    })
    lines.push('')
  }
  if (data.skills && data.skills.length > 0) {
    lines.push('--- Skills e gemas ---')
    data.skills.forEach((slot) => {
      const gems = slot.allGems ?? []
      const names = gems.map((g) => `${g.name ?? g.itemData?.typeLine ?? '?'} (Lv${g.level ?? '?'}${g.quality ? ` Q${g.quality}` : ''})`)
      lines.push(`Slot ${slot.itemSlot ?? '?'}: ${names.join(' + ')}`)
      gems.forEach((g) => {
        const mods = g.itemData?.explicitMods
        if (mods?.length) mods.slice(0, 4).forEach((m: string) => lines.push(`  - ${m}`))
      })
    })
    lines.push('')
  }
  const passiveCount = data.passiveSelection ? Object.keys(data.passiveSelection).length : 0
  const hashesExCount = data.hashesEx?.length ?? 0
  if (passiveCount > 0 || hashesExCount > 0) {
    lines.push('--- Árvore de passivas ---')
    lines.push(`Nós alocados (passiveSelection): ${passiveCount}`)
    if (hashesExCount > 0) lines.push(`Nós extended (hashesEx): ${hashesExCount}`)
    if (data.passiveTreeName) lines.push(`Árvore: ${data.passiveTreeName}`)
    if (data.keyStones && (data.keyStones as unknown[]).length > 0)
      lines.push(`Keystones: ${(data.keyStones as unknown[]).length} alocados`)
    if (data.masteries && typeof data.masteries === 'object' && Object.keys(data.masteries as object).length > 0)
      lines.push('Masteries selecionadas presentes.')
    if (data.banditChoice) lines.push(`Bandit: ${data.banditChoice}`)
    if (data.pantheonMajor) lines.push(`Pantheon maior: ${data.pantheonMajor}`)
    if (data.pantheonMinor) lines.push(`Pantheon menor: ${data.pantheonMinor}`)
    lines.push('')
  }
  return lines.join('\n')
}

/** Chama a API getbuildoverview do poe.ninja e retorna dados do personagem pelo nome. */
async function fetchBuildOverviewForCharacter(
  league: string,
  characterName: string,
  type = 'exp'
): Promise<Record<string, unknown> | null> {
  const apiUrl = `https://poe.ninja/api/data/0/getbuildoverview?overview=${encodeURIComponent(league)}&type=${encodeURIComponent(type)}&language=en`
  try {
    const res = await fetch(apiUrl, { headers: { 'User-Agent': 'PoeEasyBuildAI/1.0' } })
    if (!res.ok) return null
    const data = (await res.json()) as {
      names?: string[]
      levels?: number[]
      life?: number[]
      energyShield?: number[]
      uniqueItems?: Array<{ name?: string }>
      uniqueItemUse?: Record<string, number[]>
      activeSkills?: unknown
      keystones?: unknown
      masteries?: unknown
    }
    if (!Array.isArray(data.names)) return null
    const idx = data.names.findIndex((n) => n.toLowerCase() === characterName.toLowerCase())
    if (idx === -1) return null
    const char: Record<string, unknown> = {
      name: data.names[idx],
      level: data.levels?.[idx] ?? null,
      life: data.life?.[idx] ?? null,
      energyShield: data.energyShield?.[idx] ?? null,
    }
    if (data.uniqueItems && data.uniqueItemUse) {
      const uniques: string[] = []
      for (let i = 0; i < data.uniqueItems.length; i++) {
        const deltas = data.uniqueItemUse[String(i)]
        if (!Array.isArray(deltas)) continue
        let running = 0
        for (const d of deltas) {
          running += d
          if (running === idx + 1) {
            uniques.push(data.uniqueItems[i]?.name ?? `Item ${i}`)
            break
          }
        }
      }
      char.uniqueItems = uniques
    }
    if (data.activeSkills) char.activeSkills = data.activeSkills
    if (data.keystones) char.keystones = data.keystones
    if (data.masteries) char.masteries = data.masteries
    return char
  } catch {
    return null
  }
}

/** Verifica se o texto extraído da página é “fino” (SPA, só Loading). */
function isThinContent(text: string): boolean {
  const t = text.toLowerCase().trim()
  if (t.length < 400) return true
  if (/^(loading|carregando)[.\s]*$/i.test(t)) return true
  const hasDetail = /\b(item|passive|skill|gem|armour|weapon|helmet|boots|gloves|belt|ring|amulet|keystone|ascendancy)\b/i.test(t)
  return !hasDetail
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

    const body = (await request.json()) as { url?: string; buildSummary?: string }
    const url = typeof body.url === 'string' ? body.url.trim() : ''
    const buildSummary = typeof body.buildSummary === 'string' ? body.buildSummary.trim() : ''

    let sourceText = buildSummary
    if (url) {
      if (!isValidPoeBuildUrl(url)) {
        return NextResponse.json(
          { error: 'URL deve ser de uma build do poe.ninja (PoE 1 ou PoE 2). Ex.: poe.ninja/poe1/builds/... ou poe.ninja/poe2/builds/...' },
          { status: 400 }
        )
      }
      const res = await fetch(url, {
        headers: { 'User-Agent': 'PoeEasyBuildAI/1.0 (explain build)' },
      })
      if (!res.ok) {
        return NextResponse.json(
          { error: `Não foi possível acessar a página (${res.status}). O site pode estar bloqueando ou a URL está incorreta.` },
          { status: 400 }
        )
      }
      const html = await res.text()
      const extracted = extractTextFromHtml(html, 12000)
      const meta = parsePoeNinjaMeta(html, url)
      const thin = isThinContent(extracted)

      if (thin && meta) {
        const league = meta.league || getLeagueFromUrl(url) || ''
        const account = meta.account || getAccountFromUrl(url)
        let fullChar: PoeNinjaCharacterResponse | null = null
        if (meta.game === 'poe1' && league && meta.characterName && account)
          fullChar = await fetchPoeNinjaCharacterFull(account, meta.characterName, league)
        if (fullChar) {
          const header = [
            `URL: ${url}`,
            meta.description ? `Descrição: ${meta.description}` : '',
            meta.ascendancy ? `Classe/Ascendência: ${meta.ascendancy}` : '',
            '',
          ].filter(Boolean).join('\n')
          sourceText = buildSummary
            ? `${buildSummary}\n\n${header}${formatCharacterForPrompt(fullChar)}`
            : `${header}${formatCharacterForPrompt(fullChar)}`
        } else {
          let apiChar: Record<string, unknown> | null = null
          if (league && meta.characterName)
            apiChar = await fetchBuildOverviewForCharacter(league, meta.characterName)
          const parts: string[] = [
            `URL: ${url}`,
            `Descrição da página: ${meta.description || '(não disponível)'}`,
            meta.ascendancy ? `Classe/Ascendência: ${meta.ascendancy}` : '',
            meta.league ? `Liga: ${meta.league}` : '',
            meta.characterName ? `Personagem: ${meta.characterName}` : '',
          ]
          if (apiChar) {
            parts.push('', 'Dados da API do poe.ninja (parciais):', JSON.stringify(apiChar, null, 2))
          }
          parts.push(
            '',
            '---',
            'A página do poe.ninja carrega itens, passivas e gemas por JavaScript; este servidor não executa a página, então os dados acima são parciais.'
          )
          sourceText = buildSummary
            ? `${buildSummary}\n\n${parts.filter(Boolean).join('\n')}`
            : parts.filter(Boolean).join('\n')
        }
      } else {
        sourceText = sourceText
          ? `${sourceText}\n\n--- Conteúdo da página (URL: ${url}) ---\n${extracted}`
          : `Conteúdo extraído da página (URL: ${url}):\n\n${extracted}`
      }
    }

    if (!sourceText || sourceText.length < 20) {
      return NextResponse.json(
        { error: 'Envie a URL de um personagem do poe.ninja ou cole um resumo da build (itens, passivas, skills).' },
        { status: 400 }
      )
    }

    const hasPartialNote = sourceText.includes('carrega itens, passivas e gemas por JavaScript')
    const prompt = `Você é um especialista em Path of Exile (PoE 1 e PoE 2). O usuário enviou dados de uma build (página do poe.ninja ou resumo colado).

Use APENAS as informações abaixo para explicar a build. Se algo não estiver claro no texto, diga "não foi possível identificar" para essa parte.

## Dados da build (fonte: poe.ninja ou usuário)

${sourceText}

---

Escreva uma explicação em português do Brasil, em Markdown, com as seções:

1. **Visão geral** – Que tipo de build parece ser (classe/ascendência se der para identificar, estilo: dano, tank, etc.).
2. **Por que esses itens** – O que os itens/equipamentos sugerem (vida, resistências, dano, etc.). Se não houver lista de itens, use o que aparecer (ex.: uniques da API) ou indique que faltam dados.
3. **Por que essas passivas** – O que as passivas indicam sobre as prioridades da build (ou que não foi possível analisar sem a árvore).
4. **Por que essas skills/gemas** – Como as skills e gemas se encaixam no conjunto (ou que não foi possível sem a lista de gemas).
5. **Resumo** – Em 2 ou 3 frases, o que um jogador deve ter em mente ao seguir essa build.

${hasPartialNote ? 'Como os dados são parciais (a página carrega o resto por JavaScript), explique o que der com o que há acima. No final, sugira ao usuário: **Para uma análise completa**, abra a página do personagem no poe.ninja, use o botão **"Copy PoB"** (Path of Building) ou copie manualmente a lista de itens, passivas e gemas e cole no campo de resumo desta ferramenta.' : 'Se o texto não tiver detalhes suficientes, diga o que seria necessário para uma análise melhor (ex.: colar lista de itens e passivas da página).'}`

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
