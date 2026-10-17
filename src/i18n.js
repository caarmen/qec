// This is based on the quick start guide
// https://react.i18next.com/guides/quick-start#configure-i18next
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import stringsFR from "./locales/fr/strings.json";
import quizStrings from "./quiz/strings.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    showSupportNotice: false,
    resources: {
      fr: { translation: stringsFR },
    },
    lng: "fr",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// Quiz-specific strings override the base strings with the same keys.
// A quiz can override any subset: keys not present here keep the base value.
i18n.addResourceBundle("fr", "translation", quizStrings, true, true);

export default i18n;
