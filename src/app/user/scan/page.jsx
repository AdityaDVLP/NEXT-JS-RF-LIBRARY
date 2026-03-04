'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function ScanPage() {
  const [status, setStatus] = useState('idle')
  const [scanData, setScanData] = useState(null)
  const intervalRef = useRef(null)
  const router = useRouter()

  const PORT = 5000 // FIX hanya untuk HF

  const startScan = () => {
    setStatus('scanning')
    setScanData(null)

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:${PORT}/api/rfid/status`)
        const data = await res.json()

        if (!data.reader_connected) {
          setStatus('no_reader')
          stopScan()
          return
        }

        if (data.status === 'detected' && data.uid) {
          setScanData(data)
          setStatus('detected')
          stopScan()

          await fetch(`http://localhost:${PORT}/api/rfid/reset`, { method: 'POST' })

          // 🔍 CEK DATABASE DI NEXT.JS
          try {
            const checkRes = await fetch('/api/cek-anggota', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ uid: data.uid })
            })

            const result = await checkRes.json()

            setTimeout(() => {
              if (result.exists) {
                alert("Selamat datang di perpustakaan 📚")
                setScanData(null)
                setStatus('idle')
                startScan()
              } else {
                alert("Maaf anda belum terdaftar")
                router.push(`/user/register?uid=${data.uid}`)
              }
            }, 1500)

          } catch (err) {
            alert("Terjadi kesalahan saat cek database")
            setStatus('error')
          }
        }

      } catch (err) {
        setStatus('error')
        stopScan()
      }
    }, 500)
  }

  const stopScan = () => {
    clearInterval(intervalRef.current)
  }

  const reset = () => {
    setStatus('idle')
    setScanData(null)
    stopScan()
  }

  useEffect(() => {
    return () => stopScan()
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Koneksi Pemindai RFID</h2>
        <p className="mt-2 text-gray-500 text-lg">Silakan dekatkan kartu pada perangkat pembaca (reader).</p>
      </div>

      {/* Scanner Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative transition-all duration-300">

        {/* Top Decorative Bar */}
        <div className={`h-2 w-full transition-colors duration-500 ${status === 'scanning' ? 'bg-blue-500 animate-pulse' :
            status === 'detected' ? 'bg-green-500' :
              status === 'no_reader' || status === 'error' ? 'bg-red-500' :
                'bg-gray-200'
          }`} />

        <div className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[300px] text-center">

          {/* Status: Idle */}
          {status === 'idle' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-4xl">👆</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">Sistem dalam keadaan siaga</p>
              <p className="text-gray-400 text-sm">Tekan tombol di bawah untuk mengaktifkan pemindaian</p>
            </div>
          )}

          {/* Status: Scanning */}
          {status === 'scanning' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="relative w-32 h-32 mx-auto">
                {/* Radar effect */}
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-blue-500/40 rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
                <div className="absolute inset-0 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-5xl animate-pulse">📡</span>
                </div>
              </div>
              <div>
                <p className="text-blue-600 text-xl font-bold tracking-wide">Mencari Sinyal Kartu...</p>
                <p className="text-blue-400 text-sm mt-1 animate-pulse">Mohon tunggu sebentar</p>
              </div>
            </div>
          )}

          {/* Status: Detected */}
          {status === 'detected' && scanData && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-100">
                <span className="text-5xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Kartu Terdeteksi!</h3>

              <div className="inline-block bg-gray-50 rounded-lg px-4 py-2 mt-2 border border-gray-100">
                <p className="text-sm text-gray-500 font-mono"> <span className="text-gray-900 font-bold"></span></p>
                <p className="text-xs text-gray-400 mt-1">{scanData.timestamp}</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-blue-500 mt-6 bg-blue-50 py-2 px-4 rounded-full w-max mx-auto">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium animate-pulse">Memvalidasi Data...</span>
              </div>
            </div>
          )}

          {/* Status: No Reader */}
          {status === 'no_reader' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔌</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Perangkat Tidak Ditemukan</h3>
              <p className="text-orange-600">Pemindai RFID belum terhubung ke komputer.</p>
              <p className="text-gray-500 text-sm">Pastikan kabel USB terpasang dengan baik.</p>
            </div>
          )}

          {/* Status: Error */}
          {status === 'error' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Koneksi Server Gagal</h3>
              <p className="text-red-500">Tidak dapat terhubung ke Service RFID lokal.</p>
              <p className="text-gray-500 text-sm">Pastikan script Python RFID Server berjalan di background (Port 5000).</p>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 p-6 flex justify-center border-t border-gray-100">
          {(status === 'idle' || status === 'error' || status === 'no_reader') && (
            <button
              onClick={startScan}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V1H6zm4 4H6v3h4V5z" />
              </svg>
              Aktifkan Pemindai
            </button>
          )}

          {status === 'scanning' && (
            <button
              onClick={() => { stopScan(); setStatus('idle') }}
              className="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 border border-gray-300 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all shadow-sm active:scale-95"
            >
              Batalkan Operasi
            </button>
          )}
        </div>
      </div>
    </div>
  )

}
