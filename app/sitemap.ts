import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://media-tools.free-tools.my.id";
  const locales = ["en", "id"];

  const routes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });
  });

  return sitemapEntries;
}
