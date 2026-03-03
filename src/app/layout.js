export const metadata = {
  title: "Latihan Smart Library",
  description: "Belajar Next.js dasar",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ background: "#eee", padding: "10px" }}>
          <h2>📚 Smart Library</h2>
        </header>

        <main style={{ padding: "20px" }}>
          {children}
        </main>

        <footer style={{ background: "#eee", padding: "10px" }}>
          <p>© 2026 Aditya</p>
        </footer>
      </body>
    </html>
  )
} 