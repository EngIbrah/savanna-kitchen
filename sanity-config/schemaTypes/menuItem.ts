import { defineType, defineField } from "sanity";
import { ShoppingBag, Tag, Languages } from "lucide-react";

export const menuItemSchema = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  fields: [
    /* ─── Naming ─── */
    defineField({
      name: "name",
      title: "Dish Name (English)",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "nameSwahili",
      title: "Dish Name (Swahili)",
      type: "string",
      description: "Optional: Leave blank if not needed.",
    }),

    /* ─── Pricing & Availability ─── */
    defineField({
      name: "price",
      title: "Price (TZS)",
      type: "number",
      validation: (R) => R.required().positive(),
    }),

    /* ─── Descriptions ─── */
    defineField({
      name: "description",
      title: "Description (English)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionSwahili",
      title: "Description (Swahili)",
      type: "text",
      rows: 3,
    }),

    /* ─── MULTI-CATEGORY SELECTION ─── */
    defineField({
      name: "categories",
      title: "Menu Categories",
      description: "Select all that apply (e.g., a dish served for both Lunch and Dinner)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Breakfast", value: "Breakfast" },
          { title: "Lunch", value: "Lunch" },
          { title: "Dinner", value: "Dinner" },
          { title: "Drinks", value: "Drinks" },
          { title: "Desserts", value: "Desserts" },
          { title: "Appetizers", value: "Appetizers" },
        ],
        layout: "grid",
      },
      validation: (R) => R.required().min(1),
    }),

    /* ─── MULTI-LABEL / BADGES ─── */
    defineField({
      name: "tags",
      title: "Dish Labels / Badges",
      description: "Specific labels to highlight the dish (e.g. Chef's Special)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Chef's Special", value: "special" },
          { title: "Most Loved", value: "loved" },
          { title: "Fan Favorite", value: "favorite" },
          { title: "New Arrival", value: "new" },
          { title: "Limited Time", value: "limited" },
        ],
      },
    }),

    /* ─── Media ─── */
    defineField({
      name: "image",
      title: "Dish Photo",
      type: "image",
      options: { hotspot: true },
    }),

    /* ─── Metadata ─── */
    defineField({
      name: "prepTime",
      title: "Prep Time",
      type: "string",
      placeholder: "e.g. 15-20 min",
    }),
    defineField({
      name: "isVegetarian",
      title: "Vegetarian?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isSpicy",
      title: "Spicy?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isAvailable",
      title: "Available Today?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on Homepage?",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "categories.0", // Shows the first category in the list
      media: "image",
    },
  },
});