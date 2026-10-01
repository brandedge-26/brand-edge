import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Website Design Services",
  description:
    "Beautiful, fast, and conversion-optimised websites that turn visitors into customers. Website design and development services by Brand Edge Creations.",
  path: "/services/website-designing",
  image: "/home/services/website-service.webp",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
