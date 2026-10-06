import {getData,saveData} from "../data/store.js";
export function bindLogout(){const b=document.querySelector("#logoutBtn");if(b)b.onclick=()=>{const d=getData();d.currentUser=null;saveData(d);location.href="../login.html"}}
