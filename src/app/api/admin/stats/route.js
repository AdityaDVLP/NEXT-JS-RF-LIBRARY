import { getSheets } from "@/lib/googlesheets";

export async function GET(req) {
    try {
        const sheets = await getSheets();
        const spreadsheetId = "1MsE6xTY8wGSSSAsoY-66K-oCVF-vr1EdOLyKzV-pC3E";

        // Fetch data from "pengunjung" and "register" sheets concurrently
        const [pengunjungRes, registerRes] = await Promise.all([
            sheets.spreadsheets.values.get({
                spreadsheetId,
                range: "pengunjung!A:A", // Only get dates for counting
            }),
            sheets.spreadsheets.values.get({
                spreadsheetId,
                range: "register!A:A", // Only count IDs/UIDs
            })
        ]);

        const pengunjungRows = pengunjungRes.data.values || [];
        const registerRows = registerRes.data.values || [];

        // Calculate "Total Anggota Terdaftar" (exclude header)
        const totalTerdaftar = Math.max(0, registerRows.length - 1);

        // Calculate "Total Pengunjung Hari Ini"
        const today = new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Makassar",
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });

        // Extract today's date from the "Waktu" column (e.g. "03/03/2026, 11:30:00")
        // Note: The date format might differ mildly depending on cell formatting, assuming "DD/MM/YYYY" start
        const todayPrefix = today.split(',')[0].trim();

        let todayCount = 0;
        // Skip header
        for (let i = 1; i < pengunjungRows.length; i++) {
            const timeCell = pengunjungRows[i][0] || "";
            if (timeCell.startsWith(todayPrefix)) {
                todayCount++;
            }
        }

        return Response.json({
            success: true,
            totalPengunjungHariIni: todayCount,
            totalTerdaftar: totalTerdaftar
        });

    } catch (error) {
        console.error("STATS API ERROR:", error);
        return Response.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
