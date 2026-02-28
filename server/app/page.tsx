export default function Home() {
  const appUrl = 'http://localhost:5173'
  return (
    <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '420px' }}>
      <h1 style={{ color: '#c9a227', marginBottom: '0.5rem' }}>Poe Easy Build AI</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        Esta é a API do servidor. A interface do app roda em outro endereço.
      </p>
      <a
        href={appUrl}
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: '#c9a227',
          color: '#1a1a1a',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        }}
      >
        Abrir o app (localhost:5173)
      </a>
      <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '1.5rem' }}>
        Se o app não abrir, rode <code style={{ background: '#333', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>npm run dev</code> na raiz do projeto.
      </p>
    </div>
  )
}
