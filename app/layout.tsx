import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { config } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.appName,
  description: `${config.appName} web app`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex flex-1 items-center justify-center p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
