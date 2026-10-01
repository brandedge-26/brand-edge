import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Book a Free Consultation",
  description:
    "Book a free consultation with Brand Edge Creations. Tell us about your team, goals, and project — we'll put together a tailored growth plan.",
  path: "/consultation",
});

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
