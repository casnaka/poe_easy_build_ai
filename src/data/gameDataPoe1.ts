/**
 * Dados e gerador de build para Path of Exile 1.
 * Links apontam para https://poedb.tw/us/ (PoEDB).
 */

const POEDB_BASE = 'https://poedb.tw/us'

function gemUrl(slug: string): string {
  return `${POEDB_BASE}/${slug}`
}

// PoE 1 usa as mesmas armas no wizard (Clava=Mace, Arco=Bow, etc.)
export type ArmaPoe1 = 'Clava' | 'Arco' | 'Cajado' | 'Lança' | 'Espada' | 'Machado'
export type FocoPoe1 = 'Dano em Área' | 'Sobrevivência' | 'Velocidade'

export interface SkillGemEntryPoe1 {
  id: string
  name: string
  slug: string
  weaponTypes: string[]
  description: string
}

export const SKILL_GEMS_POE1: SkillGemEntryPoe1[] = [
  { id: 'sunder', name: 'Sunder', slug: 'Sunder', weaponTypes: ['Clava', 'Espada', 'Machado'], description: 'Golpe em área que quebra o chão. Clássico de clear melee no PoE 1.' },
  { id: 'ground_slam', name: 'Ground Slam', slug: 'Ground_Slam', weaponTypes: ['Clava', 'Machado'], description: 'Slam em cone à sua frente. Ótimo para início de liga.' },
  { id: 'shield_charge', name: 'Shield Charge', slug: 'Shield_Charge', weaponTypes: ['Clava'], description: 'Carrega com o escudo, causando dano no impacto.' },
  { id: 'rain_of_arrows', name: 'Rain of Arrows', slug: 'Rain_of_Arrows', weaponTypes: ['Arco'], description: 'Chuva de flechas em área. Excelente clear à distância.' },
  { id: 'lightning_arrow', name: 'Lightning Arrow', slug: 'Lightning_Arrow', weaponTypes: ['Arco'], description: 'Flechas que encadeiam raios entre inimigos.' },
  { id: 'ice_nova', name: 'Ice Nova', slug: 'Ice_Nova', weaponTypes: ['Cajado'], description: 'Onda de gelo ao redor. Controle e dano em área.' },
  { id: 'fireball', name: 'Fireball', slug: 'Fireball', weaponTypes: ['Cajado'], description: 'Bola de fogo que explode. Clássico de magia de fogo.' },
  { id: 'arc', name: 'Arc', slug: 'Arc', weaponTypes: ['Cajado'], description: 'Relâmpago que encadeia entre inimigos.' },
  { id: 'sweep', name: 'Sweep', slug: 'Sweep', weaponTypes: ['Lança', 'Espada'], description: 'Golpe em arco que atinge todos à frente.' },
  { id: 'earthquake', name: 'Earthquake', slug: 'Earthquake', weaponTypes: ['Clava', 'Machado'], description: 'Slam que causa aftershocks no chão.' },
  { id: 'raise_zombie', name: 'Raise Zombie', slug: 'Raise_Zombie', weaponTypes: ['Cajado'], description: 'Invoca zumbis que tankam e atacam por você.' },
]

export interface SupportGemEntryPoe1 {
  id: string
  name: string
  slug: string
  weaponTypes: string[]
}

