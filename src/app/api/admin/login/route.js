import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();

  const ADMIN_PASSWORD = "anakkeren"; // ganti sesuai kebutuhan

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin-auth", "true", {
      httpOnly: true,
      path: "/",
    });

    return response;
  }

  return NextResponse.json(
    { success: false },
    { status: 401 }
  );
}