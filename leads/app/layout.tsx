import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import LeadsShell from "@/components/LeadsShell";
import { ToastProvider } from "@/components/Toast";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brand Edge Leads",
  description: "Brand Edge Leads Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <body>
        <ToastProvider><LeadsShell>{children}</LeadsShell></ToastProvider>
      </body>
    </html>
  );
}
