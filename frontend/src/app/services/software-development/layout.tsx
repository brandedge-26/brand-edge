import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Software Development Services",
  description:
    "Custom web apps, SaaS platforms, and API integrations built to solve real business problems. Software development services by Brand Edge Creations.",
  path: "/services/software-development",
  image: "/home/services/software-design-service.webp",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
