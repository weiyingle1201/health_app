import { createSSRApp } from 'vue'
import App from './App.vue'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 注册Element Plus组件
  app.use(ElementPlus)
  
  // 注册所有Element Plus图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
  // 使用Vuex
  app.use(store)
  
  return {
    app
  }
}