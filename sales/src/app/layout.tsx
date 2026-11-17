import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SalesShell from "@/components/SalesShell";
import { ToastProvider } from "@/components/Toast";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brand Edge Sales",
  description: "Brand Edge Sales Panel",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff6a00",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <body>
        <ServiceWorkerRegister />
        <ToastProvider><SalesShell>{children}</SalesShell></ToastProvider>
      </body>
    </html>
  );
}
