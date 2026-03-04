"use client";

import { useEffect, useState, useMemo } from "react";

function parseWaktu(waktuStr) {
  const cleaned = waktuStr.replace(/(\d{2})\.(\d{2})\.(\d{2})$/, "$1:$2:$3");
  return new Date(cleaned);
}

function exportCSV(logs) {
  const header = "Waktu,UID,Nama,NIM,Prodi,Email,Telepon,Status\n";
  const rows = logs
    .map((l) => `"${l.waktu}","${l.uid}","${l.nama}","${l.nim}","${l.prodi}","${l.email}","${l.telepon}","${l.status}"`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "log-pengunjung.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function LogPengunjung({ data = [], isLoading, onExportCSV }) {
  return (
    <div className="bg-[#1a1f3c] rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-white font-bold uppercase tracking-wide text-sm">
          Log Pengunjung
        </h3>
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/10 transition-colors"
        >
          <span>⬇</span> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {["Waktu", "Nama", "NIM / NIP", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && data.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-xs">
                  Memuat data...
                </td>
              </tr>
            )}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-xs">
                  Belum ada log pengunjung.
                </td>
              </tr>
            )}
            {data.slice(0, 5).map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{row.waktu}</td>
                <td className="px-4 py-3 text-white font-medium">{row.nama}</td>
                <td className="px-4 py-3 text-gray-300 text-xs">{row.nim}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.status?.toLowerCase() === "mahasiswa"
                      ? "bg-blue-500/20 text-blue-400"
                      : row.status?.toLowerCase() === "dosen"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-gray-500/20 text-gray-400"
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
  );
}

export function JumlahPengunjung({ stats }) {
  return (
    <div className="bg-[#1a1f3c] rounded-xl p-6 flex flex-col gap-4">
      <h3 className="text-white font-bold uppercase tracking-wide text-sm">
        Jumlah Pengunjung
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-gray-400 text-sm">Hari Ini</span>
          <span className="text-yellow-400 font-extrabold text-2xl">{stats?.hariIni ?? "-"}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-gray-400 text-sm">Minggu Ini</span>
          <span className="text-white font-bold text-xl">{stats?.mingguIni ?? "-"}</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-400 text-sm">Bulan Ini</span>
          <span className="text-white font-bold text-xl">{stats?.bulanIni ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}

export default function PengunjungDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pengunjung")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setLogs(json.data);
          // Tambah ini untuk debug
          console.log("Sample waktu:", json.data[0]?.waktu);
          console.log("Parsed:", parseWaktu(json.data[0]?.waktu));
          console.log("startOfDay:", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek  = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      hariIni:   logs.filter((l) => parseWaktu(l.waktu) >= startOfDay).length,
      mingguIni: logs.filter((l) => parseWaktu(l.waktu) >= startOfWeek).length,
      bulanIni:  logs.filter((l) => parseWaktu(l.waktu) >= startOfMonth).length,
    };
  }, [logs]);

  return (
    <div className="flex gap-6 flex-wrap">
      <div className="flex-[2] min-w-[320px]">
        <LogPengunjung
          data={logs}
          isLoading={loading}
          onExportCSV={() => exportCSV(logs)}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <JumlahPengunjung stats={stats} />
      </div>
    </div>
  );
}