"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ totalPengunjungHariIni: '...', totalTerdaftar: '...' });
  const [pengunjungData, setPengunjungData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch summary stats
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalPengunjungHariIni: data.totalPengunjungHariIni,
            totalTerdaftar: data.totalTerdaftar
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };

    // Fetch visitor history
    const fetchPengunjung = async () => {
      try {
        const res = await fetch("/api/admin/pengunjung");
        if (res.ok) {
          const json = await res.json();
          setPengunjungData(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch history");
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchPengunjung()]);
      setIsLoading(false);
    };

    loadData();

    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);

  }, []);

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
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <span>📊</span> Ikhtisar
          </button>

          <button
            onClick={() => setActiveTab('pengunjung')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'pengunjung' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <span>👥</span> Data Pengunjung
          </button>
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
      <main className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden flex flex-col">

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ikhtisar Sistem</h1>
                <p className="text-gray-500 mt-1">Selamat datang kembali, pantau status server dan pergerakan literasi.</p>
              </div>
              {isLoading && <p className="text-sm text-blue-500 animate-pulse hidden sm:block">Memperbarui data...</p>}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                <h3 className="text-blue-100 text-sm font-medium mb-1">Pengunjung Hari Ini</h3>
                <p className="text-4xl font-bold">{stats.totalPengunjungHariIni}</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                <h3 className="text-indigo-100 text-sm font-medium mb-1">Anggota Terdaftar</h3>
                <p className="text-4xl font-bold">{stats.totalTerdaftar}</p>
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

            {/* Recent Activity Mini-Table */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
                <button onClick={() => setActiveTab('pengunjung')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Lihat Semua &rarr;</button>
              </div>

              <div className="bg-white border text-sm border-gray-100 rounded-xl overflow-hidden">
                {isLoading && pengunjungData.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Memuat data dari server...</div>
                ) : pengunjungData.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Belum ada aktivitas yang tercatat.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pengunjungData.slice(0, 5).map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{row.waktu}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.nama}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DATA PENGUNJUNG */}
        {activeTab === 'pengunjung' && (
          <div className="animate-in fade-in duration-300 flex flex-col h-full">
            <div className="mb-6 flex justify-between items-center sm:flex-row flex-col">
              <h1 className="text-2xl font-bold text-gray-900">Data Riwayat Pengunjung</h1>
              {isLoading && <p className="text-sm text-blue-500 animate-pulse">Memuat spreadsheet...</p>}
            </div>

            <div className="flex-grow bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Waktu</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">UID Kartu</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">NIM / NIP</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Prodi</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {pengunjungData.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          Data kunjungan masih kosong.
                        </td>
                      </tr>
                    )}
                    {pengunjungData.map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">{row.waktu}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-gray-400">{row.uid}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{row.nama}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">{row.nim}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">{row.prodi}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.status?.toLowerCase() === 'mahasiswa' ? 'bg-green-100 text-green-800' :
                              row.status?.toLowerCase() === 'dosen' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
