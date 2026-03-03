import { getSheets } from "@/lib/googlesheets";

export async function POST(req) {
  try {
    const { uid } = await req.json();

    const sheets = await getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1MsE6xTY8wGSSSAsoY-66K-oCVF-vr1EdOLyKzV-pC3E",
      range: "register!A:G",
    });

    const rows = response.data.values || [];

    // Cek apakah UID ada di kolom pertama (A)
    const found = rows.some(row => row[0] === uid);

    if (found) {
      return Response.json({
        found: true,
        message: "Selamat datang di perpustakaan 📚"
      });
    } else {
      return Response.json({
        found: false,
        message: "Maaf anda belum terdaftar"
      });
    }

  } catch (error) {
    console.error("SCAN ERROR:", error);
    return Response.json({
      found: false,
      message: error.message
    });
  }
}