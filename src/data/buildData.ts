import type { Classe, Arma, Foco, BuildRecommendation } from './buildRecommendations'

export interface Arquetipo {
  id: string
  nome: string
  classe: Classe
  arma: Arma
  foco: Foco
  build: BuildRecommendation
}

/**
 * 5 arquétipos populares de PoE 2.
 * A "IA" filtra o resultado correto com base no input do usuário (classe, arma, foco).
 */
export const ARQUETIPOS: Arquetipo[] = [
  {
    id: 'mercenary-besta',
    nome: 'Mercenary Atirador de Besta',
    classe: 'Mercenary',
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
      dicaDeOuro: 'Mantenha distância e use terreno para quebrar linha de visão; flasks de movimento são seus melhores amigos.',
    },
  },
  {
    id: 'witch-invocacoes',
    nome: 'Witch de Invocações',
    classe: 'Witch',
    arma: 'Cajado',
    foco: 'Sobrevivência',
    build: {
      skillPrincipal: {
        nome: 'Raise Zombie / Summon Skeletons',
        porQue: 'Invocações tankam por você e geram dano constante. Jogue seguro atrás dos minions.',
      },
      gemasSuporte: [
        { nome: 'Meat Shield I', url: 'https://poe2db.tw/us/Meat_Shield_I' },
        { nome: 'Vitality I', url: 'https://poe2db.tw/us/Vitality_I' },
        { nome: 'Prolonged Duration I', url: 'https://poe2db.tw/us/Prolonged_Duration_I' },
      ],
      statusPrioritarios: ['Energy Shield', 'Life', 'Mana', 'Minion Damage', 'Elemental Resistances', 'Intelligence'],
      dicaDeOuro: 'Não suba em vida própria: priorize minions fortes e posicione-se longe do perigo.',
    },
  },
  {
    id: 'warrior-tank-clava',
    nome: 'Warrior Tank de Clava',
    classe: 'Warrior',
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
      dicaDeOuro: 'Resistências no cap (75%) primeiro; depois vida e block. Dano vem por último.',
    },
  },
  {
    id: 'ranger-arco-area',
    nome: 'Ranger Dano em Área',
    classe: 'Ranger',
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
      dicaDeOuro: 'Fique em movimento entre os ataques; rangers morrem parados.',
    },
  },
  {
    id: 'sorceress-elemental',
    nome: 'Sorceress Elemental',
    classe: 'Sorceress',
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
