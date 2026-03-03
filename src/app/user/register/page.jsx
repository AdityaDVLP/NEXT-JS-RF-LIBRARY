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
    <div>
      <h1>Registrasi Pengunjung</h1>

      <form onSubmit={handleSubmit}>

        <p>Nama Lengkap</p>
        <input name="nama" onChange={handleChange} />

        <p>NIM/NIP/NIPH</p>
        <input name="nim" onChange={handleChange} />

        <p>Program Studi</p>
        <select name="prodi" onChange={handleChange}>
          <option value="">Pilih</option>
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
          


        </select>

        <p>Email</p>
        <input name="email" 
        type="email" required 
        onChange={handleChange} />

        <p>No Telepon</p>
        <input name="telepon" type="tel" 
        required 
        pattern="[0-9]{12,13}"
        minLength={12}
        maxLength={13}
        title="Nomor HP harus 12-13 digit angka"
        onChange={handleChange} />

        <p>Status</p>
        <select name="status" onChange={handleChange}>
          <option value="">Pilih</option>
          <option>Mahasiswa</option>
          <option>Dosen</option>
          <option>Umum</option>
        </select>

        <br /><br />
        <button
  type="submit"
  disabled={!isFormValid}
  style={{
    backgroundColor: isFormValid ? "blue" : "gray",
    color: "white",
    cursor: isFormValid ? "pointer" : "not-allowed",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px"
  }}
>
  Register
</button>

      </form>
    </div>
  )
}