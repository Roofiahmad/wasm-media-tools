export default function SeoContent() {
  return (
    <section className="max-w-2xl w-full bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-gray-700 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Why Use WASM Media Tool?
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Most online converters require you to upload your personal videos or
          audio files to a third-party cloud server. WASM Media Tool operates
          entirely on your device using WebAssembly technology. Your files never
          leave your browser, ensuring absolute privacy and zero upload waiting
          times.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            🔒 Is my data safe?
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Yes, 100% safe. All processing happens locally inside your browser
            memory sandbox. We do not store, track, or look at your media files.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            ⚡ How does it work?
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We run a compiled version of FFmpeg directly inside a web worker
            using WebAssembly and multi-threading, bringing native desktop-grade
            media conversion straight to your browser.
          </p>
        </div>
      </div>
    </section>
  );
}
