// sanity-studio/schemaTypes/testimonial.ts
import { defineType, defineField } from "sanity";

export const testimonialSchema = defineType({
  name:  "testimonial",
  title: "Testimonial",
  type:  "document",
  fields: [
    defineField({
      name:       "name",
      title:      "Customer Name",
      type:       "string",
      validation: R => R.required(),
    }),
    defineField({
      name:       "quote",
      title:      "Review Text",
      type:       "text",
      rows:       4,
      validation: R => R.required(),
    }),
    defineField({
      name:  "detail",
      title: "Location / Detail",
      type:  "string",
    }),
    defineField({
      name:  "tag",
      title: "Experience Tag",
      type:  "string",
      description: "e.g. Dine-in Experience, WhatsApp Order",
    }),
    defineField({
      name:         "rating",
      title:        "Star Rating",
      type:         "number",
      options:      { list: [1, 2, 3, 4, 5] },
      initialValue: 5,
    }),
    defineField({
      name:    "photo",
      title:   "Customer Photo",
      type:    "image",
      options: { hotspot: true },
    }),
    defineField({
      name:         "isFeatured",
      title:        "Featured?",
      type:         "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title:    "name",
      subtitle: "detail",
      media:    "photo",
    },
  },
});