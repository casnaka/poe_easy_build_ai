#!/usr/bin/env node
/**
 * Lista de ascendências do poe.ninja (PoE 2 builds).
 *
 * Uso: node scripts/scrape-poe-ninja-ascendancies.mjs [league]
 * Liga padrão: vaal (Fate of the Vaal)
 * Gera: scripts/ascendancies-from-ninja.json
 *
 * IMPORTANTE: O poe.ninja renderiza a lista de ascendências com JavaScript;
 * um fetch() simples não recebe esse conteúdo. Por isso a lista completa
 * está em src/data/ascendancyMeta.ts (ALL_ASCENDANCIES). Este script:
 * 1) Tenta extrair nomes do HTML (pode vir vazio ou incompleto);
 * 2) Se encontrar poucos, usa a lista canônica do projeto.
 *
 * Para scraper completo (skill/passivas mais usadas por ascendência) seria
 * necessário Puppeteer/Playwright para executar o JS da página, ou uma API
 * oficial do poe.ninja (que não existe para PoE 2 builds).
 */

const league = process.argv[2] || 'vaal'
const url = `https://poe.ninja/poe2/builds/${league}`

const FALLBACK_LIST = [
  'Abyssal Lich', 'Acolyte of Chayula', 'Amazon', 'Blood Mage', 'Chronomancer',
  'Deadeye', 'Disciple of Varashta', 'Druid', 'Gemling Legionnaire', 'Huntress',
  'Infernalist', 'Invoker', 'Lich', 'Mercenary', 'Monk', 'Oracle', 'Pathfinder',
  'Ranger', 'Ritualist', 'Shaman', 'Smith of Kitava', 'Sorceress', 'Stormweaver',
  'Tactician', 'Titan', 'Warbringer', 'Warrior', 'Witch', 'Witchhunter',
]

async function main() {
  console.log('Fetching', url, '...')
  const res = await fetch(url, {
    headers: { 'User-Agent': 'PoeEasyBuildAI/1.0 (ascendancy list)' },
  })
  if (!res.ok) {
    console.error('HTTP', res.status)
    process.exit(1)
  }
  const html = await res.text()

  const ascendancies = new Set()
  const regex = /[\"']([A-Za-z][A-Za-z\s]{2,35}?)[\"']\s*[:\"]\s*\d+\.?\d*%?/g
  let m
  while ((m = regex.exec(html)) !== null) {
    const name = m[1].trim()
    if (name.length > 2 && name.length < 40 && !/^[\d\s]+$/.test(name)) {
      ascendancies.add(name)
    }
  }

  const fromHtml = [...ascendancies].filter((a) => FALLBACK_LIST.some((b) => b.includes(a) || a.includes(b)))
  const list = fromHtml.length >= 10 ? [...ascendancies].sort() : FALLBACK_LIST.slice().sort()
  if (fromHtml.length < 10) {
    console.log('(Lista do HTML insuficiente; usando lista canônica do projeto.)')
  }

  const out = { league, url, ascendancies: list, scrapedAt: new Date().toISOString() }
  const fs = await import('fs')
  const path = new URL('ascendancies-from-ninja.json', import.meta.url)
  fs.writeFileSync(path, JSON.stringify(out, null, 2), 'utf-8')
  console.log('Saved', list.length, 'ascendancies to', path.pathname)
  list.forEach((a) => console.log(' -', a))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
