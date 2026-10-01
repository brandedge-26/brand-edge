import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "SEO Services",
  description:
    "Technical SEO, content strategy, and link building that gets you to the top — and keeps you there. SEO services in Pakistan by Brand Edge Creations.",
  path: "/services/seo",
  image: "/home/services/seo-service.webp",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
