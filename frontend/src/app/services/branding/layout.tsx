import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Branding Services",
  description:
    "Logo design, brand guidelines, and visual identity systems that make your brand impossible to ignore. Branding services by Brand Edge Creations, Karachi.",
  path: "/services/branding",
  image: "/home/services/branding-service.webp",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
