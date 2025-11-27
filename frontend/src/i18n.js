import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
  'zh-TW': { translation: { welcome: "歡迎使用 Cyberlearn", products: "產品" } },
  'zh-CN': { translation: { welcome: "欢迎使用 Cyberlearn", products: "产品" } },
  'en': { translation: { welcome: "Welcome to Cyberlearn", products: "Products" } },
};
i18n.use(initReactI18next).init({ resources, lng: 'zh-TW', interpolation: { escapeValue: false } });
export default i18n;