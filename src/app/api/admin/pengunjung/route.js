import { getSheets } from "@/lib/googlesheets";

export async function GET(req) {
    try {
        const sheets = await getSheets();
        const spreadsheetId = "1MsE6xTY8wGSSSAsoY-66K-oCVF-vr1EdOLyKzV-pC3E";

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "pengunjung!A:H",
        });

        const rows = response.data.values || [];

        if (rows.length <= 1) {
            return Response.json({ success: true, data: [] });
        }

        // Extract headers (first row)
        const headers = rows[0];

        // Extract data (skip header), map to objects, and reverse array so newest is first
        const data = rows.slice(1).map((row, index) => {
            return {
                id: index, // useful for React keys
                waktu: row[0] || "-",
                uid: row[1] || "-",
                nama: row[2] || "-",
                nim: row[3] || "-",
                prodi: row[4] || "-",
                email: row[5] || "-",
                telepon: row[6] || "-",
                status: row[7] || "-",
            };
        }).reverse();

        return Response.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error("PENGUNJUNG API ERROR:", error);
        return Response.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
