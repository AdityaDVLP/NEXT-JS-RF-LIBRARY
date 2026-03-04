"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const uidFromScan = searchParams.get("uid")

  const [form, setForm] = useState({
    nama: "",
    nim: "",
    prodi: "",
    email: "",
    telepon: "",
    status: "",
    uid: uidFromScan || ""
  })
  const isFormValid =
    form.nama &&
    form.nim &&
    form.prodi &&
    form.email &&
    form.telepon &&
    form.status &&
    form.uid

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    const data = await res.json()
    alert(data.message)

    // setelah register kembali ke scan
    router.push("/user/scan")
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8">

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 px-8 py-6 text-white text-center">
          <h1 className="text-3xl font-bold">Registrasi Pengunjung</h1>
          <p className="mt-2 text-blue-100">Silakan lengkapi data diri Anda untuk mendaftar.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {uidFromScan && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-sm text-blue-800 font-semibold mb-1">UID Kartu RFID Terdeteksi</p>
                <p className="text-xs text-blue-600 font-mono bg-blue-100 py-1 px-2 rounded inline-block">{uidFromScan}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nama */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                name="nama"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                placeholder="Masukkan nama lengkap Anda"
                required
              />
            </div>

            {/* NIM */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">NIM / NIP / NIPH</label>
              <input
                name="nim"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                placeholder="Masukkan nomor identitas"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white appearance-none"
                required
              >
                <option value="">Pilih Status</option>
                <option>Mahasiswa</option>
                <option>Dosen</option>
                <option>Umum</option>
              </select>
            </div>

            {/* Prodi */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Program Studi / Departemen</label>
              <select
                name="prodi"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white appearance-none"
                required
              >
                <option value="">Pilih Program Studi</option>
                <option>Fisika</option>
                <option>Matematika</option>
                <option>Teknik Mesin</option>
                <option>Teknik Elektro</option>
                <option>Teknik Kimia</option>
                <option>Teknik Material dan Metalurgi</option>
                <option>Teknik Sipil</option>
                <option>Perencanaan Wilayah dan Kota</option>
                <option>Teknik Perkapalan</option>
                <option>Sistem Informasi</option>
                <option>Informatika</option>
                <option>Teknik Industri</option>
                <option>Teknik Lingkungan</option>
                <option>Teknik Kelautan</option>
                <option>Arsitektur</option>
                <option>Statistika</option>
                <option>Ilmu Aktuaria</option>
                <option>Rekayasa Keselamatan</option>
                <option>Teknologi Pangan</option>
                <option>Bisnis Digital</option>
                <option>Teknik Logistik</option>
                <option>Desain Komunikasi Visual</option>
                <option>Lainnya (Umum)</option>
              </select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Utama</label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                placeholder="nama@email.com"
              />
            </div>

            {/* Telepon */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">No. Handphone (WhatsApp)</label>
              <input
                name="telepon"
                type="tel"
                required
                pattern="[0-9]{10,13}"
                minLength={10}
                maxLength={13}
                title="Nomor HP harus 10-13 digit angka"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                placeholder="08xxxxxxxxxx"
              />
            </div>

          </div>

          <div className="pt-6 border-t mt-6">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all flex justify-center items-center gap-2 ${isFormValid
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isFormValid ? "Daftar Sekarang" : "DAFTAR SEBAGAI ANGGOTA"}
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}
