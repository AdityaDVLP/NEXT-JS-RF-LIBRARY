"use client";

export default function WelcomeBanner({ onHubungkan, onMulai }) {
  return (
    <div className="w-full bg-[#1a1f3c] border-2 border-purple-500 rounded-xl px-8 py-6">
      <h2 className="text-yellow-400 font-extrabold text-xl uppercase tracking-wide mb-2">
        Selamat Datang Admin Perpustakaan ITK
      </h2>
      <p className="text-gray-300 text-sm mb-5">
        Smart Library siap untuk memindai.{" "}
        <button
          onClick={onHubungkan}
          className="text-blue-400 underline hover:text-blue-300 transition-colors"
        >
          Klik Hubungkan Reader
        </button>{" "}
        untuk memulai
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onHubungkan}
          className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg text-sm transition-colors"
        >
          Hubungkan Reader
        </button>
        <button
          onClick={onMulai}
          className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-sm border border-white/20 transition-colors"
        >
          <span>▶</span> Mulai
        </button>
      </div>
    </div>
  );
}
