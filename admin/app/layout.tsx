import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AdminShell from "@/components/AdminShell";
import { ToastProvider } from "@/components/Toast";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brand Edge Admin",
  description: "Brand Edge Admin Dashboard",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <body>
        <ToastProvider><AdminShell>{children}</AdminShell></ToastProvider>
      </body>
    </html>
  );
}
