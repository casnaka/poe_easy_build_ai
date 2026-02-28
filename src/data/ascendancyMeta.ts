/**
 * Meta por ascendência — alinhado ao que mais aparece no poe.ninja (skills, passivas).
 * O poe.ninja NÃO expõe API pública para "skill mais usada" ou "passiva mais usada";
 * a lista de ascendências vem do scraper (scripts/scrape-poe-ninja-ascendancies.mjs).
 * Dados detalhados (skill, passivas) são curatable ou futuramente extraídos por scraper.
 */

import type { BuildRecommendation } from './buildRecommendations'
import { getPoe2NinjaBuildsUrl } from './buildData'

export interface AscendancyMeta {
  /** Nome exato no poe.ninja (?class=) */
  ascendancy: string
  /** Classe base (Witch, Mercenary, etc.) */
  baseClass: string
  /** Nome para exibição */
  displayName: string
  /** Skill mais usada na ascendência (conforme poe.ninja) */
  topSkill: string
  /** Descrição curta do porquê da skill */
  topSkillWhy: string
  /** Passivas mais usadas (ordem de uso no poe.ninja) */
  topPassives: Array<{ nome: string; descricao: string }>
  /** Gemas de suporte mais usadas */
  topSupportGems: Array<{ nome: string; url: string }>
  /** Status prioritários nos itens */
  statusPrioritarios: string[]
  dicaDeOuro: string
}

/** Todas as ascendências que aparecem no poe.ninja (Fate of the Vaal) + classe base. */
export const ALL_ASCENDANCIES: Array<{ ascendancy: string; baseClass: string }> = [
  { ascendancy: 'Abyssal Lich', baseClass: 'Witch' },
  { ascendancy: 'Acolyte of Chayula', baseClass: 'Monk' },
  { ascendancy: 'Amazon', baseClass: 'Ranger' },
  { ascendancy: 'Blood Mage', baseClass: 'Witch' },
  { ascendancy: 'Chronomancer', baseClass: 'Sorceress' },
  { ascendancy: 'Deadeye', baseClass: 'Ranger' },
  { ascendancy: 'Disciple of Varashta', baseClass: 'Sorceress' },
  { ascendancy: 'Druid', baseClass: 'Druid' },
  { ascendancy: 'Gemling Legionnaire', baseClass: 'Mercenary' },
  { ascendancy: 'Huntress', baseClass: 'Ranger' },
  { ascendancy: 'Infernalist', baseClass: 'Witch' },
  { ascendancy: 'Invoker', baseClass: 'Monk' },
  { ascendancy: 'Lich', baseClass: 'Witch' },
  { ascendancy: 'Mercenary', baseClass: 'Mercenary' },
  { ascendancy: 'Monk', baseClass: 'Monk' },
  { ascendancy: 'Oracle', baseClass: 'Sorceress' },
  { ascendancy: 'Pathfinder', baseClass: 'Ranger' },
  { ascendancy: 'Ranger', baseClass: 'Ranger' },
  { ascendancy: 'Ritualist', baseClass: 'Druid' },
  { ascendancy: 'Shaman', baseClass: 'Druid' },
  { ascendancy: 'Smith of Kitava', baseClass: 'Warrior' },
  { ascendancy: 'Sorceress', baseClass: 'Sorceress' },
  { ascendancy: 'Stormweaver', baseClass: 'Sorceress' },
  { ascendancy: 'Tactician', baseClass: 'Mercenary' },
  { ascendancy: 'Titan', baseClass: 'Warrior' },
  { ascendancy: 'Warbringer', baseClass: 'Warrior' },
  { ascendancy: 'Warrior', baseClass: 'Warrior' },
  { ascendancy: 'Witch', baseClass: 'Witch' },
  { ascendancy: 'Witchhunter', baseClass: 'Mercenary' },
]

/** Converte meta para BuildRecommendation (para exibir e enviar à IA). */
export function metaToBuildRecommendation(m: AscendancyMeta): BuildRecommendation {
  return {
    skillPrincipal: { nome: m.topSkill, porQue: m.topSkillWhy },
    gemasSuporte: m.topSupportGems,
    statusPrioritarios: m.statusPrioritarios,
    passivasSugeridas: m.topPassives,
    dicaDeOuro: m.dicaDeOuro,
  }
}

