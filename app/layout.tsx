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
  title: "WASM Media Tool | Free Client-Side Video to MP3 & Compressor",
  description:
    "Extract audio, compress video, and convert formats 100% securely inside your browser using WebAssembly. No file uploads to any server—complete privacy.",
  keywords: [
    "client-side video converter",
    "video to mp3 browser",
    "wasm ffmpeg tool",
    "private video compressor",
    "convert mp4 to webm offline",
  ],
  openGraph: {
    title: "WASM Media Tool - Private Browser Media Converter",
    description:
      "Convert and compress your media files securely inside your browser without uploading anything.",
    type: "website",
    url: "https://wasm-media-tool.vercel.app", // Ganti nanti dengan domain lu
    siteName: "WASM Media Tool",
  },
  twitter: {
    card: "summary_large_image",
    title: "WASM Media Tool | Client-Side Media Suite",
    description:
      "Extract audio and compress video directly in your browser using FFmpeg WASM.",
  },
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
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <span className="font-semibold text-lg tracking-tight text-gray-900">
                WASM Media Tool
              </span>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              🔒 100% Client-Side Privacy
            </span>
          </div>
        </header>

        {children}

        {/* Footer SEO / Info */}
        <footer className="w-full bg-white border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p>
            Powered by Next.js App Router, Tailwind CSS, and FFmpeg WebAssembly
            (WASM).
          </p>
          <span className="hidden sm:inline text-gray-300">|</span>
          <a
            href="/privacy"
            className="text-blue-600 hover:underline font-medium"
          >
            Privacy Policy
          </a>
        </footer>
      </body>
    </html>
  );
}
