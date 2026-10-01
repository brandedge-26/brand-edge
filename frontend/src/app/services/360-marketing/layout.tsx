import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "360° Marketing Services",
  description:
    "From awareness to conversion — we craft end-to-end marketing campaigns that grow your brand across every channel. Social, PPC, email, content & influencer marketing.",
  path: "/services/360-marketing",
  image: "/home/services/marketting.webp",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
