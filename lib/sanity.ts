import { createClient }             from "@sanity/client";
import { createImageUrlBuilder }    from "@sanity/image-url";
import type { SanityImageSource }   from "@sanity/image-url";

/* ─── Client ─────────────────────────────────────── */
export const sanityClient = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:     true,
});

/* ─── Image URL helper ────────────────────────────── */
const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ═══════════════════════════════════════════════════
    QUERIES
═══════════════════════════════════════════════════ */

/* Menu ─────────────────────────────────────────── */
export async function getAllMenuItems() {
  return sanityClient.fetch(`
    *[_type == "menuItem" && isAvailable == true]
    | order(sortOrder asc) {
      _id,
      name,
      nameSwahili,
      description,
      descriptionSwahili,
      price,
      "categories": categories[], 
      "tags": tags[],             
      prepTime,
      isVegetarian,
      isSpicy,
      isFeatured,
      image
    }
  `);
}

export async function getFeaturedMenuItems() {
  return sanityClient.fetch(`
    *[_type == "menuItem" && isFeatured == true && isAvailable == true]
    | order(sortOrder asc)[0...3] {
      _id,
      name,
      nameSwahili,
      description,
      descriptionSwahili,
      price,
      "categories": categories[], 
      "tags": tags[],             
      prepTime,
      isVegetarian,
      isSpicy,
      image
    }
  `);
}

/* Gallery ──────────────────────────────────────── */
export async function getGalleryPhotos() {
  return sanityClient.fetch(`
    *[_type == "galleryPhoto"]
    | order(sortOrder asc) {
      _id,
      title,
      category,
      span,
      image
    }
  `);
}

/* Testimonials ─────────────────────────────────── */
export async function getTestimonials() {
  return sanityClient.fetch(`
    *[_type == "testimonial"]
    | order(_createdAt desc) {
      _id,
      name,
      quote,
      detail,
      tag,
      rating,
      isFeatured,
      photo
    }
  `);
}

/* Site settings ────────────────────────────────── */
export async function getSiteSettings() {
  return sanityClient.fetch(`
    *[_type == "siteSettings"][0] {
      restaurantName,
      phone,
      email,
      address,
      googleMapsUrl,
      instagramUrl,
      facebookUrl,
      hours,
      heroImage
    }
  `);
}