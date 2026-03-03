"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      alert("Password salah!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>🔐 Login Admin</h2>

      <input
        type="password"
        placeholder="Masukkan password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", marginTop: "20px" }}
      />

      <br /><br />

      <button onClick={handleLogin} style={btnStyle}>
        Login
      </button>
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  cursor: "pointer",
};