import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description:
    "Discover the journey behind Brand Edge Creations — how we grew from a small studio into Karachi's go-to creative partner for branding, web design, and digital growth.",
  path: "/story",
});

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
