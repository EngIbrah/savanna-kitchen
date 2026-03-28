import { getGalleryPhotos } from "@/lib/sanity";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();
  return <GalleryClient photos={photos} />;
}