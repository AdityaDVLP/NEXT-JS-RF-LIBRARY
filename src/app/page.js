"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        router.push("/admin/login");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1>📚 Smart Library</h1>
      <p>Pilih akses sistem</p>

      <div style={{ marginTop: "40px" }}>
        <Link href="/user/scan">
          <button style={btnStyle}>
            👤 Masuk sebagai Pengunjung
          </button>
        </Link>

        <br /><br />

      </div>
    </div>
  );
}

const btnStyle = {
  padding: "14px 28px",
  fontSize: "16px",
  borderRadius: "8px",
  cursor: "pointer",
  border: "none"
};

const adminBtnStyle = {
  padding: "14px 28px",
  fontSize: "16px",
  borderRadius: "8px",
  cursor: "pointer",
  backgroundColor: "#111827",
  color: "white",
  border: "none"
};