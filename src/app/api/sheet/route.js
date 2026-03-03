import { getSheets } from "@/lib/googlesheets";

export async function POST(req) {
  try {
    const { uid, nama } = await req.json();

    const sheets = await getSheets();

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1MsE6xTY8wGSSSAsoY-66K-oCVF-vr1EdOLyKzV-pC3E",
      range: "register!A:G",
      valueInputOption: "RAW",
      requestBody: {
        values: [[uid, nama]],
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message });
  }
}