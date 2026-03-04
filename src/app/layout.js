import "./globals.css";

export const metadata = {
  title: "Smart Library RFID",
  description: "Sistem Manajemen Perpustakaan berbasis RFID dan Next.js",
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="light">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">


        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Smart Library
              </h1>
            </div>

            <div className="hidden sm:flex text-sm font-medium text-gray-500">
              PROTOTYPE SMART LIBRARY ITK 
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Universitas Terbuka Library System. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <span>RFID Core Server v1.0</span>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
