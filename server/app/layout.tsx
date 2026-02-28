export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#1a1a1a', color: '#ddd', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </body>
    </html>
  )
}
