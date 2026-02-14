// This is based on the quick start guide
// https://react.i18next.com/guides/quick-start#configure-i18next
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import stringsFR from './locales/fr/strings.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
        fr: { translation: stringsFR }
    },
    lng: "fr",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;