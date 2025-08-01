import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'
import { createPinia } from 'pinia'
import i18n from './i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'


const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.use(VueQueryPlugin)
app.mount('#app')
