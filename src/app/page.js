"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Secret Admin Login: Ctrl + Shift + A
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        router.push("/admin/login");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh]">

      {/* Hero Content */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-4 border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Sistem Sedang Aktif
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Selamat Datang di <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Smart Library
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          Silakan lakukan pemindaian (scan) Kartu Identitas Mahasiswa/Dosen Anda pada mesin RFID yang tersedia untuk mengakses fasilitas perpustakaan.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/user/scan">
            <button className="group relative w-full sm:w-auto flex justify-center items-center gap-3 py-4 px-8 border border-transparent text-lg font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:-translate-y-1">
              <span className="text-2xl group-hover:scale-110 transition-transform">💳</span>
              Mulai Pemindaian RFID
            </button>
          </Link>
        </div>

        <div className="pt-12 text-center border-t border-gray-100 mt-12 w-full">
          <p className="text-sm text-gray-400 mb-4">Pengelola Perpustakaan?</p>
          <Link href="/admin/login" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-white px-6 py-2 rounded-full border border-gray-200">
            🔒 Masuk ke Portal Admin
          </Link>
        </div>

      </div>

    </div>
  );
}
