import { getTestimonials } from "@/lib/sanity";
import TestimonialsClient from "./TestimonialsClient";

export default async function Testimonials() {
  const testimonials = await getTestimonials();
  
  // Return null or a fallback if no testimonials exist to avoid breaking the UI
  if (!testimonials || testimonials.length === 0) return null;

  return <TestimonialsClient testimonials={testimonials} />;
}