import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "App Development Services",
  description:
    "Native and cross-platform mobile apps built for performance, usability, and scale. iOS, Android, and React Native development by Brand Edge Creations.",
  path: "/services/app-development",
  image: "/home/services/mobile-app-service.webp",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
