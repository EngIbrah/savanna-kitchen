// app/api/reservations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend }                    from "resend";
import { supabase }                  from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    /* 1. Save to Supabase */
    const { error } = await supabase
      .from("reservations")
      .insert([{ ...data, status: "pending" }]);

    if (error) throw new Error(error.message);

    /* 2. Email the restaurant owner */
    await resend.emails.send({
      from:    "reservations@savannakitchen.co.tz",
      to:      "hello@savannakitchen.co.tz",
      subject: `🍽️ New Reservation — ${data.name} on ${data.date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #C8793A; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">New Reservation</h2>
          </div>
          <div style="background: #FAF7F2; padding: 24px; border: 1px solid #E8DDD4; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${[
                ["Guest",    data.name    ],
                ["Phone",    data.phone   ],
                ["Date",     data.date    ],
                ["Time",     data.time    ],
                ["Guests",   data.guests  ],
                ["Occasion", data.occasion || "Not specified"],
                ["Requests", data.requests || "None"],
              ].map(([label, value]) => `
                <tr>
                  <td style="padding: 8px 0; color: #6B5B4E; font-size: 14px; width: 100px;">${label}</td>
                  <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600;">${value}</td>
                </tr>
              `).join("")}
            </table>
            
              href="https://wa.me/${data.phone?.replace(/\D/g,"")}?text=${encodeURIComponent(`Hello ${data.name}! Your reservation at Savanna Kitchen on ${data.date} at ${data.time} is confirmed. See you soon! 🍽️`)}"
              style="display: inline-block; margin-top: 16px; background: #25D366; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: 600;"
            >
              Confirm via WhatsApp
            </a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error("Reservation API error:", err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}