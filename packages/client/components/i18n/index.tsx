import type { JSX } from "solid-js";

import { i18n } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/solid";

import { type LocaleOptions, Language, Languages } from "./Languages";
import { messages as en } from "./catalogs/en/messages";
import { messages as ru } from "./catalogs/ru/messages";
import { initTime, loadTimeLocale } from "./dayjs";
import { updateDurationLocale } from "./durations";

export function I18nProvider(props: { children: JSX.Element }) {
  const initialLang = browserPreferredLanguage() as Language;

  i18n.load({
    en,
    ru,
  });

  i18n.activate(initialLang === Language.RUSSIAN ? Language.RUSSIAN : Language.ENGLISH);

  initTime();

  updateDurationLocale(initialLang === Language.RUSSIAN ? Language.RUSSIAN : Language.ENGLISH);

  return <LinguiProvider i18n={i18n}>{props.children}</LinguiProvider>;
}

export { Language, Languages } from "./Languages";
export { timeLocale, useTime } from "./dayjs";
export { useError } from "./errors";

export async function loadAndSwitchLocale(
  key: Language,
  localeOptions: LocaleOptions,
) {
  if (key !== i18n.locale) {
    const data =
      Languages[key].i18n === "en"
        ? en
        : Languages[key].i18n === "ru"
          ? ru
          : (await import(`./catalogs/${Languages[key].i18n}/messages.ts`))
              .messages;

    i18n.load({
      [key]: data,
    });

    i18n.activate(key);

    loadTimeLocale(Languages[key], localeOptions);

    updateDurationLocale(key);
  }
}

/**
 * Preferred language as reported by the browser
 * @returns Preferred language
 */
export function browserPreferredLanguage() {
  const languages = Object.keys(Languages).map(
    (x) => [x, Languages[x as keyof typeof Languages]] as const,
  );

  const preferred = [
    ...(typeof navigator !== "undefined" && navigator.languages ? navigator.languages : []),
    ...(typeof navigator !== "undefined" && navigator.language ? [navigator.language] : []),
  ];

  if (preferred.some((l) => /^ru\b/i.test(l))) {
    return Language.RUSSIAN;
  }

  // Get the user's system language. Check for exact
  // matches first, otherwise check for partial matches
  const match =
    preferred
      .map((lang) => languages.find((l) => l[0].replace(/_/g, "-").toLowerCase() === lang.toLowerCase()))
      .filter((lang) => lang)[0]?.[0] ??
    preferred
      .map((x) => x.split("-")[0].toLowerCase())
      .map((lang) => languages.find((l) => l[0].toLowerCase() === lang))
      .filter((lang) => lang)[0]?.[0];

  return match ?? Language.RUSSIAN;
}
