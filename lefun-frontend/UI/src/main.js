import Vue from 'vue'
import FastClick from 'fastclick'
import 'normalize.css'
import App from './App.vue'
import './assets/responsive'
import './assets/global.css'
import './assets/global.styl'
import SimpleVueValidation from 'simple-vue-validator'
import router from './router'
import store from './store/index.js'
import Navigation from 'vue-navigation'
import VueBreadcrumbs from 'vue-breadcrumbs'
import VueQrcode from '@chenfengyuan/vue-qrcode'

import './icons/credit-card.svg'
import './icons/qr-code.svg'
import './icons/news.svg'
import './icons/facebook.svg'
import './icons/line.svg'
import './icons/receipt.svg'
import './icons/users.svg'
import './icons/mastercard.svg'
import './icons/visa.svg'
import './icons/bill.svg'
import './icons/cold.svg'
import './icons/lefun.svg'
import './icons/lefun_big.svg'
import './icons/lefunbig.svg'

import LoadScript from 'vue-plugin-load-script'

Vue.use(LoadScript)

Vue.component(VueQrcode.name, VueQrcode)

Vue.use(VueBreadcrumbs)
Vue.use(SimpleVueValidation)
Vue.use(Navigation, {
  router,
  store,
  keyName: 'n'
})

if ('addEventListener' in document && 'ontouchstart' in window) {
  FastClick.prototype.focus = function (targetElement) {
    targetElement.focus()
  }
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
