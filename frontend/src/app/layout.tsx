import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const oSans = localFont({
  src: [
    { path: "../../public/fonts/OSans-Light.ttf",   weight: "300", style: "normal" },
    { path: "../../public/fonts/OSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/OSans-Medium.ttf",  weight: "500", style: "normal" },
    { path: "../../public/fonts/OSans-Bold.ttf",    weight: "600", style: "normal" },
    { path: "../../public/fonts/OSans-Bold.ttf",    weight: "700", style: "normal" },
    { path: "../../public/fonts/OSans-Bold.ttf",    weight: "800", style: "normal" },
    { path: "../../public/fonts/OSans-Bold.ttf",    weight: "900", style: "normal" },
  ],
  variable: "--font-osans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brand Edge Creations — Digital Agency Pakistan",
    template: "%s | Brand Edge Creations",
  },
  description:
    "Brand Edge Creations is a full-service creative agency in Karachi, Pakistan — specializing in brand identity, web design, app development, digital marketing, and graphic design. We build bold brands and digital experiences that drive real growth.",
  keywords: [
    "brand edge creations",
    "digital agency pakistan",
    "branding agency karachi",
    "web design pakistan",
    "web development karachi",
    "graphic design agency",
    "digital marketing pakistan",
    "logo design karachi",
    "app development pakistan",
    "SEO services pakistan",
    "social media marketing",
    "creative agency karachi",
    "brand identity design",
    "UI UX design pakistan",
  ],
  authors: [{ name: "Brand Edge Creations", url: "https://brandedgecreations.io" }],
  creator: "Brand Edge Creations",
  publisher: "Brand Edge Creations",
  metadataBase: new URL("https://brandedgecreations.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://brandedgecreations.io",
    siteName: "Brand Edge Creations",
    title: "Brand Edge Creations — Digital Agency Pakistan",
    description:
      "Full-service creative agency in Karachi building bold brands, high-converting websites, and digital experiences that drive real growth.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brand Edge Creations — Digital Agency Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Edge Creations — Digital Agency Pakistan",
    description:
      "Full-service creative agency in Karachi — branding, web design, app development & digital marketing.",
    images: ["/og-image.png"],
    creator: "@brandedgecreations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${oSans.variable} ${oSans.className}`}>
      <body className={`min-h-full flex flex-col ${oSans.className}`}><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
