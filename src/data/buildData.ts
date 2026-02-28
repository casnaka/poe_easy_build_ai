import type { Classe, Arma, Foco, BuildRecommendation } from './buildRecommendations'

/** Nome da ascendência como aparece no poe.ninja (filtro ?class=) */
export const POE2_NINJA_BUILDS_BASE = 'https://poe.ninja/poe2/builds/vaal'

export interface Arquetipo {
  id: string
  nome: string
  classe: Classe
  /** Ascendência (ex.: Witchhunter, Titan). Aparece no nome e no link do poe.ninja. */
  ascendancy: string
  arma: Arma
  foco: Foco
  build: BuildRecommendation
}

/** Gera link direto para builds da ascendência no poe.ninja (liga Fate of the Vaal). */
export function getPoe2NinjaBuildsUrl(ascendancy: string): string {
  return `${POE2_NINJA_BUILDS_BASE}?class=${encodeURIComponent(ascendancy)}`
}

/**
 * 5 arquétipos populares de PoE 2.
 * A "IA" filtra o resultado correto com base no input do usuário (classe, arma, foco).
 */
export const ARQUETIPOS: Arquetipo[] = [
  {
    id: 'mercenary-besta',
    nome: 'Mercenary (Witchhunter) — Atirador de Besta',
    classe: 'Mercenary',
    ascendancy: 'Witchhunter',
    arma: 'Besta',
    foco: 'Velocidade',
    build: {
      skillPrincipal: {
        nome: 'Burst Shot',
        porQue: 'Disparos rápidos e precisos com besta. Alta mobilidade e dano sustentado à distância, ideal para kiting.',
      },
      gemasSuporte: [
        { nome: 'Faster Attacks', url: 'https://poe2db.tw/us/Support_Gems' },
        { nome: 'Added Physical Damage', url: 'https://poe2db.tw/us/Support_Gems' },
        { nome: 'Pierce', url: 'https://poe2db.tw/us/Support_Gems' },
      ],
      statusPrioritarios: ['Life', 'Evasion', 'Physical Damage', 'Attack Speed', 'Dexterity', 'Resistances'],
      passivasSugeridas: [
        { nome: 'Heart of the Warrior', descricao: 'Vida para aguentar hits à distância.' },
        { nome: 'Swift Strikes', descricao: 'Velocidade de ataque e evasão.' },
        { nome: 'Deadly Draw', descricao: 'Dano de projéteis.' },
        { nome: 'Elemental Resistance', descricao: 'Resistências no cap.' },
      ],
      dicaDeOuro: 'Mantenha distância e use terreno para quebrar linha de visão; flasks de movimento são seus melhores amigos.',
    },
  },
  {
    id: 'witch-invocacoes',
    nome: 'Witch (Blood Mage) — Life Remnants',
    classe: 'Witch',
    ascendancy: 'Blood Mage',
    arma: 'Cajado',
    foco: 'Sobrevivência',
    build: {
      skillPrincipal: {
        nome: 'Life Remnants',
        porQue: 'Skill mais usada em Blood Mage no poe.ninja. Converte vida em poder ofensivo e sustentação.',
      },
      gemasSuporte: [
        { nome: 'Lifetap', url: 'https://poe2db.tw/us/Lifetap' },
        { nome: 'Vitality I', url: 'https://poe2db.tw/us/Vitality_I' },
        { nome: 'Prolonged Duration I', url: 'https://poe2db.tw/us/Prolonged_Duration_I' },
      ],
      statusPrioritarios: ['Life', 'Energy Shield', 'Spell Damage', 'Elemental Resistances', 'Mana'],
      passivasSugeridas: [
        { nome: 'Sanguimancy', descricao: 'Passiva mais usada em Blood Mage; central na sinergia de vida/sangue.' },
        { nome: 'Heart of the Warrior', descricao: 'Vida é recurso da build.' },
        { nome: 'Vitality', descricao: 'Regeneração para sustentar custos de vida.' },
        { nome: 'Elemental Resistance', descricao: 'Resistências no cap.' },
      ],
      dicaDeOuro: 'Vida é recurso e defesa: não negligencie pool de vida nem regeneração.',
    },
  },
  {
    id: 'warrior-tank-clava',
    nome: 'Warrior (Titan) — Tank de Clava',
    classe: 'Warrior',
    ascendancy: 'Titan',
    arma: 'Clava',
    foco: 'Sobrevivência',
    build: {
      skillPrincipal: {
        nome: 'Shield Bash',
        porQue: 'Bloqueio e contra-ataque. Você aguenta o dano e responde com golpes pesados.',
      },
      gemasSuporte: [
        { nome: 'Lifetap', url: 'https://poe2db.tw/us/Lifetap' },
        { nome: 'Defy I', url: 'https://poe2db.tw/us/Defy_I' },
        { nome: 'Vitality I', url: 'https://poe2db.tw/us/Vitality_I' },
      ],
      statusPrioritarios: ['Life', 'Block Chance', 'Armour', 'Elemental Resistances', 'Life Regeneration', 'Strength'],
      passivasSugeridas: [
        { nome: 'Heart of the Warrior', descricao: 'Vida prioritária em tank.' },
        { nome: 'Elemental Resistance', descricao: 'Cap 75% resistências.' },
        { nome: 'Vitality', descricao: 'Regeneração.' },
        { nome: 'Armour Breaker', descricao: 'Dano físico contra inimigos.' },
      ],
      dicaDeOuro: 'Resistências no cap (75%) primeiro; depois vida e block. Dano vem por último.',
    },
  },
  {
    id: 'ranger-arco-area',
    nome: 'Ranger (Pathfinder) — Dano em Área com Arco',
    classe: 'Ranger',
    ascendancy: 'Pathfinder',
    arma: 'Arco',
    foco: 'Dano em Área',
    build: {
      skillPrincipal: {
        nome: 'Rain of Arrows',
        porQue: 'Cobre uma área grande com flechas. Perfeito para limpar multidões à distância com segurança.',
      },
      gemasSuporte: [
        { nome: 'Upheaval I', url: 'https://poe2db.tw/us/Upheaval_I' },
        { nome: 'Flamepierce', url: 'https://poe2db.tw/us/Flamepierce' },
        { nome: 'Acceleration', url: 'https://poe2db.tw/us/Acceleration' },
      ],
      statusPrioritarios: ['Life', 'Evasion', 'Physical/Cold Damage', 'Dexterity', 'Resistances'],
      passivasSugeridas: [
        { nome: 'Deadly Draw', descricao: 'Dano de projéteis.' },
        { nome: 'Heart of the Warrior', descricao: 'Vida.' },
        { nome: 'Swift Strikes', descricao: 'Velocidade de ataque.' },
        { nome: 'Elemental Resistance', descricao: 'Resistências.' },
      ],
      dicaDeOuro: 'Fique em movimento entre os ataques; rangers morrem parados.',
    },
  },
  {
    id: 'sorceress-elemental',
    nome: 'Sorceress (Oracle) — Elemental',
    classe: 'Sorceress',
    ascendancy: 'Oracle',
    arma: 'Cajado',
    foco: 'Dano em Área',
    build: {
      skillPrincipal: {
        nome: 'Ice Nova',
        porQue: 'Onda de gelo em área. Controle de multidão e dano elemental consistente.',
      },
      gemasSuporte: [
        { nome: 'Upheaval I', url: 'https://poe2db.tw/us/Upheaval_I' },
        { nome: 'Eternal Flame I', url: 'https://poe2db.tw/us/Eternal_Flame_I' },
        { nome: 'Ignite I', url: 'https://poe2db.tw/us/Ignite_I' },
      ],
      statusPrioritarios: ['Spell Damage', 'Cold/Lightning Damage', 'Energy Shield', 'Intelligence', 'Resistances'],
      passivasSugeridas: [
        { nome: 'Elemental Resistance', descricao: 'Resistências.' },
        { nome: 'Vitality', descricao: 'Regeneração.' },
        { nome: 'Heart of the Warrior', descricao: 'Vida.' },
        { nome: 'Chaos Mastery', descricao: 'Dano elemental/controle.' },
      ],
      dicaDeOuro: 'Congelar inimigos é sua defesa: priorize cold e mantenha distância.',
    },
  },
]

/**
 * Filtra o arquétipo que corresponde ao input do usuário.
 * Primeiro tenta match exato (classe + arma + foco); depois match por classe + arma.
 */
export function getBuildByArchetype(
  classe: Classe,
  arma: Arma,
  foco: Foco
): BuildRecommendation | null {
  const exact = ARQUETIPOS.find(
    (a) => a.classe === classe && a.arma === arma && a.foco === foco
  )
  if (exact) return exact.build

  const byClassWeapon = ARQUETIPOS.find(
    (a) => a.classe === classe && a.arma === arma
  )
  if (byClassWeapon) return byClassWeapon.build

  return null
}