/** Lista de ascendências com meta baseada no poe.ninja (Fate of the Vaal). */
export const ASCENDANCY_META: AscendancyMeta[] = [
  {
    ascendancy: 'Blood Mage',
    baseClass: 'Witch',
    displayName: 'Witch (Blood Mage)',
    topSkill: 'Life Remnants',
    topSkillWhy: 'Skill mais usada em Blood Mage no poe.ninja. Converte vida em poder ofensivo e sustentação.',
    topPassives: [
      { nome: 'Sanguimancy', descricao: 'Passiva mais usada em Blood Mage; central na sinergia de vida/sangue.' },
      { nome: 'Heart of the Warrior', descricao: 'Vida é recurso da build.' },
      { nome: 'Vitality', descricao: 'Regeneração para sustentar custos de vida.' },
      { nome: 'Elemental Resistance', descricao: 'Resistências no cap.' },
    ],
    topSupportGems: [
      { nome: 'Lifetap', url: 'https://poe2db.tw/us/Lifetap' },
      { nome: 'Vitality I', url: 'https://poe2db.tw/us/Vitality_I' },
      { nome: 'Prolonged Duration I', url: 'https://poe2db.tw/us/Prolonged_Duration_I' },
    ],
    statusPrioritarios: ['Life', 'Energy Shield', 'Spell Damage', 'Elemental Resistances', 'Mana'],
    dicaDeOuro: 'Vida é recurso e defesa: não negligencie pool de vida nem regeneração.',
  },
  {
    ascendancy: 'Witchhunter',
    baseClass: 'Mercenary',
    displayName: 'Mercenary (Witchhunter)',
    topSkill: 'Burst Shot',
    topSkillWhy: 'Alta burst e mobilidade; combina com Witchhunter para dano e mitigação elemental.',
    topPassives: [
      { nome: 'Heart of the Warrior', descricao: 'Vida para aguentar combate à distância.' },
      { nome: 'Swift Strikes', descricao: 'Velocidade de ataque e evasão.' },
      { nome: 'Deadly Draw', descricao: 'Dano de projéteis.' },
      { nome: 'Elemental Resistance', descricao: 'Resistências no cap.' },
    ],
    topSupportGems: [
      { nome: 'Faster Attacks', url: 'https://poe2db.tw/us/Support_Gems' },
      { nome: 'Added Physical Damage', url: 'https://poe2db.tw/us/Support_Gems' },
      { nome: 'Pierce', url: 'https://poe2db.tw/us/Support_Gems' },
    ],
    statusPrioritarios: ['Life', 'Evasion', 'Physical Damage', 'Attack Speed', 'Resistances'],
    dicaDeOuro: 'Mantenha distância; use terreno e flasks de movimento.',
  },
  {
    ascendancy: 'Titan',
    baseClass: 'Warrior',
    displayName: 'Warrior (Titan)',
    topSkill: 'Earthbreaker',
    topSkillWhy: 'Slam e golpes pesados; sinergia com Titan e passivas de armadura.',
    topPassives: [
      { nome: 'Heart of the Warrior', descricao: 'Vida prioritária em melee.' },
      { nome: 'Elemental Resistance', descricao: 'Cap 75%.' },
      { nome: 'Armour Breaker', descricao: 'Inimigos tomam mais dano físico.' },
      { nome: 'Vitality', descricao: 'Regeneração.' },
    ],
    topSupportGems: [
      { nome: 'Lifetap', url: 'https://poe2db.tw/us/Lifetap' },
      { nome: 'Defy I', url: 'https://poe2db.tw/us/Defy_I' },
      { nome: 'Vitality I', url: 'https://poe2db.tw/us/Vitality_I' },
    ],
    statusPrioritarios: ['Life', 'Armour', 'Block', 'Elemental Resistances', 'Strength'],
    dicaDeOuro: 'Resistências no cap primeiro; depois vida e block.',
  },
  {
    ascendancy: 'Pathfinder',
    baseClass: 'Ranger',
    displayName: 'Ranger (Pathfinder)',
    topSkill: 'Rain of Arrows',
    topSkillWhy: 'Área e clear; Pathfinder favorece flasks e mobilidade.',
    topPassives: [
      { nome: 'Deadly Draw', descricao: 'Dano de projéteis.' },
      { nome: 'Heart of the Warrior', descricao: 'Vida.' },
      { nome: 'Swift Strikes', descricao: 'Velocidade de ataque.' },
      { nome: 'Elemental Resistance', descricao: 'Resistências.' },
    ],
    topSupportGems: [
      { nome: 'Upheaval I', url: 'https://poe2db.tw/us/Upheaval_I' },
      { nome: 'Flamepierce', url: 'https://poe2db.tw/us/Flamepierce' },
      { nome: 'Acceleration', url: 'https://poe2db.tw/us/Acceleration' },
    ],
    statusPrioritarios: ['Life', 'Evasion', 'Physical/Cold Damage', 'Dexterity', 'Resistances'],
    dicaDeOuro: 'Fique em movimento; rangers morrem parados.',
  },
  {
    ascendancy: 'Oracle',
    baseClass: 'Sorceress',
    displayName: 'Sorceress (Oracle)',
    topSkill: 'Ice Nova',
    topSkillWhy: 'Controle e dano em área; Oracle traz utilidade e previsão.',
    topPassives: [
      { nome: 'Elemental Resistance', descricao: 'Resistências.' },
      { nome: 'Vitality', descricao: 'Regeneração.' },
      { nome: 'Heart of the Warrior', descricao: 'Vida.' },
      { nome: 'Chaos Mastery', descricao: 'Dano elemental/controle.' },
    ],
    topSupportGems: [
      { nome: 'Upheaval I', url: 'https://poe2db.tw/us/Upheaval_I' },
      { nome: 'Eternal Flame I', url: 'https://poe2db.tw/us/Eternal_Flame_I' },
      { nome: 'Ignite I', url: 'https://poe2db.tw/us/Ignite_I' },
    ],
    statusPrioritarios: ['Spell Damage', 'Cold/Lightning', 'Energy Shield', 'Intelligence', 'Resistances'],
    dicaDeOuro: 'Congelar é defesa; priorize cold e distância.',
  },
  {
    ascendancy: 'Lich',
    baseClass: 'Witch',
    displayName: 'Witch (Lich)',
    topSkill: 'Raise Zombie / Summon Skeletons',
    topSkillWhy: 'Invocações e sinergia com Lich; minions tankam e causam dano.',
    topPassives: [
      { nome: 'Vitality', descricao: 'Regeneração.' },
      { nome: 'Heart of the Warrior', descricao: 'Vida base.' },
      { nome: 'Elemental Resistance', descricao: 'Resistências.' },
      { nome: 'Chaos Mastery', descricao: 'Duração de invocações.' },
    ],
    topSupportGems: [
      { nome: 'Meat Shield I', url: 'https://poe2db.tw/us/Meat_Shield_I' },
      { nome: 'Vitality I', url: 'https://poe2db.tw/us/Vitality_I' },
      { nome: 'Prolonged Duration I', url: 'https://poe2db.tw/us/Prolonged_Duration_I' },
    ],
    statusPrioritarios: ['Energy Shield', 'Life', 'Minion Damage', 'Elemental Resistances', 'Intelligence'],
    dicaDeOuro: 'Priorize minions fortes; posicione-se longe do perigo.',
  },
]

