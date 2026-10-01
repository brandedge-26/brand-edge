import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Our Portfolio",
  description:
    "From bold identities to high-converting digital experiences — explore the brands, websites, and apps Brand Edge Creations has built.",
  path: "/portfolio",
});

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
