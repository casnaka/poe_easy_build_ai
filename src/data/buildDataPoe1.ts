/**
 * Arquétipos populares de PoE 1 para a página "Builds populares".
 * Classe + ascendência + build (skill, gemas, passivas) com links para poedb.tw.
 */

import { generateBuildFromDataPoe1 } from './gameDataPoe1'
import type { ClassePoe1 } from './buildRecommendations'
import type { ArmaPoe1, FocoPoe1 } from './gameDataPoe1'
import type { BuildRecommendation } from './buildRecommendations'

export interface ArquetipoPoe1 {
  id: string
  nome: string
  classe: ClassePoe1
  ascendancy: string
  arma: ArmaPoe1
  foco: FocoPoe1
  build: BuildRecommendation
}

/** Link para árvore passiva oficial do PoE 1 */
export const POE1_PASSIVE_TREE_URL = 'https://www.pathofexile.com/passive-skill-tree'

/** 6 arquétipos populares de PoE 1 (classe + ascendência típica). */
export const POE1_ARCHETYPES: ArquetipoPoe1[] = [
  {
    id: 'poe1-marauder-jugg-sunder',
    nome: 'Marauder (Juggernaut) — Sunder',
    classe: 'Marauder',
    ascendancy: 'Juggernaut',
    arma: 'Clava',
    foco: 'Dano em Área',
    build: generateBuildFromDataPoe1('Clava', 'Dano em Área'),
  },
  {
    id: 'poe1-ranger-deadeye-rain',
    nome: 'Ranger (Deadeye) — Rain of Arrows',
    classe: 'Ranger',
    ascendancy: 'Deadeye',
    arma: 'Arco',
    foco: 'Dano em Área',
    build: generateBuildFromDataPoe1('Arco', 'Dano em Área'),
  },
  {
    id: 'poe1-witch-necro-zombie',
    nome: 'Witch (Necromancer) — Invocações',
    classe: 'Witch',
    ascendancy: 'Necromancer',
    arma: 'Cajado',
    foco: 'Sobrevivência',
    build: generateBuildFromDataPoe1('Cajado', 'Sobrevivência'),
  },
  {
    id: 'poe1-duelist-slayer-sweep',
    nome: 'Duelist (Slayer) — Sweep',
    classe: 'Duelist',
    ascendancy: 'Slayer',
    arma: 'Lança',
    foco: 'Velocidade',
    build: generateBuildFromDataPoe1('Lança', 'Velocidade'),
  },
  {
    id: 'poe1-templar-inquisitor-ice',
    nome: 'Templar (Inquisitor) — Ice Nova',
    classe: 'Templar',
    ascendancy: 'Inquisitor',
    arma: 'Cajado',
    foco: 'Dano em Área',
    build: generateBuildFromDataPoe1('Cajado', 'Dano em Área'),
  },
  {
    id: 'poe1-shadow-trickster-contagion',
    nome: 'Shadow (Trickster) — Contágio / ED',
    classe: 'Shadow',
    ascendancy: 'Trickster',
    arma: 'Cajado',
    foco: 'Dano em Área',
    build: generateBuildFromDataPoe1('Cajado', 'Dano em Área'),
  },
]
