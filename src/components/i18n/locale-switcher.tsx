"use client";

import { useLocale } from "next-intl";
import { locales } from "@/i18n";
import { usePathname, useRouter } from "@/navigation";

export default function LocaleSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (locale: string) => {
    router.push(pathname, { locale });
  };

  return (
    <div className="flex items-center space-x-2 justify-center p-2">
      {locales.map((locale) => (
        <div key={locale} className={`${locale === currentLocale ? "bg-gray-100 rounded-lg p-1" : ""}`}>
          <button
            onClick={() => changeLocale(locale)}
            className={`cursor-pointer`}
          >
            <img
              src={`https://flagsapi.com/${
                locale.toUpperCase() === "EN" ? "GB" : locale.toUpperCase()
              }/flat/64.png`}
              alt="German Flag"
              className="w-4 h-4"
            />
          </button>
        </div>
      ))}
    </div>
  );
}
