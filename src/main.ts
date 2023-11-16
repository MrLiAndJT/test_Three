import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"

import type { App as AppType } from "vue"

import "./style/resetBrowser.scss"

import VueKonva from "vue-konva"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

import { renderWithQiankun, qiankunWindow } from "vite-plugin-qiankun/dist/helper"

let app: AppType<Element>

const render = (container?: any) => {
  app = createApp(App)
  app.use(ElementPlus)
  app.use(VueKonva)
  app.use(router).mount(container ? container.querySelector("#app") : "#app")
}

const initQianKun = () => {
  renderWithQiankun({
    bootstrap() {},
    mount(props) {
      console.log("test-three接受到主应用的参数: ", props)
      const { container } = props
      render(container)
    },
    unmount(props) {
      app.unmount()
    },
    update(props) {}
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()
