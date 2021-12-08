import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/common.less'   // 常用样式
import './assets/css/index.less'    // 初始样式
import router from './router/index.js'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/request/index.js'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')