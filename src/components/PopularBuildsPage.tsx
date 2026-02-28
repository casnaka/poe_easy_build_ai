import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Trophy,
  Zap,
  Gem,
  TrendingUp,
  Target,
  Lightbulb,
  Sparkles,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { ARQUETIPOS, getPoe2NinjaBuildsUrl } from '../data/buildData'
import { POE1_ARCHETYPES, POE1_PASSIVE_TREE_URL } from '../data/buildDataPoe1'
import type { BuildRecommendation } from '../data/buildRecommendations'

const API_BASE = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? ''

function BuildCard({
  rank,
  nome,
  classe,
  ascendancy,
  arma,
  foco,
  build,
  buildsUrl,
  buildsUrlLabel,
  onExplain,
  explainLoading,
  explanation,
}: {
  rank: number
  nome: string
  classe: string
  ascendancy: string
  arma: string
  foco: string
  build: BuildRecommendation
  buildsUrl: string
  buildsUrlLabel?: string
  onExplain: () => void
  explainLoading: boolean
  explanation: string | null
}) {
  const linkLabel = buildsUrlLabel ?? `Ver builds ${ascendancy} no poe.ninja`
  const [open, setOpen] = useState(false)
  const { skillPrincipal, gemasSuporte, statusPrioritarios, passivasSugeridas, dicaDeOuro } = build

  return (
    <article className="rounded-xl border border-poe-gold/40 bg-poe-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-poe-surface/50 transition-colors"
      >
        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-poe-gold/20 text-poe-gold font-bold text-xl shrink-0">
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-poe-gold truncate">{nome}</h3>
          <p className="text-poe-text-muted text-sm">
            {classe} · {ascendancy} · {arma} · {foco}
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-poe-gold shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-poe-muted shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 sm:p-5 pt-0 pb-5 space-y-4 border-t border-poe-muted/30">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="flex items-center gap-2 text-poe-gold font-semibold mb-2">
                <Zap className="w-4 h-4" />
                Skill principal
              </h4>
              <p className="text-poe-text font-medium">{skillPrincipal.nome}</p>
              <p className="text-poe-text-muted text-sm mt-0.5">{skillPrincipal.porQue}</p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-poe-gold font-semibold mb-2">
                <Gem className="w-4 h-4" />
                Gemas de suporte
              </h4>
              <ul className="text-poe-text text-sm space-y-1">
                {gemasSuporte.map((g, i) => (
                  <li key={i}>
                    <a href={g.url} target="_blank" rel="noopener noreferrer" className="text-poe-gold hover:underline">
                      {g.nome}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h4 className="flex items-center gap-2 text-poe-gold font-semibold mb-2">
              <TrendingUp className="w-4 h-4" />
              Status nos itens
            </h4>
            <div className="flex flex-wrap gap-2">
              {statusPrioritarios.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-poe-surface border border-poe-muted/50 text-poe-text text-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="flex items-center gap-2 text-poe-gold font-semibold mb-2">
              <Target className="w-4 h-4" />
              Passivas principais
            </h4>
            <ol className="text-poe-text text-sm list-decimal list-inside space-y-0.5">
              {passivasSugeridas.map((p, i) => (
                <li key={i}>
                  <span className="font-medium text-poe-gold">{p.nome}</span>
                  <span className="text-poe-text-muted"> — {p.descricao}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-poe-text-muted text-sm italic flex items-start gap-2">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-poe-gold" />
            {dicaDeOuro}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={onExplain}
              disabled={explainLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-poe-gold/20 text-poe-gold border border-poe-gold hover:bg-poe-gold hover:text-poe-dark disabled:opacity-60 transition-colors text-sm font-medium"
            >
              {explainLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Explicando…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Explicar com IA
                </>
              )}
            </button>
            <a
              href={buildsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-poe-muted/50 text-poe-text-muted hover:border-poe-gold hover:text-poe-gold transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {linkLabel}
            </a>
          </div>

          {explanation && (
            <div className="mt-4 p-4 rounded-lg bg-poe-surface border border-poe-muted/50 text-poe-text prose prose-invert prose-headings:text-poe-gold prose-sm max-w-none">
              <h4 className="text-poe-gold font-semibold mb-2">Explicação da build (IA)</h4>
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function PopularBuildsPage({ onBack }: { onBack: () => void }) {
  const [explainId, setExplainId] = useState<string | null>(null)
  const [explainLoading, setExplainLoading] = useState(false)
  const [explainText, setExplainText] = useState<Record<string, string>>({})
  const [explainUrl, setExplainUrl] = useState('')
  const [explainSummary, setExplainSummary] = useState('')
  const [explainFromUrlLoading, setExplainFromUrlLoading] = useState(false)
  const [explainFromUrlError, setExplainFromUrlError] = useState<string | null>(null)
  const [explainFromUrlText, setExplainFromUrlText] = useState<string | null>(null)
  const [popularGame, setPopularGame] = useState<'poe2' | 'poe1'>('poe2')

  const handleExplain = async (id: string, build: BuildRecommendation, nome: string, classe: string, arma: string, foco: string) => {
    if (explainLoading) return
    setExplainId(id)
    setExplainLoading(true)
    try {
      const url = `${API_BASE}/api/explain-build`.replace(/([^:]\/)\/+/g, '$1')
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildName: nome,
          classe,
          arma,
          foco,
          skillPrincipal: build.skillPrincipal,
          gemasSuporte: build.gemasSuporte,
          statusPrioritarios: build.statusPrioritarios,
          passivasSugeridas: build.passivasSugeridas,
          dicaDeOuro: build.dicaDeOuro,
        }),
      })
      const raw = await res.text()
      let data: { explanation?: string; error?: string }
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        if (!res.ok) throw new Error(raw || `Erro ${res.status}`)
        throw new Error('Resposta inválida.')
      }
      if (!res.ok) throw new Error(data?.error ?? (raw || `Erro ${res.status}`))
      setExplainText((prev) => ({ ...prev, [id]: data.explanation ?? '' }))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao gerar explicação.'
      setExplainText((prev) => ({ ...prev, [id]: `**Erro:** ${msg}` }))
    } finally {
      setExplainLoading(false)
      setExplainId(null)
    }
  }

  const handleExplainFromUrl = async () => {
    if (explainFromUrlLoading) return
    if (!explainUrl.trim() && !explainSummary.trim()) {
      setExplainFromUrlError('Cole o link do personagem no poe.ninja ou um resumo da build.')
      return
    }
    setExplainFromUrlError(null)
    setExplainFromUrlText(null)
    setExplainFromUrlLoading(true)
    try {
      const apiUrl = `${API_BASE}/api/explain-build-from-url`.replace(/([^:]\/)\/+/g, '$1')
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: explainUrl.trim() || undefined,
          buildSummary: explainSummary.trim() || undefined,
        }),
      })
      const raw = await res.text()
      let data: { explanation?: string; error?: string }
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        if (!res.ok) throw new Error(raw || `Erro ${res.status}`)
        throw new Error('Resposta inválida.')
      }
      if (!res.ok) throw new Error(data?.error ?? (raw || `Erro ${res.status}`))
      setExplainFromUrlText(data.explanation ?? '')
    } catch (e) {
      setExplainFromUrlError(e instanceof Error ? e.message : 'Erro ao explicar build.')
    } finally {
      setExplainFromUrlLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-poe-gold flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            Builds mais populares (PoE 1 e PoE 2)
          </h1>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-poe-muted text-poe-text-muted hover:border-poe-gold hover:text-poe-gold transition-colors"
          >
            Voltar ao gerador
          </button>
        </div>
        <p className="text-poe-text-muted text-sm mb-6">
          Ranking de builds populares para PoE 1 e PoE 2. Use a aba para alternar entre os jogos. Clique em uma build para ver detalhes e &quot;Explicar com IA&quot; para entender por que cada item e passiva.
        </p>

        <section className="rounded-xl border border-poe-gold/40 bg-poe-card p-4 sm:p-5 mb-8">
          <h2 className="text-lg font-bold text-poe-gold mb-3">Explicar build do poe.ninja</h2>
          <p className="text-poe-text-muted text-sm mb-4">
            Cole o link de um personagem no poe.ninja (ex.: página do character) e a IA explica a build: por que esses itens, passivas e skills. Se a página não carregar direito, cole um resumo da build no campo abaixo.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-poe-text-muted text-xs mb-1">Link do personagem (poe.ninja)</label>
              <input
                type="url"
                value={explainUrl}
                onChange={(e) => { setExplainFromUrlError(null); setExplainUrl(e.target.value); }}
                placeholder="https://poe.ninja/poe2/builds/vaal/character/..."
                className="w-full bg-poe-surface border border-poe-muted/50 rounded-lg px-3 py-2 text-poe-text placeholder:text-poe-text-muted focus:border-poe-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-poe-text-muted text-xs mb-1">Ou cole um resumo da build (itens, passivas, skills)</label>
              <textarea
                value={explainSummary}
                onChange={(e) => { setExplainFromUrlError(null); setExplainSummary(e.target.value); }}
                placeholder="Ex.: Stormweaver, Life 3500, skill principal X, passivas A B C..."
                rows={3}
                className="w-full bg-poe-surface border border-poe-muted/50 rounded-lg px-3 py-2 text-poe-text placeholder:text-poe-text-muted focus:border-poe-gold focus:outline-none resize-y"
              />
            </div>
            <button
              type="button"
              onClick={handleExplainFromUrl}
              disabled={explainFromUrlLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-poe-gold/20 text-poe-gold border border-poe-gold hover:bg-poe-gold hover:text-poe-dark disabled:opacity-60 transition-colors text-sm font-medium"
            >
              {explainFromUrlLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Explicando…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Explicar build com IA
                </>
              )}
            </button>
          </div>
          {explainFromUrlError && (
            <p className="mt-3 text-red-400 text-sm">{explainFromUrlError}</p>
          )}
          {explainFromUrlText && (
            <div className="mt-4 p-4 rounded-lg bg-poe-surface border border-poe-muted/50 text-poe-text prose prose-invert prose-headings:text-poe-gold prose-sm max-w-none">
              <h4 className="text-poe-gold font-semibold mb-2">Explicação da build (IA)</h4>
              <ReactMarkdown>{explainFromUrlText}</ReactMarkdown>
            </div>
          )}
        </section>

        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-bold text-poe-gold">Ranking fixo (arquétipos)</h2>
          <div className="flex rounded-lg border border-poe-muted/50 p-0.5">
            <button
              type="button"
              onClick={() => setPopularGame('poe2')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${popularGame === 'poe2' ? 'bg-poe-gold/20 text-poe-gold' : 'text-poe-text-muted hover:text-poe-gold'}`}
            >
              PoE 2
            </button>
            <button
              type="button"
              onClick={() => setPopularGame('poe1')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${popularGame === 'poe1' ? 'bg-poe-gold/20 text-poe-gold' : 'text-poe-text-muted hover:text-poe-gold'}`}
            >
              PoE 1
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {popularGame === 'poe2' &&
            ARQUETIPOS.map((a, index) => (
              <BuildCard
                key={a.id}
                rank={index + 1}
                nome={a.nome}
                classe={a.classe}
                ascendancy={a.ascendancy}
                arma={a.arma}
                foco={a.foco}
                build={a.build}
                buildsUrl={getPoe2NinjaBuildsUrl(a.ascendancy)}
                onExplain={() => handleExplain(a.id, a.build, a.nome, a.classe, a.arma, a.foco)}
                explainLoading={explainId === a.id && explainLoading}
                explanation={explainText[a.id] ?? null}
              />
            ))}
          {popularGame === 'poe1' &&
            POE1_ARCHETYPES.map((a, index) => (
              <BuildCard
                key={a.id}
                rank={index + 1}
                nome={a.nome}
                classe={a.classe}
                ascendancy={a.ascendancy}
                arma={a.arma}
                foco={a.foco}
                build={a.build}
                buildsUrl={POE1_PASSIVE_TREE_URL}
                buildsUrlLabel="Árvore passiva (PoE 1)"
                onExplain={() => handleExplain(a.id, a.build, a.nome, a.classe, a.arma, a.foco)}
                explainLoading={explainId === a.id && explainLoading}
                explanation={explainText[a.id] ?? null}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
