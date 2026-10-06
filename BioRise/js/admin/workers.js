import {boot} from "../shared/bootstrap.js";
import {modal,toast,esc} from "../shared/utils.js";
import {supabase} from "../config/supabase.js";

let selected = new Set();
let workers = [];

if (boot("admin", "workers")) loadAndRender();

function normalizeWorker(w){
  return {
    id:w.id,
    code:w.worker_code,
    name:w.full_name,
    phone:w.phone || "",
    job:w.job_title || "Farm Worker",
    salary:Number(w.salary || 0),
    hired:w.hired_date || "",
    nationalId:w.national_id || "",
    notes:w.notes || "",
    active:w.active !== false,
    points:Number(w.points || 0)
  };
}

async function loadWorkers(){
  const {data,error}=await supabase
    .from("workers")
    .select("id, worker_code, full_name, phone, job_title, salary, hired_date, national_id, notes, points, active")
    .order("created_at",{ascending:false});
  if(error){
    console.error("Could not load workers from Supabase",error);
    toast("Could not load workers from Supabase","error");
    workers=[];
    return;
  }
  workers=(data||[]).map(normalizeWorker);
}

async function loadAndRender(){
  await loadWorkers();
  render();
}

function render(){
  document.querySelector("#pageActions").innerHTML=`<button class="btn primary" id="addWorker">+ Add worker</button>`;
  document.querySelector("#pageContent").innerHTML=`<section class="card"><div id="selection"></div><div class="toolbar"><input id="search" placeholder="Search workers..."><span class="spacer"></span><span class="small muted">${workers.length} records</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th class="select-cell"><input class="select-all" type="checkbox"></th><th>Worker</th><th>ID</th><th>Job</th><th>Salary</th><th>Points</th><th>Status</th><th>Actions</th></tr></thead><tbody id="rows">${rows(workers)}</tbody></table></div></section>`;
  bind();
}

function rows(ws){
  if(!ws.length) return `<tr><td colspan="8"><div class="empty-state">No workers found in Supabase.</div></td></tr>`;
  return ws.map(w=>`<tr><td><input class="row-check" type="checkbox" data-select="${w.id}" ${selected.has(w.id)?"checked":""}></td><td class="clickable" data-open="${w.id}"><strong>${esc(w.name)}</strong><br><small class="muted">${esc(w.phone)}</small></td><td>${esc(w.code)}</td><td>${esc(w.job)}</td><td>${w.salary} TND</td><td>${w.points}</td><td><span class="badge ${w.active?"done":"overdue"}">${w.active?"Active":"Disabled"}</span></td><td><div class="action-group"><button class="btn ghost compact" data-edit="${w.id}">Edit</button><button class="btn danger compact" data-delete="${w.id}">Remove</button></div></td></tr>`).join("");
}

function bind(){
  document.querySelector("#addWorker").onclick=()=>workerModal();
  document.querySelector("#search").oninput=e=>{
    const q=e.target.value.toLowerCase();
    document.querySelector("#rows").innerHTML=rows(workers.filter(w=>w.name.toLowerCase().includes(q)||w.code.toLowerCase().includes(q)));
  };
  document.querySelector(".select-all").onchange=e=>{selected=e.target.checked?new Set(workers.map(w=>w.id)):new Set();render()};
  updateSelection();
}

function updateSelection(){
  const box=document.querySelector("#selection");
  if(box) box.innerHTML=selected.size?`<div class="selection-bar"><strong>${selected.size} selected</strong><button class="btn danger compact" id="removeSelected">Remove selected</button></div>`:"";
  const b=document.querySelector("#removeSelected");
  if(b) b.onclick=()=>removeMany([...selected]);
}

document.addEventListener("click",e=>{
  const c=e.target.closest("[data-select]"); if(c)return;
  const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]"),open=e.target.closest("[data-open]");
  if(edit)workerModal(edit.dataset.edit);
  else if(del)removeMany([del.dataset.delete]);
  else if(open)location.href=`worker-details.html?id=${open.dataset.open}`;
});

document.addEventListener("change",e=>{
  if(e.target.matches("[data-select]")){
    e.target.checked?selected.add(e.target.dataset.select):selected.delete(e.target.dataset.select);
    updateSelection();
  }
});

function nextWorkerCode(){
  const nums=workers.map(w=>Number((w.code.match(/\d+/)||[0])[0])).filter(Number.isFinite);
  return `WRK${String((nums.length?Math.max(...nums):0)+1).padStart(3,"0")}`;
}

function workerModal(id){
  const w=workers.find(x=>x.id===id);
  modal(w?"Edit worker":"Add worker",`<div class="form-grid"><label>Name<input name="name" value="${esc(w?.name||"")}" required></label><label>Worker ID<input name="code" value="${esc(w?.code||nextWorkerCode())}" required></label>${w?"":`<label>Passcode<input name="passcode" type="password" minlength="6" autocomplete="new-password" required></label>`}<label>Job / position<input name="job" value="${esc(w?.job||"Farm Worker")}"></label><label>Phone<input name="phone" value="${esc(w?.phone||"")}"></label><label>Salary (TND)<input name="salary" type="number" min="0" value="${w?.salary||0}"></label><label>Hired date<input name="hired" type="date" value="${w?.hired||""}"></label><label>National ID<input name="nationalId" value="${esc(w?.nationalId||"")}"></label><label class="full">Notes<textarea name="notes" rows="3">${esc(w?.notes||"")}</textarea></label></div>`,async fd=>{
    const common={
      worker_code:String(fd.get("code")).trim().toUpperCase(),
      full_name:String(fd.get("name")).trim(),
      phone:String(fd.get("phone")||"")||null,
      job_title:String(fd.get("job")||"")||null,
      salary:Number(fd.get("salary")||0),
      hired_date:String(fd.get("hired")||"")||null,
      national_id:String(fd.get("nationalId")||"")||null,
      notes:String(fd.get("notes")||"")||null
    };

    if(w){
      const {error}=await supabase.from("workers").update(common).eq("id",id);
      if(error){console.error(error);toast(error.message||"Could not update worker","error");return;}
      toast("Worker updated in Supabase");
      await loadAndRender();
      return;
    }

    const payload={...common,passcode:String(fd.get("passcode")),hired_date:common.hired_date||undefined};
    toast("Creating worker…");
    const {data,error}=await supabase.functions.invoke("create-worker",{body:payload});
    if(error||!data?.success){console.error("create-worker failed",error,data);toast(data?.error||error?.message||"Could not create worker","error");return;}
    toast(`${data.worker.worker_code} created in Supabase`);
    await loadAndRender();
  });
}

async function removeMany(ids){
  if(!confirm(`Permanently remove ${ids.length} worker record(s) and their login account(s)?`))return;

  toast(ids.length === 1 ? "Deleting worker…" : "Deleting workers…");

  for(const workerId of ids){
    const {data,error}=await supabase.functions.invoke("delete-worker",{
      body:{worker_id:workerId}
    });

    if(error || !data?.success){
      console.error("delete-worker failed",error,data);
      toast(data?.error || error?.message || "Could not delete worker","error");
      await loadAndRender();
      return;
    }
  }

  selected.clear();
  toast(ids.length === 1 ? "Worker deleted completely" : "Workers deleted completely");
  await loadAndRender();
}
