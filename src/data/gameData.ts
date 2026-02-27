/**
 * Banco de dados local inspirado no poe2db.tw
 * Core Items (modificadores) e Skill Gems / Support Gems do PoE 2.
 * URLs apontam para as páginas correspondentes no poe2db.tw
 */

const POE2DB_BASE = 'https://poe2db.tw/us'

function gemUrl(slug: string): string {
  return `${POE2DB_BASE}/${slug}`
}

// --- Skill Gems (skills principais) ---
export interface SkillGemEntry {
  id: string
  name: string
  slug: string
  tags: string[]
  weaponTypes: string[]
  description: string
}

export const SKILL_GEMS: SkillGemEntry[] = [
  { id: 'sunder', name: 'Sunder', slug: 'Sunder', tags: ['Attack', 'Melee', 'Slam', 'AoE'], weaponTypes: ['Clava', 'Espada', 'Machado'], description: 'Golpe em área que quebra o chão. Ideal para clear melee.' },
  { id: 'leap_slam', name: 'Leap Slam', slug: 'Leap_Slam', tags: ['Attack', 'Melee', 'Slam', 'Travel'], weaponTypes: ['Clava', 'Espada', 'Machado'], description: 'Pula e ataca em área no pouso. Ótimo deslocamento.' },
  { id: 'shield_charge', name: 'Shield Charge', slug: 'Shield_Charge', tags: ['Attack', 'Melee', 'Travel', 'Channelling'], weaponTypes: ['Clava'], description: 'Carrega com o escudo levantado, bloqueando e causando dano no impacto.' },
  { id: 'rain_of_arrows', name: 'Rain of Arrows', slug: 'Rain_of_Arrows', tags: ['Attack', 'Projectile', 'AoE'], weaponTypes: ['Arco'], description: 'Chuva de flechas em área. Perfeito para clear à distância.' },
  { id: 'lightning_arrow', name: 'Lightning Arrow', slug: 'Lightning_Arrow', tags: ['Attack', 'Projectile', 'Lightning', 'Chaining'], weaponTypes: ['Arco'], description: 'Flechas que encadeiam raios entre inimigos.' },
  { id: 'explosive_spear', name: 'Explosive Spear', slug: 'Explosive_Spear', tags: ['Attack', 'Projectile', 'Fire'], weaponTypes: ['Besta'], description: 'Projétil que explode no alvo. Bom para besta.' },
  { id: 'freezing_salvo', name: 'Freezing Salvo', slug: 'Freezing_Salvo', tags: ['Attack', 'Projectile', 'Cold'], weaponTypes: ['Arco', 'Besta'], description: 'Salva de projéteis de frio em área.' },
  { id: 'volcanic_fissure', name: 'Volcanic Fissure', slug: 'Volcanic_Fissure', tags: ['Attack', 'Melee', 'Slam', 'Fire'], weaponTypes: ['Clava'], description: 'Fissura de fogo no chão. Alto dano em área.' },
  { id: 'flameblast', name: 'Flameblast', slug: 'Flameblast', tags: ['Spell', 'Fire', 'AoE', 'Channelling'], weaponTypes: ['Cajado'], description: 'Canaliza e solta explosão de fogo. Grande área.' },
  { id: 'ice_nova', name: 'Ice Nova', slug: 'Ice_Nova', tags: ['Spell', 'Cold', 'AoE', 'Nova'], weaponTypes: ['Cajado'], description: 'Onda de gelo ao redor. Controle e dano.' },
  { id: 'lightning_spear', name: 'Lightning Spear', slug: 'Lightning_Spear', tags: ['Attack', 'Projectile', 'Lightning'], weaponTypes: ['Lança'], description: 'Lança relâmpago que estoura e atinge vários inimigos.' },
  { id: 'sweep', name: 'Sweep', slug: 'Sweep', tags: ['Attack', 'Melee', 'AoE'], weaponTypes: ['Lança', 'Espada'], description: 'Golpe em arco que atinge todos à frente.' },
  { id: 'earthquake', name: 'Earthquake', slug: 'Earthquake', tags: ['Attack', 'Melee', 'Slam', 'AoE'], weaponTypes: ['Clava', 'Machado'], description: 'Slam que causa ondas de choque no chão.' },
  { id: 'companion', name: 'Companion', slug: 'Companion%3A_%7B0%7D', tags: ['Minion', 'Persistent'], weaponTypes: ['Cajado'], description: 'Invoca um companheiro que luta por você.' },
]

