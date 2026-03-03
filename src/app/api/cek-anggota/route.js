import { getSheets } from "@/lib/googlesheets"

export async function POST(req) {
  try {
    const { uid } = await req.json()

    if (!uid) {
      return Response.json(
        { error: true, message: "UID tidak dikirim" },
        { status: 400 }
      )
    }

    const sheets = await getSheets()
    const spreadsheetId = "1MsE6xTY8wGSSSAsoY-66K-oCVF-vr1EdOLyKzV-pC3E"

    // 🔥 Samakan format UID dari scan
    const uidFormatted = uid.trim().toUpperCase()

    // 1️⃣ Ambil data dari sheet register
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "register!A:G",
    })

    const rows = response.data.values || []

    // Skip header
    const dataRows = rows.slice(1)

    // 2️⃣ Cari UID dengan format yang sama
    const ditemukan = dataRows.find(row =>
      row[0]?.trim().toUpperCase() === uidFormatted
    )

    if (ditemukan) {

      // 🔥 Waktu real-time WITA (GMT+8)
      const waktuWITA = new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Makassar",
        hour12: false
      })

      // 3️⃣ Tambahkan ke sheet "pengunjung"
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "pengunjung!A:H",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            waktuWITA,      // Kolom A = Waktu
            ditemukan[0],   // UID
            ditemukan[1],   // Nama
            ditemukan[2],   // NIM
            ditemukan[3],   // Prodi
            ditemukan[4],   // Email
            ditemukan[5],   // Telepon
            ditemukan[6],   // Status
          ]]
        }
      })

      return Response.json({
        exists: true,
        nama: ditemukan[1],
      })

    } else {
      return Response.json({
        exists: false
      })
    }

  } catch (error) {
    console.error("CEK ANGGOTA ERROR:", error)

    return Response.json(
      {
        error: true,
        message: error.message
      },
      { status: 500 }
    )
  }
}