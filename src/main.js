import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

import axios from "./libs/axios"
Vue.use(axios)
window.axios = require('axios').default;
// const axios = require('axios').default;

// import Vue cookies 
import VueCookies from 'vue-cookies'

import { localize } from 'vee-validate'

Vue.use(require('vue-moment'));


Vue.config.productionTip = false

localize('ar')

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
