"use client";

export default function MonitoringBuku({ data = [], isLoading, onHapus, onExportCSV }) {
  return (
    <div className="bg-[#1a1f3c] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-white font-bold uppercase tracking-wide text-sm">
          Monitoring Buku
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari..."
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-1 focus:ring-purple-400 w-32"
          />
          <button
            onClick={onHapus}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/10 transition-colors"
          >
            Hapus
          </button>
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/10 transition-colors"
          >
            <span>⬇</span> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {["No", "Judul Buku", "Pengarang", "ISBN", "Kategori", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && data.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-xs">
                  Memuat data...
                </td>
              </tr>
            )}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-xs">
                  Belum ada data buku.
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-4 py-3 text-white font-medium">{row.judul}</td>
                <td className="px-4 py-3 text-gray-300">{row.pengarang}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{row.isbn}</td>
                <td className="px-4 py-3 text-gray-300">{row.kategori}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.status === "Tersedia"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
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
