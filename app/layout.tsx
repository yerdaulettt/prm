import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { config } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
export const metadata: Metadata = {
  title: config.appName,
  description: "Find a room and compatible roommates with Roomi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#faf9f6] text-[#20211f]">
        <AuthProvider>
          <Header />
          <main className="mx-auto flex w-full max-w-6xl flex-1 justify-center px-5 py-8 sm:py-12">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