export const SUPPORT_GEMS_POE1: SupportGemEntryPoe1[] = [
  { id: 'added_fire', name: 'Added Fire Damage Support', slug: 'Added_Fire_Damage_Support', weaponTypes: ['Clava', 'Arco', 'Cajado', 'Espada', 'Machado', 'Lança'] },
  { id: 'melee_physical', name: 'Melee Physical Damage Support', slug: 'Melee_Physical_Damage_Support', weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança'] },
  { id: 'increased_aoe', name: 'Increased Area of Effect Support', slug: 'Increased_Area_of_Effect_Support', weaponTypes: ['Clava', 'Cajado', 'Espada', 'Machado', 'Lança'] },
  { id: 'brutality', name: 'Brutality Support', slug: 'Brutality_Support', weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança'] },
  { id: 'fortify', name: 'Fortify Support', slug: 'Fortify_Support', weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança'] },
  { id: 'life_on_hit', name: 'Life on Hit Support', slug: 'Life_on_Hit_Support', weaponTypes: ['Clava', 'Arco', 'Cajado', 'Espada', 'Lança', 'Machado'] },
  { id: 'faster_attacks', name: 'Faster Attacks Support', slug: 'Faster_Attacks_Support', weaponTypes: ['Clava', 'Arco', 'Espada', 'Lança', 'Machado'] },
  { id: 'greater_multiple', name: 'Greater Multiple Projectiles Support', slug: 'Greater_Multiple_Projectiles_Support', weaponTypes: ['Arco'] },
  { id: 'added_cold', name: 'Added Cold Damage Support', slug: 'Added_Cold_Damage_Support', weaponTypes: ['Arco', 'Cajado'] },
  { id: 'spell_cascade', name: 'Spell Cascade Support', slug: 'Spell_Cascade_Support', weaponTypes: ['Cajado'] },
  { id: 'controlled_destruction', name: 'Controlled Destruction Support', slug: 'Controlled_Destruction_Support', weaponTypes: ['Cajado'] },
  { id: 'minion_life', name: 'Minion Life Support', slug: 'Minion_Life_Support', weaponTypes: ['Cajado'] },
  { id: 'minion_damage', name: 'Minion Damage Support', slug: 'Minion_Damage_Support', weaponTypes: ['Cajado'] },
]

import type { BuildRecommendation, GemaComLink, PassivaSugerida } from './buildRecommendations'

function getSupportGemsPoe1(arma: ArmaPoe1, foco: FocoPoe1): GemaComLink[] {
  const byWeapon = SUPPORT_GEMS_POE1.filter((g) => g.weaponTypes.includes(arma))
  const priority = foco === 'Dano em Área' ? ['increased_aoe', 'added_fire', 'melee_physical'] : foco === 'Sobrevivência' ? ['fortify', 'life_on_hit', 'minion_life'] : ['faster_attacks', 'greater_multiple', 'added_cold']
  const order = [...byWeapon].sort((a, b) => {
    const iA = priority.indexOf(a.id)
    const iB = priority.indexOf(b.id)
    if (iA === -1 && iB === -1) return 0
    if (iA === -1) return 1
    if (iB === -1) return -1
    return iA - iB
  })
  return order.slice(0, 3).map((g) => ({ nome: g.name, url: gemUrl(g.slug) }))
}

function getModifiersPoe1(foco: FocoPoe1): string[] {
  const always = ['+ to maximum Life', '#% Fire Resistance', '#% Cold Resistance', '#% Lightning Resistance']
  if (foco === 'Sobrevivência') return [...always, 'to Armour', '#% increased maximum Life', 'to Evasion Rating']
  if (foco === 'Velocidade') return [...always, '#% increased Attack Speed', '#% increased Movement Speed', 'to Evasion Rating']
  return [...always, 'Adds X to Y Fire Damage', '#% increased Cast Speed', '#% increased Attack Speed']
}


function getMainSkillPoe1(arma: ArmaPoe1, foco: FocoPoe1): SkillGemEntryPoe1 {
  const forWeapon = SKILL_GEMS_POE1.filter((s) => s.weaponTypes.includes(arma))
  const fallback: SkillGemEntryPoe1 = SKILL_GEMS_POE1.find((s) => s.id === 'sunder') ?? SKILL_GEMS_POE1[0]!
  if (forWeapon.length === 0) return fallback
  if (foco === 'Sobrevivência' && arma === 'Clava') {
    const s = forWeapon.find((x) => x.id === 'shield_charge')
    if (s) return s
  }
  if (foco === 'Dano em Área' && arma === 'Arco') {
    const s = forWeapon.find((x) => x.id === 'rain_of_arrows')
    if (s) return s
  }
  if (arma === 'Cajado' && foco === 'Sobrevivência') {
    const s = forWeapon.find((x) => x.id === 'raise_zombie')
    if (s) return s
  }
  if (arma === 'Cajado') {
    const s = forWeapon.find((x) => x.id === 'ice_nova') ?? forWeapon.find((x) => x.id === 'fireball')
    if (s) return s
  }
  return forWeapon[0] ?? fallback
}

const DICAS_POE1: Record<FocoPoe1, string> = {
  'Dano em Área': 'No PoE 1, priorize vida e resistências (75% cap) antes de empilhar só dano.',
  Sobrevivência: 'Resistências no cap (75%) e vida; depois armadura ou evasão conforme a build.',
  Velocidade: 'Velocidade sem vida mata: não negligencie life e resistências.',
}

const PASSIVES_POE1: Array<{ name: string; category: string; description: string }> = [
  { name: 'Life', category: 'life', description: 'Vida máxima. Prioridade em toda build.' },
  { name: 'Elemental Resistance', category: 'resistance', description: 'Resistências elementais. Cap 75%.' },
  { name: 'Physical Damage', category: 'physical', description: 'Dano físico. Melee e arco.' },
  { name: 'Attack Speed', category: 'attack', description: 'Velocidade de ataque.' },
  { name: 'Area of Effect', category: 'aoe', description: 'Raio de habilidades em área.' },
  { name: 'Armour', category: 'armour', description: 'Redução de dano físico.' },
]

function getPassivesPoe1(foco: FocoPoe1): PassivaSugerida[] {
  const priority = foco === 'Sobrevivência' ? ['life', 'resistance', 'armour'] : foco === 'Velocidade' ? ['attack', 'life', 'resistance'] : ['physical', 'aoe', 'life', 'resistance']
  const sorted = [...PASSIVES_POE1].sort((a, b) => {
    const iA = priority.indexOf(a.category)
    const iB = priority.indexOf(b.category)
    if (iA === -1 && iB === -1) return 0
    if (iA === -1) return 1
    if (iB === -1) return -1
    return iA - iB
  })
  return sorted.slice(0, 6).map((p) => ({ nome: p.name, descricao: p.description }))
}

/**
 * Gera a build para PoE 1 usando dados compatíveis com poedb.tw.
 */
export function generateBuildFromDataPoe1(
  arma: ArmaPoe1,
  foco: FocoPoe1
): BuildRecommendation {
  const skill = getMainSkillPoe1(arma, foco)
  const gemasSuporte = getSupportGemsPoe1(arma, foco)
  const statusPrioritarios = getModifiersPoe1(foco)
  const passivasSugeridas = getPassivesPoe1(foco)
  const dicaDeOuro = DICAS_POE1[foco]

  return {
    skillPrincipal: {
      nome: skill.name,
      porQue: skill.description,
      url: gemUrl(skill.slug),
    },
    gemasSuporte,
    statusPrioritarios,
    passivasSugeridas,
    dicaDeOuro,
  }
}

export { POEDB_BASE }
