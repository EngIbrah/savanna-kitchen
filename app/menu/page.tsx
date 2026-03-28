// app/menu/page.tsx

import { getAllMenuItems } from "@/lib/sanity";
import MenuClient from "./MenuClient";

export default async function MenuPage() {
  const items = await getAllMenuItems();
  return <MenuClient items={items} />;
}