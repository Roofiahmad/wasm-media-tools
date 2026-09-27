import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = await locale;

  const activeLocale =
    resolvedLocale &&
    routing.locales.includes(resolvedLocale as (typeof routing.locales)[number])
      ? resolvedLocale
      : routing.defaultLocale;

  return {
    locale: activeLocale,
    messages: (await import(`../messages/${activeLocale}.json`)).default,
  };
});
