import { h } from 'vue'
import { type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AsideSponsors from './components/AsideSponsors.vue'
// import AsideSponsors from './components/AsideSponsors.vue'
import TranslationStatus from 'vitepress-translation-helper/ui/TranslationStatus.vue'
// import HomeSponsors from './components/HomeSponsors.vue'
import PiniaLogo from './components/PiniaLogo.vue'
import './styles/vars.css'
import './styles/playground-links.css'
import VueSchoolLink from './components/VueSchoolLink.vue'
import VueMasteryLogoLink from './components/VueMasteryLogoLink.vue'
import MasteringPiniaLink from './components/MasteringPiniaLink.vue'
import status from '../translation-status.json'
import MadVueBanner from './components/MadVueBanner.vue'

const i18nLabels = {
  zh: '该翻译已同步到了 ${date} 的版本，其对应的 commit hash 是 <code>${hash}</code>。',
}

const theme: Theme = {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h('div', { class: 'image-src' }, h(PiniaLogo)),
      // 'home-features-after': () => h(HomeSponsors),
      'aside-ads-before': () => h(AsideSponsors),
      'layout-top': () => h(MadVueBanner),
      'doc-before': () => h(TranslationStatus, { status, i18nLabels }),
    })
  },

  enhanceApp({ app }) {
    app.component('VueSchoolLink', VueSchoolLink)
    app.component('VueMasteryLogoLink', VueMasteryLogoLink)
    app.component('MasteringPiniaLink', MasteringPiniaLink)
  },
}

export default theme
