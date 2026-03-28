import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin =
  typeof window === "undefined"
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    : null;

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  note?: string;
};

export type WhatsAppOrder = {
  id?: string;
  items: OrderItem[]; // The JSONB structured list
  price: number;      // Total price for revenue tracking
  status: "pending" | "completed" | "cancelled";
  created_at?: string;
  item_name?: string; // Kept for backward compatibility if needed
};

export type Reservation = {
  id?: string;
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  occasion?: string;
  requests?: string;
  status?: "pending" | "confirmed" | "cancelled";
  created_at?: string;
};

export type ContactMessage = {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
};

/* ═══════════════════════════════════════════════════
   ORDER FUNCTIONS (NEW)
   ═══════════════════════════════════════════════════ */

/**
 * Public: Creates a new WhatsApp order card
 * Maps the cart into a structured JSONB format for the kitchen
 */
export async function createOrder(cart: OrderItem[], totalPrice: number) {
  // 1. Prepare data for the one-card-per-customer scenario
  const detailedItems = cart.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    note: item.note || ""
  }));

  // 2. Insert into the database
  const { error } = await supabase.from("whatsapp_orders").insert([
    {
      items: detailedItems,
      price: totalPrice,
      status: "pending",
      // Optional: helpful if you have old components still looking for a string
      item_name: detailedItems.map(i => `${i.quantity}x ${i.name}`).join(", ")
    },
  ]);

  if (error) throw new Error(error.message);
  return true;
}

/**
 * Admin: Updates order status (Server-side only)
 */
export async function updateOrderStatus(
  id: string,
  status: "pending" | "completed" | "cancelled"
) {
  if (!supabaseAdmin) throw new Error("This function must be called from the server.");

  const { error } = await supabaseAdmin
    .from("whatsapp_orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}

/* ═══════════════════════════════════════════════════
   RESERVATION FUNCTIONS
   ═══════════════════════════════════════════════════ */

export async function createReservation(data: Omit<Reservation, "id" | "created_at">) {
  const { error } = await supabase
    .from("reservations")
    .insert([{ ...data, status: "pending" }]);

  if (error) throw new Error(error.message);
  return true;
}

export async function getAllReservations(): Promise<Reservation[]> {
  if (!supabaseAdmin) throw new Error("This function must be called from the server.");

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateReservationStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled"
) {
  if (!supabaseAdmin) throw new Error("This function must be called from the server.");

  const { error } = await supabaseAdmin
    .from("reservations")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}

/* ═══════════════════════════════════════════════════
   CONTACT MESSAGE FUNCTIONS
   ═══════════════════════════════════════════════════ */

export async function createContactMessage(data: Omit<ContactMessage, "id" | "created_at">) {
  const { error } = await supabase
    .from("contact_messages")
    .insert([{ ...data, is_read: false }]);

  if (error) throw new Error(error.message);
  return true;
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  if (!supabaseAdmin) throw new Error("This function must be called from the server.");

  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function markMessageRead(id: string) {
  if (!supabaseAdmin) throw new Error("This function must be called from the server.");

  const { error } = await supabaseAdmin
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}