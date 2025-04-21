import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facility Help Desk App",
  description: "Your facility's help desk app",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {children}
          </div>
        </main>
        <footer className="bg-gray-100 py-4 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} Facility Help Desk. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
