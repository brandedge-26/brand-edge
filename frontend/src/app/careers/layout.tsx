import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Join the team building bold brands. We're a growing creative agency in Karachi — if you're talented, driven, and love great work, you belong here.",
  path: "/careers",
});

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
