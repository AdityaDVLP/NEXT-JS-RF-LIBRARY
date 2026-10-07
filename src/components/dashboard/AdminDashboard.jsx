'use client'
import { useState } from 'react'

export default function AdminDashboard() {
  const [text, setText] = useState("Halaman Utama")

  return (
    <div>
      <h2>{text}</h2>

      <button onClick={() => setText("Halaman Admin")}>
        Masuk Admin
      </button>
    </div>
  )
}