// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correct      = process.env.ADMIN_PASSWORD ?? "savanna2024";

  if (password !== correct) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  // Set auth cookie — expires in 7 days
  res.cookies.set("admin_auth", correct, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    maxAge:   60 * 60 * 24 * 7,
    path:     "/",
    sameSite: "lax",
  });

  return res;
}