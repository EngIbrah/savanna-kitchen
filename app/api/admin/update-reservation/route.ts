import { NextRequest, NextResponse } from "next/server";
import { updateReservationStatus } from "@/lib/supabase";

/**
 * POST /api/admin/update-reservation
 * Securely updates a booking status using the Supabase Admin client.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    // 1. Basic Validation
    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields: id and status" },
        { status: 400 }
      );
    }

    // 2. Value Validation (Ensures data integrity)
    const VALID_STATUSES = ["pending", "confirmed", "cancelled"];
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // 3. Database Operation
    // This helper uses supabaseAdmin internally to bypass RLS
    const result = await updateReservationStatus(id, status);

    return NextResponse.json({ 
      success: true, 
      message: `Reservation ${id} updated to ${status}` 
    });

  } catch (error: any) {
    console.error("[ADMIN_UPDATE_ERROR]:", error);
    
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}