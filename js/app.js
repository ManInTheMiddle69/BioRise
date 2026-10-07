import {applyTheme,bindTheme} from "./shared/theme.js";
applyTheme();bindTheme();
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
