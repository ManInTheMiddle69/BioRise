import {getData,updateData} from "../data/store.js";
export function applyTheme(){const d=getData();document.documentElement.dataset.theme=d.settings?.theme||"dark"}
export function bindTheme(){document.querySelectorAll("[data-theme-toggle]").forEach(b=>b.onclick=()=>{updateData(d=>d.settings.theme=d.settings.theme==="dark"?"light":"dark");applyTheme()})}
applyTheme();
