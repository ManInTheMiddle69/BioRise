import { seed } from "./demo-data.js";
const KEY="biorise_v1_data";
const clone=x=>JSON.parse(JSON.stringify(x));
function migrate(saved){
  const base=clone(seed), d=(saved&&typeof saved==="object")?saved:{};
  for(const key of ["accounts","workers","locations","objectives","tasks","attendance","archive"]){
    if(!Array.isArray(d[key])) d[key]=base[key];
  }
  d.settings={...base.settings,...(d.settings||{})};
  if(!("currentUser" in d)) d.currentUser=null;
  return d;
}
export function getData(){
  const raw=localStorage.getItem(KEY);
  if(!raw){localStorage.setItem(KEY,JSON.stringify(seed));return clone(seed)}
  try{const d=migrate(JSON.parse(raw));localStorage.setItem(KEY,JSON.stringify(d));return d}catch{localStorage.setItem(KEY,JSON.stringify(seed));return clone(seed)}
}
export function saveData(data){localStorage.setItem(KEY,JSON.stringify(migrate(data)));window.dispatchEvent(new CustomEvent("biorise:data"))}
export function updateData(fn){const d=getData();fn(d);saveData(d);return d}
export function resetData(){localStorage.setItem(KEY,JSON.stringify(seed));location.reload()}
export function uid(prefix="id"){return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}
export function getWorker(id){return getData().workers.find(w=>w.id===id)}
export function taskStatus(t){if(Number(t.progress)>=100)return "done";if(Number(t.progress)>0)return "in-progress";return "not-started"}
export function objectiveProgress(obj,data=getData()){const ids=Array.isArray(obj.taskIds)?obj.taskIds:[];const ts=data.tasks.filter(t=>ids.includes(t.id));return ts.length?Math.round(ts.reduce((a,t)=>a+Number(t.progress||0),0)/ts.length):0}
