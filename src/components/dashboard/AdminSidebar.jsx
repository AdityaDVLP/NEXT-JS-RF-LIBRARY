"use client";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const menus = [
    { key: "koleksi", label: "KOLEKSI BUKU" },
    { key: "laporan", label: "LAPORAN" },
    { key: "catatan", label: "CATATAN" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#1a1f3c] flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center text-white text-lg">
          📚
        </div>
        <span className="text-white font-bold text-sm leading-tight">
          Digital Library ITK
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-4 py-6">
        {menus.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveTab(m.key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-colors text-left ${
              activeTab === m.key
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-purple-400">•</span> {m.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
