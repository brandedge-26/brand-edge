import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Product Photography Services",
  description:
    "Studio and lifestyle product photography that makes your products look as good as they are. Product photography services by Brand Edge Creations.",
  path: "/services/product-photography",
  image: "/home/services/product-photogrpahy.webp",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
