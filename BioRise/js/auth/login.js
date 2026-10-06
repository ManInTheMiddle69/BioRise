import "../shared/theme.js";
import {bindTheme} from "../shared/theme.js";
import {getData,saveData} from "../data/store.js";
const form=document.querySelector("#loginForm"), err=document.querySelector("#loginError");
bindTheme();
form.onsubmit=e=>{
 e.preventDefault(); const d=getData(); const id=document.querySelector("#workerId").value.trim().toUpperCase(), pass=document.querySelector("#passcode").value;
 const a=d.accounts.find(x=>x.id===id&&x.passcode===pass&&x.active);
 if(!a){err.textContent="Identification or passcode is incorrect, or this account is disabled.";return}
 d.currentUser={id:a.id,role:a.role,workerId:a.workerId,loginAt:Date.now()};saveData(d);
 location.href=a.role==="worker"?"worker/dashboard.html":"admin/dashboard.html";
};
