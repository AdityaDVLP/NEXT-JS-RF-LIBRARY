"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import TopBar from "./TopBar";
import WelcomeBanner from "./WelcomeBanner";
import StatsCards from "./StatsCards";
import MonitoringBuku from "./MonitoringBuku";
import { LogPengunjung, JumlahPengunjung } from "./PengunjungWidgets";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("koleksi");
  const [stats, setStats] = useState({
    totalKoleksiBuku: null,
    jumlahAnggotaTerdaftar: null,
    indikatorRssi: null,
    pengunjung: { hariIni: null, mingguIni: null, bulanIni: null },
  });
  const [bukuData, setBukuData] = useState([]);
  const [pengunjungData, setPengunjungData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalKoleksiBuku: data.totalKoleksiBuku ?? null,
            jumlahAnggotaTerdaftar: data.jumlahAnggotaTerdaftar ?? null,
            indikatorRssi: data.indikatorRssi ?? null,
            pengunjung: data.pengunjung ?? {
              hariIni: null,
              mingguIni: null,
              bulanIni: null,
            },
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };

    const fetchBuku = async () => {
      try {
        const res = await fetch("/api/admin/buku");
        if (res.ok) {
          const json = await res.json();
          setBukuData(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch buku");
      }
    };

    const fetchPengunjung = async () => {
      try {
        const res = await fetch("/api/admin/pengunjung");
        if (res.ok) {
          const json = await res.json();
          setPengunjungData(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch pengunjung");
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchBuku(), fetchPengunjung()]);
      setIsLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExportCSV = (filename, data) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(","), ...data.map((r) => keys.map((k) => r[k]).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-col flex-grow overflow-hidden">
        <TopBar userName="Didik Kiswoyo" role="Admin" />

        <main className="flex-grow p-6 overflow-y-auto flex flex-col gap-6">
          {/* Welcome Banner */}
          <WelcomeBanner
            onHubungkan={() => console.log("Hubungkan Reader")}
            onMulai={() => console.log("Mulai")}
          />

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Monitoring Buku */}
          <MonitoringBuku
            data={bukuData}
            isLoading={isLoading}
            onHapus={() => console.log("Hapus")}
            onExportCSV={() => handleExportCSV("monitoring-buku", bukuData)}
          />

          {/* Log Pengunjung + Jumlah Pengunjung */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <LogPengunjung
                data={pengunjungData}
                isLoading={isLoading}
                onExportCSV={() => handleExportCSV("log-pengunjung", pengunjungData)}
              />
            </div>
            <div>
              <JumlahPengunjung stats={stats.pengunjung} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
