import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/common.less'   // 常用样式
import './assets/css/reset.less'    // 初始样式
import router from './router/index.js'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import '@/request/index.js'

const app = createApp(App)
app.use(ElementPlus,{ locale: zhCn })
app.use(router)
app.mount('#app')