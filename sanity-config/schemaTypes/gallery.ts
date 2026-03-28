// sanity-studio/schemaTypes/gallery.ts
import { defineType, defineField } from "sanity";

export const gallerySchema = defineType({
  name:  "galleryPhoto",
  title: "Gallery Photo",
  type:  "document",
  fields: [
    defineField({
      name:       "title",
      title:      "Caption / Alt Text",
      type:       "string",
      validation: R => R.required(),
    }),
    defineField({
      name:       "image",
      title:      "Photo",
      type:       "image",
      options:    { hotspot: true },
      validation: R => R.required(),
    }),
    defineField({
      name:    "category",
      title:   "Category",
      type:    "string",
      options: {
        list: [
          { title: "Food",     value: "Food"     },
          { title: "Ambiance", value: "Ambiance" },
          { title: "Events",   value: "Events"   },
          { title: "Desserts", value: "Desserts" },
        ],
      },
    }),
    defineField({
      name:    "span",
      title:   "Display Size",
      type:    "string",
      options: {
        list: [
          { title: "Square", value: "square" },
          { title: "Tall",   value: "tall"   },
          { title: "Wide",   value: "wide"   },
        ],
      },
      initialValue: "square",
    }),
    defineField({
      name:  "sortOrder",
      title: "Display Order",
      type:  "number",
    }),
  ],
  preview: {
    select: {
      title:  "title",
      media:  "image",
    },
  },
});