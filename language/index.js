import Vue from 'vue'
import VueI18n from 'vue-i18n'
import US from './en.json';
import { getLocal, setLocal } from '@editor/utils/local';
import { LANG } from '@editor/config/constants/app';
import en from 'view-design/dist/locale/en-US';

const messages = {
  en: Object.assign(US, en), //Combine your own English package with the one provided by iview
};

function getLocalLang() {
  let localLang = getLocal(LANG);
  if (!localLang) {
    let defaultLang = navigator.language;
    if (defaultLang) {
      defaultLang = defaultLang.split('-')[0];
      localLang = defaultLang.split('-')[0];
    }
    setLocal(LANG, defaultLang);
  }
  return localLang;
}
const lang = getLocalLang();

Vue.use(VueI18n)

const i18n = new VueI18n({
  allowComposition: true,
  globalInjection: true,
  legacy: false,
  locale: lang,
  fallbackLocale: 'en',
  messages
})


export default i18n