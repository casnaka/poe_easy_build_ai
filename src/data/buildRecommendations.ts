import { generateBuildFromData } from './gameData'
import { generateBuildFromDataPoe1 } from './gameDataPoe1'

export type GameVersion = 'poe1' | 'poe2'
export type Classe = 'Warrior' | 'Ranger' | 'Witch' | 'Monk' | 'Mercenary' | 'Sorceress'
/** Classes do PoE 1 (Marauder, Ranger, Witch, Duelist, Templar, Shadow) */
export type ClassePoe1 = 'Marauder' | 'Ranger' | 'Witch' | 'Duelist' | 'Templar' | 'Shadow'
export type Arma = 'Clava' | 'Arco' | 'Cajado' | 'Lança' | 'Espada' | 'Machado' | 'Besta'
export type Foco = 'Dano em Área' | 'Sobrevivência' | 'Velocidade'

export interface SkillPrincipal {
  nome: string
  porQue: string
  /** URL da skill no poe2db.tw */
  url?: string
}

export interface GemaComLink {
  nome: string
  url: string
}

export interface PassivaSugerida {
  nome: string
  descricao: string
}

export interface BuildRecommendation {
  skillPrincipal: SkillPrincipal
  gemasSuporte: GemaComLink[]
  statusPrioritarios: string[]
  passivasSugeridas: PassivaSugerida[]
  dicaDeOuro: string
}

export function getBuildRecommendation(
  game: GameVersion,
  classe: Classe | ClassePoe1,
  arma: Arma,
  foco: Foco
): BuildRecommendation {
  if (game === 'poe1') {
    const armaPoe1 = arma === 'Besta' ? 'Arco' : arma
    return generateBuildFromDataPoe1(armaPoe1, foco)
  }
  return generateBuildFromData(classe as Classe, arma, foco)
}
