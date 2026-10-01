import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Our Services",
  description:
    "Explore Brand Edge Creations' full range of services — 360 marketing, website design, app development, SEO, branding, graphic design, product photography, and software development.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
