import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Graphic Design Services",
  description:
    "Print, digital, and motion graphics crafted to communicate your brand's message with impact. Graphic design services by Brand Edge Creations.",
  path: "/services/graphic-design",
  image: "/home/services/graphic-design-service.webp",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
