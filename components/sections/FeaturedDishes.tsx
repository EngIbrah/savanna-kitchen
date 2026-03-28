// components/sections/FeaturedDishes.tsx
import { getFeaturedMenuItems } from "@/lib/sanity";
import FeaturedDishesClient      from "./FeaturedDishesClient";

export default async function FeaturedDishes() {
  const dishes = await getFeaturedMenuItems();
  return <FeaturedDishesClient dishes={dishes} />;
}