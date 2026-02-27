import { useState } from 'react'
import {
  Shield,
  Swords,
  Crosshair,
  Zap,
  Sparkles,
  Hammer,
  BookOpen,
  ArrowUp,
  Sword,
  Axe,
  Flame,
  Heart,
  Wind,
  ChevronLeft,
  ChevronRight,
  Gem,
  TrendingUp,
  Lightbulb,
} from 'lucide-react'
import {
  getBuildRecommendation,
  type GameVersion,
  type Classe,
  type ClassePoe1,
  type Arma,
  type Foco,
  type BuildRecommendation,
} from '../data/buildRecommendations'
import { Gamepad2 } from 'lucide-react'

const GAME_OPTIONS: { id: GameVersion; label: string; sublabel: string; icon: React.ReactNode }[] = [
  { id: 'poe1', label: 'Path of Exile 1', sublabel: 'poedb.tw', icon: <Gamepad2 className="w-10 h-10" /> },
  { id: 'poe2', label: 'Path of Exile 2', sublabel: 'poe2db.tw', icon: <Gamepad2 className="w-10 h-10" /> },
]

const CLASSES_POE2: { id: Classe; label: string; icon: React.ReactNode }[] = [
  { id: 'Warrior', label: 'Warrior', icon: <Shield className="w-8 h-8" /> },
  { id: 'Ranger', label: 'Ranger', icon: <Crosshair className="w-8 h-8" /> },
  { id: 'Witch', label: 'Witch', icon: <Sparkles className="w-8 h-8" /> },
  { id: 'Monk', label: 'Monk', icon: <Zap className="w-8 h-8" /> },
  { id: 'Mercenary', label: 'Mercenary', icon: <Swords className="w-8 h-8" /> },
  { id: 'Sorceress', label: 'Sorceress', icon: <BookOpen className="w-8 h-8" /> },
]

const CLASSES_POE1: { id: ClassePoe1; label: string; icon: React.ReactNode }[] = [
  { id: 'Marauder', label: 'Marauder', icon: <Shield className="w-8 h-8" /> },
  { id: 'Ranger', label: 'Ranger', icon: <Crosshair className="w-8 h-8" /> },
  { id: 'Witch', label: 'Witch', icon: <Sparkles className="w-8 h-8" /> },
  { id: 'Duelist', label: 'Duelist', icon: <Swords className="w-8 h-8" /> },
  { id: 'Templar', label: 'Templar', icon: <Zap className="w-8 h-8" /> },
  { id: 'Shadow', label: 'Shadow', icon: <BookOpen className="w-8 h-8" /> },
]

const ARMAS_ALL: { id: Arma; label: string; icon: React.ReactNode }[] = [
  { id: 'Clava', label: 'Clava', icon: <Hammer className="w-8 h-8" /> },
  { id: 'Arco', label: 'Arco', icon: <Crosshair className="w-8 h-8" /> },
  { id: 'Besta', label: 'Besta', icon: <Crosshair className="w-8 h-8" /> },
  { id: 'Cajado', label: 'Cajado', icon: <BookOpen className="w-8 h-8" /> },
  { id: 'Lança', label: 'Lança', icon: <ArrowUp className="w-8 h-8" /> },
  { id: 'Espada', label: 'Espada', icon: <Sword className="w-8 h-8" /> },
  { id: 'Machado', label: 'Machado', icon: <Axe className="w-8 h-8" /> },
]
const ARMAS_POE1 = ARMAS_ALL.filter((a) => a.id !== 'Besta')

const FOCOS: { id: Foco; label: string; icon: React.ReactNode }[] = [
  { id: 'Dano em Área', label: 'Dano em Área', icon: <Flame className="w-8 h-8" /> },
  { id: 'Sobrevivência', label: 'Sobrevivência', icon: <Heart className="w-8 h-8" /> },
  { id: 'Velocidade', label: 'Velocidade', icon: <Wind className="w-8 h-8" /> },
]

