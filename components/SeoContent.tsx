"use client";
import { useTranslations } from "next-intl";

export default function SeoContent() {
  const t = useTranslations("SeoContent");

  return (
    <section className="max-w-2xl w-full bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-gray-700 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t("title")}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{t("desc")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {t("q1")}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">{t("a1")}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {t("q2")}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">{t("a2")}</p>
        </div>
      </div>
    </section>
  );
}
