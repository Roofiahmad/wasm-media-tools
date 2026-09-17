import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | WASM Media Tool",
  description:
    "Read our privacy policy to understand how WASM Media Tool handles your data securely inside your browser.",
};

export default function PrivacyPolicy() {
  return (
    <main className="flex-1 w-full bg-gray-50 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-gray-700 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400">Last updated: June 2026</p>
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>WASM Media Tool</strong>. We respect your
              privacy and are committed to protecting your personal data.
              Because of how our application is architected, your privacy is
              fundamentally guaranteed by design.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">
              2. 100% Client-Side Processing
            </h2>
            <p>
              Unlike traditional media converters that require you to upload
              files to a remote cloud server, WASM Media Tool processes
              everything <strong>locally on your device</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                Your videos, audio files, and documents are never uploaded or
                transmitted over the internet.
              </li>
              <li>
                All conversions happen inside your browser&apos;s isolated
                WebAssembly (WASM) sandbox memory.
              </li>
              <li>
                We do not store, view, or retain any of the media files you
                process.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">
              3. Cookies and Analytics
            </h2>
            <p>
              We do not use aggressive tracking cookies or invasive third-party
              trackers. If analytics are used in the future, they will strictly
              collect anonymized usage data to help us fix bugs and improve
              application performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">
              4. Changes to This Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-gray-100">
            <h2 className="font-bold text-gray-900 text-base">5. Contact Us</h2>
            <p>
              If you have any questions or suggestions about our Privacy Policy,
              feel free to reach out to the developer or check our project
              repository.
            </p>
          </section>
        </div>

        <div className="pt-4">
          {/* PERBAIKAN: Menggunakan <Link> dari next/link */}
          <Link
            href="/"
            className="inline-block px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            &larr; Back to Converter
          </Link>
        </div>
      </div>
    </main>
  );
}