// --- Support Gems (gemas de suporte) ---
export interface SupportGemEntry {
  id: string
  name: string
  slug: string
  tags: string[]
  weaponTypes: string[]
}

export const SUPPORT_GEMS: SupportGemEntry[] = [
  { id: 'brutality_i', name: 'Brutality I', slug: 'Brutality_I', tags: ['Physical'], weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança'] },
  { id: 'bloodlust', name: 'Bloodlust', slug: 'Bloodlust', tags: ['Attack', 'Melee', 'Physical'], weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança'] },
  { id: 'aftershock_i', name: 'Aftershock I', slug: 'Aftershock_I', tags: ['Attack', 'Melee', 'Slam'], weaponTypes: ['Clava', 'Machado'] },
  { id: 'impact_shockwave', name: 'Impact Shockwave', slug: 'Impact_Shockwave', tags: ['Attack', 'Melee', 'Strike', 'AoE'], weaponTypes: ['Clava', 'Espada', 'Lança'] },
  { id: 'eternal_flame_i', name: 'Eternal Flame I', slug: 'Eternal_Flame_I', tags: ['Fire'], weaponTypes: ['Clava', 'Cajado', 'Espada', 'Machado'] },
  { id: 'ignite_i', name: 'Ignite I', slug: 'Ignite_I', tags: ['Fire'], weaponTypes: ['Cajado', 'Clava'] },
  { id: 'upheaval_i', name: 'Upheaval I', slug: 'Upheaval_I', tags: ['AoE'], weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança'] },
  { id: 'lifetap', name: 'Lifetap', slug: 'Lifetap', tags: ['Life'], weaponTypes: ['Clava', 'Arco', 'Besta', 'Cajado', 'Espada', 'Lança', 'Machado'] },
  { id: 'double_barrel_i', name: 'Double Barrel I', slug: 'Double_Barrel_I', tags: ['Projectile', 'Ammunition'], weaponTypes: ['Besta'] },
  { id: 'auto_reload', name: 'Auto Reload', slug: 'Auto_Reload', tags: ['Projectile', 'Ammunition'], weaponTypes: ['Besta'] },
  { id: 'flamepierce', name: 'Flamepierce', slug: 'Flamepierce', tags: ['Projectile', 'Fire'], weaponTypes: ['Arco', 'Besta', 'Cajado'] },
  { id: 'acceleration', name: 'Acceleration', slug: 'Acceleration', tags: ['Projectile'], weaponTypes: ['Arco', 'Besta'] },
  { id: 'meat_shield_i', name: 'Meat Shield I', slug: 'Meat_Shield_I', tags: ['Minion'], weaponTypes: ['Cajado'] },
  { id: 'vitality_i', name: 'Vitality I', slug: 'Vitality_I', tags: ['Buff', 'Life'], weaponTypes: ['Cajado', 'Clava', 'Arco', 'Besta', 'Espada', 'Lança', 'Machado'] },
  { id: 'prolonged_duration_i', name: 'Prolonged Duration I', slug: 'Prolonged_Duration_I', tags: ['Duration'], weaponTypes: ['Cajado', 'Clava', 'Arco', 'Besta', 'Espada', 'Lança', 'Machado'] },
  { id: 'armour_break_i', name: 'Armour Break I', slug: 'Armour_Break_I', tags: ['Physical'], weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança'] },
  { id: 'crater', name: 'Crater', slug: 'Crater', tags: ['Attack', 'Melee', 'Fire', 'AoE'], weaponTypes: ['Clava', 'Machado'] },
  { id: 'steadfast_i', name: 'Steadfast I', slug: 'Steadfast_I', tags: ['Channelling'], weaponTypes: ['Clava', 'Cajado'] },
  { id: 'rage_i', name: 'Rage I', slug: 'Rage_I', tags: ['Attack', 'Melee'], weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança'] },
  { id: 'defy_i', name: 'Defy I', slug: 'Defy_I', tags: ['Attack'], weaponTypes: ['Clava', 'Espada', 'Machado', 'Lança', 'Arco', 'Besta'] },
]

// --- Item Modifiers (prefixos e sufixos) - nomes do PoE 2 / poe2db ---
export interface ItemModifierEntry {
  name: string
  slug: string | null
  type: 'prefix' | 'suffix'
  category: 'fire' | 'cold' | 'lightning' | 'physical' | 'life' | 'armour' | 'evasion' | 'resistance' | 'mana' | 'minion' | 'speed'
}

export const ITEM_MODIFIERS: ItemModifierEntry[] = [
  { name: 'Heated', slug: 'Fire_damage', type: 'prefix', category: 'fire' },
  { name: 'Smouldering', slug: 'Fire_damage', type: 'prefix', category: 'fire' },
  { name: 'Burning', slug: 'Fire_damage', type: 'prefix', category: 'fire' },
  { name: 'Flaming', slug: 'Fire_damage', type: 'prefix', category: 'fire' },
  { name: 'of the Ice', slug: 'Cold_damage', type: 'suffix', category: 'cold' },
  { name: 'of the Glacier', slug: 'Cold_damage', type: 'suffix', category: 'cold' },
  { name: 'of the Storm', slug: 'Lightning_Damage', type: 'suffix', category: 'lightning' },
  { name: 'of the Bolt', slug: 'Lightning_Damage', type: 'suffix', category: 'lightning' },
  { name: '+ to maximum Life', slug: 'Life', type: 'prefix', category: 'life' },
  { name: 'increased maximum Life', slug: 'Life', type: 'prefix', category: 'life' },
  { name: 'to Armour', slug: 'Armour', type: 'prefix', category: 'armour' },
  { name: 'increased Armour', slug: 'Armour', type: 'suffix', category: 'armour' },
  { name: 'to Evasion Rating', slug: 'Evasion', type: 'prefix', category: 'evasion' },
  { name: 'increased Evasion', slug: 'Evasion', type: 'suffix', category: 'evasion' },
  { name: 'Fire Resistance', slug: 'Fire_Resistance', type: 'suffix', category: 'resistance' },
  { name: 'Cold Resistance', slug: 'Cold_Resistance', type: 'suffix', category: 'resistance' },
  { name: 'Lightning Resistance', slug: 'Lightning_Resistance', type: 'suffix', category: 'resistance' },
  { name: 'to maximum Mana', slug: 'Mana', type: 'prefix', category: 'mana' },
  { name: 'increased Minion Life', slug: 'Minions', type: 'prefix', category: 'minion' },
  { name: 'increased Minion Damage', slug: 'Minions', type: 'prefix', category: 'minion' },
  { name: 'increased Attack Speed', slug: 'Attack_Speed', type: 'suffix', category: 'speed' },
  { name: 'increased Cast Speed', slug: 'Cast_Speed', type: 'suffix', category: 'speed' },
  { name: 'increased Movement Speed', slug: 'Movement_Speed', type: 'suffix', category: 'speed' },
  { name: 'Block Chance', slug: 'Block', type: 'suffix', category: 'armour' },
  { name: 'Life on Hit', slug: null, type: 'suffix', category: 'life' },
  { name: 'Physical Damage', slug: 'Physical_Damage', type: 'prefix', category: 'physical' },
]

// --- Helpers ---
export function getPoe2DbGemUrl(slug: string): string {
  return gemUrl(slug)
}

export function getPoe2DbModifierUrl(slug: string | null): string | null {
  if (!slug) return null
  return gemUrl(slug)
}

// --- generateBuildFromData ---
import type { Classe, Arma, Foco, BuildRecommendation, GemaComLink } from './buildRecommendations'

/**
 * Filtra as melhores gemas de suporte para a arma e o foco.
 */
function getSupportGemsForBuild(arma: Arma, foco: Foco): GemaComLink[] {
  const byWeapon = SUPPORT_GEMS.filter((g) => g.weaponTypes.includes(arma))
  const priorityTags =
    foco === 'Dano em Área'
      ? ['AoE', 'Fire', 'Cold', 'Physical']
      : foco === 'Sobrevivência'
        ? ['Life', 'Buff', 'Duration']
        : ['Projectile', 'Attack', 'Melee']
  const sorted = [...byWeapon].sort((a, b) => {
    const scoreA = priorityTags.some((t) => a.tags.includes(t)) ? 1 : 0
    const scoreB = priorityTags.some((t) => b.tags.includes(t)) ? 1 : 0
    return scoreB - scoreA
  })
  return sorted.slice(0, 3).map((g) => ({ nome: g.name, url: gemUrl(g.slug) }))
}

/**
 * Busca prefixos/sufixos recomendados para o iniciante conforme o foco e tipo de build.
 */
function getModifiersForBuild(_arma: Arma, foco: Foco): string[] {
  const always: string[] = [
    ITEM_MODIFIERS.find((m) => m.category === 'life' && m.type === 'prefix')?.name ?? '+ to maximum Life',
    ITEM_MODIFIERS.find((m) => m.category === 'resistance')?.name ?? 'Fire Resistance',
  ].filter(Boolean) as string[]

  if (foco === 'Sobrevivência') {
    const def = ITEM_MODIFIERS.filter((m) => ['armour', 'life', 'resistance', 'evasion'].includes(m.category)).slice(0, 5)
    return [...new Set([...always, ...def.map((m) => m.name)])]
  }
  if (foco === 'Velocidade') {
    const speed = ITEM_MODIFIERS.filter((m) => m.category === 'speed' || m.category === 'evasion').slice(0, 4)
    return [...new Set([...always, ...speed.map((m) => m.name)])]
  }
  // Dano em Área: fire/cold/lightning + physical
  const damage = ITEM_MODIFIERS.filter((m) => ['fire', 'cold', 'lightning', 'physical'].includes(m.category)).slice(0, 4)
  return [...new Set([...always, ...damage.map((m) => m.name)])]
}

/**
 * Escolhe a skill principal conforme classe, arma e foco.
 */
function getMainSkillForBuild(classe: Classe, arma: Arma, foco: Foco): SkillGemEntry {
  const forWeapon = SKILL_GEMS.filter((s) => s.weaponTypes.includes(arma))
  const fallback: SkillGemEntry = SKILL_GEMS.find((s) => s.id === 'sunder') ?? SKILL_GEMS[0]!
  if (forWeapon.length === 0) return fallback
  if (foco === 'Sobrevivência' && arma === 'Clava') {
    const shield = forWeapon.find((s) => s.id === 'shield_charge')
    if (shield) return shield
  }
  if (foco === 'Dano em Área' && arma === 'Arco') {
    const rain = forWeapon.find((s) => s.id === 'rain_of_arrows')
    if (rain) return rain
  }
  if (arma === 'Besta') {
    const explosive = forWeapon.find((s) => s.id === 'explosive_spear')
    if (explosive) return explosive
  }
  if (arma === 'Cajado' && classe === 'Witch') {
    const companion = forWeapon.find((s) => s.id === 'companion')
    if (companion && foco === 'Sobrevivência') return companion
    const ice = forWeapon.find((s) => s.id === 'ice_nova')
    if (ice) return ice
  }
  if (arma === 'Cajado') {
    const flame = forWeapon.find((s) => s.id === 'flameblast')
    if (flame) return flame
  }
  return forWeapon[0] ?? fallback
}

const DICAS: Record<Foco, string> = {
  'Dano em Área': 'Priorize vida e resistências nos itens antes de empilhar só dano; cap (75%) as resistências.',
  Sobrevivência: 'Mantenha resistências elementais no cap (75%); depois vida e armadura/block.',
  Velocidade: 'Não negligencie vida: velocidade sem sobrevivência faz você morrer rápido. Kiting é defesa.',
}

/**
 * Gera a build a partir do gameData: filtra gemas por arma, modificadores por foco,
 * e retorna nomes reais com links para o poe2db.tw.
 */
export function generateBuildFromData(
  classe: Classe,
  arma: Arma,
  foco: Foco
): BuildRecommendation {
  const skill = getMainSkillForBuild(classe, arma, foco)
  const gemasSuporte = getSupportGemsForBuild(arma, foco)
  const statusPrioritarios = getModifiersForBuild(arma, foco)
  const dicaDeOuro = DICAS[foco]

  return {
    skillPrincipal: {
      nome: skill.name,
      porQue: skill.description,
      url: gemUrl(skill.slug),
    },
    gemasSuporte,
    statusPrioritarios,
    dicaDeOuro,
  }
}
