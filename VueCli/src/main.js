import { createApp } from "vue";
import App from "./App";
import router from "./router/index";

// 全量引入ElementPlus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount(document.getElementById("app"));

// createApp(App).use(router).mount(document.getElementById("app"));
