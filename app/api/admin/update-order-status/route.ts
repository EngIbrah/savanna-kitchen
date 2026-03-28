import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Admin Supabase client is not initialized" },
      { status: 500 }
    );
  }

  const { error } = await supabaseAdmin
    .from("whatsapp_orders")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}