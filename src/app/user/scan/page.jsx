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
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">Scan Kartu Anda </h1>

      {/* Status Display */}
      <div className="p-6 rounded-xl border w-80 text-center shadow-sm">
        {status === 'idle' && (
          <p className="text-gray-500">Tekan tombol untuk mulai scan</p>
        )}

        {status === 'scanning' && (
          <div>
            <div className="animate-pulse text-blue-500 text-4xl mb-2"></div>
            <p className="text-blue-500 font-medium">Menunggu kartu RFID...</p>
          </div>
        )}

        {status === 'detected' && scanData && (
          <div className="text-green-600">
            <div className="text-4xl mb-2">✅</div>
            <p className="font-bold">Kartu Terdeteksi!</p>
            <p className="text-xs text-gray-400 mt-1">{scanData.timestamp}</p>
            <p className="text-xs text-blue-400 mt-2 animate-pulse">
              Memeriksa UID anda...
            </p>
          </div>
        )}

        {status === 'no_reader' && (
          <div className="text-red-500">
            <div className="text-4xl mb-2">⚠️</div>
            <p>Reader tidak terdeteksi.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-red-500">
            <div className="text-4xl mb-2">❌</div>
            <p>Tidak bisa terhubung ke server.</p>
            <p className="text-xs mt-1">
              Pastikan server RFID dan Next.js berjalan.
            </p>
          </div>
        )}
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-3">
        {(status === 'idle' || status === 'error' || status === 'no_reader') && (
          <button
            onClick={startScan}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Mulai Scan
          </button>
        )}

        {status === 'scanning' && (
          <button
            onClick={() => { stopScan(); setStatus('idle') }}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Batal
          </button>
        )}
      </div>
    </div>
  )
}
