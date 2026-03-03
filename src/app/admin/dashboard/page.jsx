"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col md:flex-row gap-6">

      {/* Sidebar / Menu */}
      <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">Smart Library</p>
          </div>
        </div>

        <nav className="space-y-2 flex-grow">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-xl">
            <span>📊</span> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-xl transition-colors">
            <span>👥</span> Data Pengunjung
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-xl transition-colors">
            <span>⚙️</span> Pengaturan Sistem
          </a>
        </nav>

        <div className="border-t pt-6 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
          >
            <span>🚪</span> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Ikhtisar Sistem</h1>
          <p className="text-gray-500 mt-1">Selamat datang kembali, Admin!</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/30">
            <h3 className="text-blue-100 text-sm font-medium mb-1">Total Pengunjung Hari Ini</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
            <h3 className="text-indigo-100 text-sm font-medium mb-1">Total Anggota Terdaftar</h3>
            <p className="text-3xl font-bold">-</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl text-white shadow-lg shadow-gray-900/30">
            <h3 className="text-gray-300 text-sm font-medium mb-1">Status Server RFID</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <p className="text-lg font-bold">Online</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
            <p className="text-gray-500">Belum ada aktivitas yang tercatat hari ini.</p>
          </div>
        </div>
      </main>

    </div>
  );
}
