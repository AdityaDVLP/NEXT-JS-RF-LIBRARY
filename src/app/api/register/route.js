import { getSheets } from "@/lib/googlesheets";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Data register:", data);

    const sheets = await getSheets();

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1MsE6xTY8wGSSSAsoY-66K-oCVF-vr1EdOLyKzV-pC3E",
      range: "register!A:G",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          data.uid,
          data.nama,
          data.nim,
          data.prodi,
          data.email,
          data.telepon,
          data.status
        ]],
      },
    });

    return Response.json({
      success: true,
      message: "Registrasi berhasil disimpan"
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return Response.json({
      success: false,
      message: error.message
    });
  }
}