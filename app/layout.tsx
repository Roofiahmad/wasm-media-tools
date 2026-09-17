import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WASM Media Tool | Audio Extractor",
  description: "Client-side audio extraction using FFmpeg and WebAssembly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-blue-200 selection:text-blue-900">
        {/* Navbar */}
        <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-10 sticky top-0">
          <div className="max-w-5xl mx-auto flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="font-semibold text-lg tracking-tight text-gray-900">
              WASM Tool
            </span>
          </div>
        </header>

        {/* Konten Utama dari page.tsx dirender di sini */}
        {children}
      </body>
    </html>
  );
}
