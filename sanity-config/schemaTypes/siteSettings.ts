// sanity-studio/schemaTypes/siteSettings.ts
import { defineType, defineField } from "sanity";

export const siteSettingsSchema = defineType({
  name:  "siteSettings",
  title: "Site Settings",
  type:  "document",
  /* Only one document of this type */
  // Note: __experimental_actions is no longer allowed in current Sanity schema types.
  // Use desk structure customization if you want to disable create/delete globally.
  fields: [
    defineField({
      name:  "restaurantName",
      title: "Restaurant Name",
      type:  "string",
    }),
    defineField({
      name:  "phone",
      title: "WhatsApp Phone Number",
      type:  "string",
      description: "Include country code e.g. 255700000000",
    }),
    defineField({
      name:  "email",
      title: "Email Address",
      type:  "string",
    }),
    defineField({
      name:  "address",
      title: "Address",
      type:  "string",
    }),
    defineField({
      name:  "googleMapsUrl",
      title: "Google Maps URL",
      type:  "url",
    }),
    defineField({
      name:  "instagramUrl",
      title: "Instagram URL",
      type:  "url",
    }),
    defineField({
      name:  "facebookUrl",
      title: "Facebook URL",
      type:  "url",
    }),
    defineField({
      name:  "hours",
      title: "Opening Hours",
      type:  "array",
      of: [{
        type:   "object",
        fields: [
          { name: "day",  title: "Day",  type: "string" },
          { name: "time", title: "Time", type: "string" },
        ],
      }],
    }),
    defineField({
      name:    "heroImage",
      title:   "Homepage Hero Image",
      type:    "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "restaurantName" },
  },
});