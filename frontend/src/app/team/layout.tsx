import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Meet Our Team",
  description:
    "Meet the designers, developers, and strategists at Brand Edge Creations — the team behind Pakistan's boldest brands and digital experiences.",
  path: "/team",
});

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
