import {getData,saveData} from "../data/store.js";
export function requireRole(role){
 const d=getData(),u=d.currentUser;
 if(!u||!u.loginAt){location.href="../login.html";return null}
 const mins=(Date.now()-u.loginAt)/60000;
 if(mins>(d.settings?.sessionMinutes||240)){d.currentUser=null;saveData(d);location.href="../login.html";return null}
 if(role==="admin" && !["admin","supervisor"].includes(u.role)){location.href="../worker/dashboard.html";return null}
 if(role==="worker" && u.role!=="worker"){location.href="../admin/dashboard.html";return null}
 return u
}