function GameCard({
  selected,
  onSelect,
  option,
}: {
  selected: GameVersion | null
  onSelect: (id: GameVersion) => void
  option: (typeof GAME_OPTIONS)[number]
}) {
  const isSelected = selected === option.id
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`
        flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 transition-all duration-300
        min-h-[120px] text-poe-text
        ${isSelected
          ? 'border-poe-gold bg-poe-card shadow-lg shadow-poe-gold/20 scale-[1.02]'
          : 'border-poe-muted/50 bg-poe-surface hover:border-poe-gold/70 hover:bg-poe-card/80'
        }
      `}
    >
      <span className="text-poe-gold">{option.icon}</span>
      <span className="font-bold text-lg">{option.label}</span>
      <span className="text-poe-text-muted text-sm">{option.sublabel}</span>
    </button>
  )
}

function Card<T extends string>({
  selected,
  onSelect,
  option,
}: {
  selected: T | null
  onSelect: (id: T) => void
  option: { id: T; label: string; icon: React.ReactNode }
}) {
  const isSelected = selected === option.id
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`
        flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-300
        min-h-[100px] text-poe-text
        ${isSelected
          ? 'border-poe-gold bg-poe-card shadow-lg shadow-poe-gold/20 scale-[1.02]'
          : 'border-poe-muted/50 bg-poe-surface hover:border-poe-gold/70 hover:bg-poe-card/80'
        }
      `}
    >
      <span className="text-poe-gold">{option.icon}</span>
      <span className="font-medium text-sm sm:text-base">{option.label}</span>
    </button>
  )
}

function StepTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-poe-gold/20 text-poe-gold font-bold">
        {step}
      </span>
      <h2 className="text-xl sm:text-2xl font-semibold text-poe-text">{title}</h2>
    </div>
  )
}

