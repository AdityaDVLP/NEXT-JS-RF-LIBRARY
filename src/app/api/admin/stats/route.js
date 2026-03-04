import { getSheets } from "@/lib/googlesheets";

export async function GET(req) {
  try {
    const sheets = await getSheets();
    const spreadsheetId = "1MsE6xTY8wGSSSAsoY-66K-oCVF-vr1EdOLyKzV-pC3E";

    // Ambil data dari sheet "pengunjung" dan "register" secara paralel
    const [pengunjungRes, registerRes] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "pengunjung!A:A", // hanya kolom waktu
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "register!A:A", // untuk hitung anggota terdaftar
      }),
    ]);

    const pengunjungRows = pengunjungRes.data.values || [];
    const registerRows = registerRes.data.values || [];

    // Total anggota terdaftar (exclude header)
    const totalTerdaftar = Math.max(0, registerRows.length - 1);

    const now = new Date();

    // Hari ini
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Minggu ini = 7 hari terakhir (termasuk hari ini)
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    // Bulan ini = dari tanggal 1 di bulan berjalan
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let hariIni = 0;
    let mingguIni = 0;
    let bulanIni = 0;

    // Lewati header, mulai dari index 1
    for (let i = 1; i < pengunjungRows.length; i++) {
      const timeCell = pengunjungRows[i][0];
      if (!timeCell) continue;

      // Format di sheet: "dd/mm/yyyy, hh:mm:ss" atau "dd/mm/yyyy hh:mm:ss"
      const cleaned = timeCell.replace(",", "").trim();
      const [tanggal, jam] = cleaned.split(" ");
      if (!tanggal || !jam) continue;

      const [day, month, year] = tanggal.split("/").map(Number);
      const [hour, minute, second] = jam.split(/[.:]/).map(Number);

      const rowDate = new Date(
        year,
        month - 1,
        day,
        hour || 0,
        minute || 0,
        second || 0
      );

      // Hari ini
      if (
        rowDate.getDate() === now.getDate() &&
        rowDate.getMonth() === now.getMonth() &&
        rowDate.getFullYear() === now.getFullYear()
      ) {
        hariIni++;
      }

      // Minggu ini (7 hari terakhir)
      if (rowDate >= startOfWeek && rowDate <= now) {
        mingguIni++;
      }

      // Bulan ini
      if (rowDate >= startOfMonth && rowDate <= now) {
        bulanIni++;
      }
    }

    return Response.json({
      success: true,
      totalKoleksiBuku: null,
      jumlahAnggotaTerdaftar: totalTerdaftar,
      indikatorRssi: null,
      pengunjung: {
        hariIni,
        mingguIni,
        bulanIni,
      },
    });
  } catch (error) {
    console.error("STATS API ERROR:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
