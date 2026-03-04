"use client";

export default function StatsCards({ stats }) {
  const cards = [
    { label: "TOTAL KOLEKSI BUKU", value: stats.totalKoleksiBuku ?? "-" },
    { label: "JUMLAH ANGGOTA TERDAFTAR", value: stats.jumlahAnggotaTerdaftar ?? "-" },
    { label: "INDIKATOR (RSSI)", value: stats.indikatorRssi ?? "-" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#1a1f3c] rounded-xl p-5 flex flex-col gap-3 min-h-[120px]"
        >
          <h3 className="text-white text-xs font-bold uppercase tracking-wider">
            {card.label}
          </h3>
          <p className="text-3xl font-extrabold text-yellow-400">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
