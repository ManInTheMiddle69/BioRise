import {getData} from "../data/store.js";
import {initials} from "./utils.js";
const adminNav=[["dashboard","Dashboard"],["workers","Workers"],["tasks","Tasks"],["objectives","Objectives"],["planning","Planning"],["attendance","Attendance"],["locations","Locations"],["archive","Archive"],["settings","Settings"]];
const workerNav=[["dashboard","Home"],["tasks","Tasks"],["planning","Planning"],["leaderboard","Leaderboard"],["profile","Profile"]];
export function renderShell(role,page){
 const d=getData(), acct=d.currentUser, worker=d.workers.find(w=>w.id===acct?.workerId),nav=role==="admin"?adminNav:workerNav;
 document.querySelector("#sidebar").innerHTML=`<aside class="sidebar"><div class="side-brand"><div class="brand-mark small">B</div><div><strong>BioRise</strong><div class="small muted">${role==="admin"?"Operations":"Worker portal"}</div></div></div><nav class="side-nav">${nav.map(([s,l])=>`<a class="${page===s?"active":""}" href="${s}.html">${l}</a>`).join("")}</nav><div class="side-bottom"><button class="btn ghost" data-theme-toggle>◐ Theme</button><button class="btn danger" id="logoutBtn">Sign out</button></div></aside>`;
 document.querySelector("#topbar").innerHTML=`<div class="topbar"><div><strong>${role==="admin"?"Operations":"My work"}</strong></div><div class="topbar-right"><button class="icon-btn" data-theme-toggle>◐</button><div class="user-chip"><div class="avatar">${initials(worker?.name||"Admin")}</div><span><strong>${worker?.name||"Administrator"}</strong><br><small class="muted">${acct?.id||""}</small></span></div></div></div>`;
 document.querySelector("#mobileNav").innerHTML=`<div class="mobile-nav">${nav.map(([s,l])=>`<a class="${page===s?"active":""}" href="${s}.html">${l}</a>`).join("")}</div>`;
}
