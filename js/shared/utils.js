export const $=(s,p=document)=>p.querySelector(s); export const $$=(s,p=document)=>[...p.querySelectorAll(s)];
export const fmtDate=d=>d?new Intl.DateTimeFormat("en",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(d+"T12:00:00")):"—";
export const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const initials=n=>String(n||"?").split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
export const statusLabel=s=>({"not-started":"Not started","in-progress":"In progress","done":"Completed","cancelled":"Cancelled"}[s]||s);
export function toast(msg,type="success"){const root=$("#toastRoot")||document.body;const el=document.createElement("div");el.className=`toast ${type}`;el.textContent=msg;root.append(el);setTimeout(()=>el.remove(),2600)}
export function progressHTML(v){v=Math.max(0,Math.min(100,Number(v)||0));return `<div class="progress"><span style="width:${v}%"></span></div>`}
export function modal(title,body,onSubmit){
 const root=$("#modalRoot"); root.innerHTML=`<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>${title}</h2><button class="icon-btn" data-close>×</button></div><form id="modalForm">${body}<div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn primary" type="submit">Save</button></div></form></div></div>`;
 root.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>root.innerHTML="");
 $("#modalForm").onsubmit=e=>{e.preventDefault();onSubmit(new FormData(e.currentTarget));root.innerHTML=""};
}
