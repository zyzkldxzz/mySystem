import { createApp } from 'vue'
import {store} from '@/stores'

import App from './App.vue'
import router from './router'
import '@/assets/css/global.css'


const app = createApp(App)


app.use(router)
app.use(store)

app.mount('#app')
