// app/api/admin/mark-read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { markMessageRead }           from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  await markMessageRead(id);
  return NextResponse.json({ success: true });
}