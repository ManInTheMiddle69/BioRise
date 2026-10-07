import {boot} from "../shared/bootstrap.js";
import {progressHTML,fmtDate,toast,esc} from "../shared/utils.js";
import {supabase} from "../config/supabase.js";

if(boot("admin","worker-details")) load();

async function load(){
  const id=new URLSearchParams(location.search).get("id");
  if(!id){showNotFound();return;}
  const [{data:w,error:we},{data:assigned,error:te}]=await Promise.all([
    supabase.from("workers").select("id,worker_code,full_name,phone,job_title,salary,hired_date,national_id,notes,points,active").eq("id",id).maybeSingle(),
    supabase.from("task_workers").select("tasks(id,title,progress,status,points)").eq("worker_id",id)
  ]);
  if(we||te||!w){console.error(we||te);showNotFound();return;}
  const tasks=(assigned||[]).map(x=>x.tasks).filter(Boolean);
  const avg=tasks.length?Math.round(tasks.reduce((a,t)=>a+Number(t.progress||0),0)/tasks.length):0;
  document.querySelector("#pageContent").innerHTML=`<div class="grid two-col"><section class="card"><div class="section-head"><div><h2>${esc(w.full_name)}</h2><span class="badge ${w.active?"done":"overdue"}">${w.active?"Active":"Disabled"}</span></div><button class="btn ghost" id="toggle">${w.active?"Disable":"Enable"} account</button></div><div class="grid three-col"><div><div class="small muted">Worker ID</div><strong>${esc(w.worker_code)}</strong></div><div><div class="small muted">Job</div><strong>${esc(w.job_title||"Farm Worker")}</strong></div><div><div class="small muted">Salary</div><strong>${Number(w.salary||0)} TND</strong></div><div><div class="small muted">Hired</div><strong>${fmtDate(w.hired_date)}</strong></div><div><div class="small muted">National ID</div><strong>${esc(w.national_id||"—")}</strong></div><div><div class="small muted">Points</div><strong>${Number(w.points||0)}</strong></div></div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><div class="small muted">Notes</div><p>${esc(w.notes||"No notes.")}</p></section><section class="card"><h2>Login access</h2><p class="muted small">Worker login ID</p><div class="list"><div class="list-row"><strong>Identification</strong><span>${esc(w.worker_code)}</span></div><div class="list-row"><strong>Passcode</strong><span>Hidden for security</span></div></div><h2 style="margin-top:24px">Performance</h2><div class="metric-line"><span>Assigned work</span><strong>${avg}%</strong></div>${progressHTML(avg)}</section></div><section class="card" style="margin-top:16px"><div class="section-head"><h2>Assigned tasks</h2><span class="badge">${tasks.length}</span></div>${tasks.map(t=>`<div style="margin-bottom:15px"><div class="metric-line"><strong>${esc(t.title)}</strong><span>${Number(t.progress||0)}%</span></div>${progressHTML(Number(t.progress||0))}</div>`).join("")||'<div class="empty">No tasks assigned.</div>'}</section>`;
  document.querySelector("#toggle").onclick=async()=>{const {error}=await supabase.from("workers").update({active:!w.active}).eq("id",w.id);if(error){toast(error.message,"error");return;}toast("Account status updated");load();};
}
function showNotFound(){document.querySelector("#pageContent").innerHTML='<div class="card empty">Worker not found.</div>';}