function ResultView({
  recommendation,
  onReset,
}: {
  recommendation: BuildRecommendation
  onReset: () => void
}) {
  const { skillPrincipal, gemasSuporte, statusPrioritarios, dicaDeOuro } = recommendation
  return (
    <div className="space-y-6 opacity-0 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-poe-gold">Sua build recomendada</h2>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-lg border-2 border-poe-gold text-poe-gold hover:bg-poe-gold hover:text-poe-dark transition-colors"
        >
          Nova build
        </button>
      </div>

      <section className="rounded-lg border border-poe-gold/50 bg-poe-card p-4 sm:p-6">
        <h3 className="flex items-center gap-2 text-poe-gold font-semibold mb-2">
          <Zap className="w-5 h-5" />
          Skill principal
        </h3>
        <p className="text-lg font-medium text-poe-text">
          {skillPrincipal.url ? (
            <a
              href={skillPrincipal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-poe-gold hover:underline"
            >
              {skillPrincipal.nome}
            </a>
          ) : (
            skillPrincipal.nome
          )}
        </p>
        <p className="text-poe-text-muted mt-1">{skillPrincipal.porQue}</p>
      </section>

      <section className="rounded-lg border border-poe-gold/50 bg-poe-card p-4 sm:p-6">
        <h3 className="flex items-center gap-2 text-poe-gold font-semibold mb-3">
          <Gem className="w-5 h-5" />
          Gemas de suporte
        </h3>
        <ul className="space-y-2">
          {gemasSuporte.map((gema, i) => (
            <li key={i} className="flex items-center gap-2 text-poe-text">
              <span className="text-poe-gold">•</span>
              <a
                href={gema.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-poe-gold hover:underline"
              >
                {gema.nome}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-poe-gold/50 bg-poe-card p-4 sm:p-6">
        <h3 className="flex items-center gap-2 text-poe-gold font-semibold mb-3">
          <TrendingUp className="w-5 h-5" />
          Status prioritários nos itens
        </h3>
        <div className="flex flex-wrap gap-2">
          {statusPrioritarios.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-poe-surface border border-poe-muted/50 text-poe-text text-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-lg border-2 border-poe-gold bg-poe-gold/10 p-4 sm:p-6">
        <h3 className="flex items-center gap-2 text-poe-gold font-semibold mb-2">
          <Lightbulb className="w-5 h-5" />
          Dica de ouro
        </h3>
        <p className="text-poe-text font-medium italic">&ldquo;{dicaDeOuro}&rdquo;</p>
      </section>
    </div>
  )
}

export default function PoeBuildGenerator() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [gameVersion, setGameVersion] = useState<GameVersion | null>(null)
  const [classe, setClasse] = useState<Classe | ClassePoe1 | null>(null)
  const [arma, setArma] = useState<Arma | null>(null)
  const [foco, setFoco] = useState<Foco | null>(null)
  const [recommendation, setRecommendation] = useState<BuildRecommendation | null>(null)
  const [animKey, setAnimKey] = useState(0)

  const goNext = () => {
    if (step === 1 && gameVersion) {
      setAnimKey((k) => k + 1)
      setStep(2)
    } else if (step === 2 && classe) {
      setAnimKey((k) => k + 1)
      setStep(3)
    } else if (step === 3 && arma) {
      setAnimKey((k) => k + 1)
      setStep(4)
    } else if (step === 4 && gameVersion && classe && arma && foco) {
      setRecommendation(getBuildRecommendation(gameVersion, classe, arma, foco))
    }
  }

  const goBack = () => {
    if (step === 1) return
    setAnimKey((k) => k + 1)
    if (step === 2) setClasse(null)
    setStep((s) => (s - 1) as 1 | 2 | 3 | 4)
  }

  const canNext =
    (step === 1 && gameVersion) || (step === 2 && classe) || (step === 3 && arma) || (step === 4 && foco)
  const isLastStep = step === 4

  const reset = () => {
    setStep(1)
    setGameVersion(null)
    setClasse(null)
    setArma(null)
    setFoco(null)
    setRecommendation(null)
    setAnimKey((k) => k + 1)
  }

  const armasList = gameVersion === 'poe1' ? ARMAS_POE1 : ARMAS_ALL
  const classesList = gameVersion === 'poe2' ? CLASSES_POE2 : gameVersion === 'poe1' ? CLASSES_POE1 : []

  if (recommendation) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <ResultView recommendation={recommendation} onReset={reset} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-poe-gold mb-1">
            Poe Easy Build AI
          </h1>
          <p className="text-poe-text-muted">Assistente de builds para PoE 1 e PoE 2 — para iniciantes</p>
        </header>

        <div className="flex gap-2 justify-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 max-w-[60px] rounded-full transition-colors ${
                s <= step ? 'bg-poe-gold' : 'bg-poe-muted/50'
              }`}
            />
          ))}
        </div>

        <div
          key={animKey}
          className="rounded-xl border border-poe-gold/30 bg-poe-surface/80 p-6 sm:p-8 transition-all duration-300 ease-out opacity-0 animate-stepIn"
        >
          {step === 1 && (
            <>
              <StepTitle step={1} title="Escolha o jogo" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAME_OPTIONS.map((g) => (
                  <GameCard
                    key={g.id}
                    selected={gameVersion}
                    onSelect={setGameVersion}
                    option={g}
                  />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepTitle step={2} title="Escolha a classe" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {classesList.map((c) => (
                  <Card
                    key={c.id}
                    selected={classe}
                    onSelect={(id) => setClasse(id as Classe | ClassePoe1)}
                    option={c}
                  />
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepTitle step={3} title="Escolha a arma" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {armasList.map((a) => (
                  <Card key={a.id} selected={arma} onSelect={setArma} option={a} />
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <StepTitle step={4} title="Escolha o foco" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FOCOS.map((f) => (
                  <Card key={f.id} selected={foco} onSelect={setFoco} option={f} />
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between mt-8 gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-poe-muted text-poe-text-muted hover:border-poe-gold hover:text-poe-gold disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={`flex items-center gap-1 px-6 py-2 rounded-lg font-medium transition-colors ${
                isLastStep
                  ? 'bg-poe-blood hover:bg-poe-blood-light text-white border border-poe-blood'
                  : 'bg-poe-gold/20 text-poe-gold border border-poe-gold hover:bg-poe-gold hover:text-poe-dark'
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              {isLastStep ? 'Gerar build' : 'Próximo'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
