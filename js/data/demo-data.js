export const seed = {
  settings:{theme:"dark", archiveRetentionDays:365, sessionMinutes:240},
  currentUser:null,
  accounts:[
    {id:"ADMIN001",passcode:"admin123",role:"admin",workerId:null,active:true},
    {id:"WRK001",passcode:"worker123",role:"worker",workerId:"w1",active:true},
    {id:"WRK002",passcode:"worker123",role:"worker",workerId:"w2",active:true},
    {id:"WRK003",passcode:"worker123",role:"worker",workerId:"w3",active:true},
    {id:"WRK004",passcode:"worker123",role:"worker",workerId:"w4",active:true}
  ],
  workers:[
    {id:"w1",code:"WRK001",name:"Adam Ben Salem",photo:"",phone:"+216 20 000 001",job:"General Farm Worker",salary:1200,hired:"2025-03-12",nationalId:"TN-001",notes:"Experienced with animals and irrigation.",active:true,points:860},
    {id:"w2",code:"WRK002",name:"Youssef Trabelsi",photo:"",phone:"+216 20 000 002",job:"Farm Worker",salary:1150,hired:"2025-06-01",nationalId:"TN-002",notes:"Strong with trees and pruning.",active:true,points:790},
    {id:"w3",code:"WRK003",name:"Sami Gharbi",photo:"",phone:"+216 20 000 003",job:"Farm Worker",salary:1100,hired:"2026-01-15",nationalId:"TN-003",notes:"Plant care and general maintenance.",active:true,points:710},
    {id:"w4",code:"WRK004",name:"Karim Mansour",photo:"",phone:"+216 20 000 004",job:"Farm Worker",salary:1100,hired:"2026-04-04",nationalId:"TN-004",notes:"Animal care and grounds.",active:true,points:675}
  ],
  locations:[
    {id:"l1",name:"Animal Area",description:"Stables, feed and animal-care zone"},
    {id:"l2",name:"North Orchard",description:"Northern tree and fruit area"},
    {id:"l3",name:"Greenhouse",description:"Protected plant growing area"},
    {id:"l4",name:"Main House",description:"Main property and surrounding grounds"},
    {id:"l5",name:"South Field",description:"Open planting area"}
  ],
  objectives:[
    {id:"o1",title:"Restore North Orchard",description:"Prune, irrigate and prepare the orchard for the next growing cycle.",start:"2026-10-01",due:"2026-10-24",taskIds:["t2","t5"]},
    {id:"o2",title:"Prepare Animal Area for Winter",description:"Complete repairs, cleaning and feed preparation.",start:"2026-10-03",due:"2026-10-31",taskIds:["t1","t4"]}
  ],
  tasks:[
    {id:"t1",title:"Morning animal feeding",description:"Feed animals and inspect water supply.",workerIds:["w1","w4"],locationIds:["l1"],objectiveId:"o2",date:"2026-10-06",start:"07:00",deadline:"08:30",priority:"high",progress:100,recurring:"daily",status:"done",points:20,checklist:["Prepare feed","Feed animals","Check water"]},
    {id:"t2",title:"Prune olive trees",description:"Continue pruning marked trees in the north orchard.",workerIds:["w2"],locationIds:["l2"],objectiveId:"o1",date:"2026-10-06",start:"08:30",deadline:"12:00",priority:"medium",progress:65,recurring:"none",status:"in-progress",points:35,checklist:["Collect tools","Prune marked row","Clear cuttings"]},
    {id:"t3",title:"Greenhouse irrigation check",description:"Inspect lines and verify pressure across greenhouse beds.",workerIds:["w3"],locationIds:["l3"],objectiveId:"",date:"2026-10-06",start:"09:00",deadline:"10:00",priority:"high",progress:30,recurring:"weekly",status:"in-progress",points:25,checklist:["Inspect lines","Test pressure","Report leaks"]},
    {id:"t4",title:"Repair stable gate",description:"Repair hinge and secure the stable gate.",workerIds:["w1"],locationIds:["l1"],objectiveId:"o2",date:"2026-10-06",start:"13:00",deadline:"15:30",priority:"high",progress:45,recurring:"none",status:"in-progress",points:40,checklist:["Inspect hinge","Repair","Test gate"]},
    {id:"t5",title:"Clear orchard row 4",description:"Remove weeds and debris from row four.",workerIds:["w2","w3"],locationIds:["l2"],objectiveId:"o1",date:"2026-10-07",start:"08:00",deadline:"11:30",priority:"medium",progress:0,recurring:"none",status:"not-started",points:30,checklist:["Remove weeds","Collect debris"]},
    {id:"t6",title:"Inspect south field fencing",description:"Walk perimeter and note damaged sections.",workerIds:["w4"],locationIds:["l5"],objectiveId:"",date:"2026-10-05",start:"14:00",deadline:"16:00",priority:"low",progress:70,recurring:"none",status:"in-progress",points:20,checklist:["Walk perimeter","Mark damage"]}
  ],
  attendance:[
    {id:"a1",workerId:"w1",date:"2026-10-06",status:"present",start:"06:55",end:""},
    {id:"a2",workerId:"w2",date:"2026-10-06",status:"present",start:"07:10",end:""},
    {id:"a3",workerId:"w3",date:"2026-10-06",status:"present",start:"07:03",end:""},
    {id:"a4",workerId:"w4",date:"2026-10-06",status:"day-off",start:"",end:""}
  ],
  archive:[]
};