/** Placeholder para ascendências sem meta detalhada (só link para poe.ninja). */
function placeholderMeta(ascendancy: string, baseClass: string): AscendancyMeta {
  return {
    ascendancy,
    baseClass,
    displayName: `${baseClass} (${ascendancy})`,
    topSkill: '—',
    topSkillWhy: 'Meta não catalogada. Confira no poe.ninja (link abaixo) a skill e passivas mais usadas.',
    topPassives: [
      { nome: '—', descricao: 'Ver poe.ninja para passivas mais usadas nesta ascendência.' },
    ],
    topSupportGems: [{ nome: '—', url: 'https://poe2db.tw/us/' }],
    statusPrioritarios: ['Life', 'Resistances'],
    dicaDeOuro: 'Abra o link do poe.ninja para ver builds reais da liga.',
  }
}

/** Retorna meta detalhada ou placeholder para qualquer ascendência da lista. */
export function getMetaByAscendancy(ascendancy: string): AscendancyMeta | undefined {
  const detailed = ASCENDANCY_META.find((m) => m.ascendancy === ascendancy)
  if (detailed) return detailed
  const entry = ALL_ASCENDANCIES.find((a) => a.ascendancy === ascendancy)
  if (entry) return placeholderMeta(entry.ascendancy, entry.baseClass)
  return undefined
}

/** Agrupa todas as ascendências por classe base para o seletor (com placeholder quando não há meta). */
export const ASCENDANCY_BY_CLASS: Record<string, AscendancyMeta[]> = (() => {
  const acc: Record<string, AscendancyMeta[]> = {}
  for (const { ascendancy, baseClass } of ALL_ASCENDANCIES) {
    if (!acc[baseClass]) acc[baseClass] = []
    acc[baseClass].push(getMetaByAscendancy(ascendancy)!)
  }
  return acc
})()

export function getPoeNinjaUrl(ascendancy: string): string {
  return getPoe2NinjaBuildsUrl(ascendancy)
}
