import { useState } from 'react'
import PoeBuildGenerator from './components/PoeBuildGenerator'
import PopularBuildsPage from './components/PopularBuildsPage'

type View = 'gerador' | 'populares'

function App() {
  const [view, setView] = useState<View>('gerador')

  return (
    <div className="min-h-screen bg-poe-dark">
      <nav className="sticky top-0 z-10 border-b border-poe-muted/50 bg-poe-dark/95 backdrop-blur supports-[backdrop-filter]:bg-poe-dark/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-2 py-3">
          <button
            type="button"
            onClick={() => setView('gerador')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'gerador'
                ? 'bg-poe-gold/20 text-poe-gold border border-poe-gold'
                : 'text-poe-text-muted hover:text-poe-gold border border-transparent'
            }`}
          >
            Gerador de build
          </button>
          <button
            type="button"
            onClick={() => setView('populares')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'populares'
                ? 'bg-poe-gold/20 text-poe-gold border border-poe-gold'
                : 'text-poe-text-muted hover:text-poe-gold border border-transparent'
            }`}
          >
            Builds populares
          </button>
        </div>
      </nav>
      {view === 'gerador' && <PoeBuildGenerator />}
      {view === 'populares' && <PopularBuildsPage onBack={() => setView('gerador')} />}
    </div>
  )
}

export default App
