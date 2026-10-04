const tabs=["Overview","Live SLD","Motor Control","Electrical","Temperature","Vibration & Speed","Trends","Alarms & Events","AI Health","Reports","System"];
let state={running:true,breaker:true,estop:true,trip:false,remote:true,starts:12,trips:1,events:["Dashboard connected","Field RS-485 healthy","System initialized"]};
const nav=document.querySelector("#nav"),content=document.querySelector("#content");
tabs.forEach((t,i)=>{let b=document.createElement("button");b.textContent=t;b.onclick=()=>show(t,b);nav.appendChild(b);if(!i)setTimeout(()=>b.click())});
function metric(n,v,u="",c=""){return '<div class="card"><h3>'+n+'</h3><div class="value '+c+'">'+v+' <span class="unit">'+u+'</span></div></div>'}
function data(){let on=state.running&&!state.trip&&state.breaker&&state.estop;return{rpm:on?Math.round(1470+Math.random()*12):0,kw:on?(0.39+Math.random()*.05).toFixed(2):"0.00",amp:on?(1.05+Math.random()*.12).toFixed(2):"0.00",v:(399+Math.random()*3).toFixed(1),pf:on?(0.81+Math.random()*.03).toFixed(2):"0.00",hz:(49.96+Math.random()*.08).toFixed(2),vib:on?(2.0+Math.random()*.6).toFixed(2):"0.00",temps:[45,43,58,59,57].map(x=>(x+Math.random()*1.4).toFixed(1)),on}}
function head(t,s){return '<h2 class="title">'+t+'</h2><p class="sub">'+s+'</p>'}
function show(t,b){[...nav.children].forEach(x=>x.classList.remove("active"));b.classList.add("active");render(t)}
function render(t){let d=data(),h=head(t,"AI-MoPMS • 0.5 kW three-phase induction motor");
if(t==="Overview")h+='<div class="grid">'+metric("Motor State",d.on?"RUNNING":"STOPPED","",d.on?"ok":"danger")+metric("AI Health","94","%","ok")+metric("Speed",d.rpm,"RPM")+metric("Active Power",d.kw,"kW")+metric("Vibration",d.vib,"mm/s")+metric("Field Network","HEALTHY","","ok")+'</div><h3>PT100 Temperatures</h3><div class="grid">'+["DE Bearing","NDE Bearing","Winding U","Winding V","Winding W"].map((x,i)=>metric(x,d.temps[i],"°C")).join("")+"</div>";
else if(t==="Live SLD")h+='<div class="card sld"><div class="eq">3Φ SUPPLY<br><b>400 V</b></div><div class="line"></div><div class="eq">BREAKER<br><b class="'+(state.breaker?"ok":"danger")+'">'+(state.breaker?"ON":"OFF")+'</b></div><div class="line"></div><div class="eq">CONTACTOR<br><b class="'+(d.on?"ok":"danger")+'">'+(d.on?"CLOSED":"OPEN")+'</b></div><div class="line"></div><div class="eq">MOTOR<br><b>'+d.rpm+' RPM</b></div></div>';
else if(t==="Motor Control")h+='<div class="grid">'+metric("Motor State",d.on?"RUNNING":"STOPPED","",d.on?"ok":"danger")+metric("Contactor Command",state.running?"ON":"OFF","",state.running?"ok":"danger")+metric("Contactor Feedback",d.on?"CLOSED":"OPEN","",d.on?"ok":"danger")+metric("Control Mode",state.remote?"REMOTE":"LOCAL","",state.remote?"ok":"warn")+metric("Breaker",state.breaker?"ON":"OFF","")+metric("E-Stop",state.estop?"HEALTHY":"ACTIVE","",state.estop?"ok":"danger")+metric("Protection",state.trip?"TRIPPED":"HEALTHY","",state.trip?"danger":"ok")+'</div><div class="card controls"><h3>Motor Commands — Simulation Only</h3><button class="start" type="button" data-command="start">START</button><button class="stop" type="button" data-command="stop">STOP</button><button class="reset" type="button" data-command="reset">RESET TRIP</button><button type="button" data-command="mode">LOCAL / REMOTE</button></div>';
else if(t==="Electrical")h+='<div class="grid">'+metric("Line Voltage",d.v,"V")+metric("Current",d.amp,"A")+metric("Active Power",d.kw,"kW")+metric("Power Factor",d.pf)+metric("Frequency",d.hz,"Hz")+metric("Analyzer","CVM-C4","","ok")+"</div>";
else if(t==="Temperature")h+='<div class="grid">'+["DE Bearing","NDE Bearing","Winding U","Winding V","Winding W"].map((x,i)=>metric(x,d.temps[i],"°C",+d.temps[i]>80?"danger":"ok")).join("")+metric("Acquisition","PTA8D08","","ok")+"</div>";
else if(t==="Vibration & Speed")h+='<div class="grid">'+metric("Vibration",d.vib,"mm/s","ok")+metric("Motor Speed",d.rpm,"RPM")+metric("Estimated Slip",d.on?((1500-d.rpm)/1500*100).toFixed(2):"0","%")+metric("Mechanical Health","NORMAL","","ok")+"</div>";
else if(t==="Trends")h+='<div class="card"><h3>Live Trend Preview</h3><p>Telemetry history buffer is ready for connection to the ESP32/API database.</p><div class="bar"><i style="width:'+Math.min(100,+d.vib*18)+'%"></i></div><p>Vibration '+d.vib+' mm/s</p><div class="bar"><i style="width:'+d.temps[2]+'%"></i></div><p>Winding U '+d.temps[2]+' °C</p></div>';
else if(t==="Alarms & Events")h+='<div class="card"><h3>Event Log</h3>'+state.events.map(x=>'<div class="event"><b>'+new Date().toLocaleTimeString()+'</b> — '+x+'</div>').join("")+"</div>";
else if(t==="AI Health")h+='<div class="grid">'+metric("Health Score","94","%","ok")+metric("Anomaly Score","6","%","ok")+metric("Thermal","NORMAL","","ok")+metric("Electrical","NORMAL","","ok")+metric("Mechanical","NORMAL","","ok")+'</div><div class="card"><h3>Predictive Maintenance Advisory</h3><p>No critical anomaly detected. AI values are illustrative until the trained diagnostic model and historical database are connected.</p></div>';
else if(t==="Reports")h+='<div class="grid">'+metric("Operating Hours","128.4","h")+metric("Starts",state.starts)+metric("Trips",state.trips)+metric("Energy","51.7","kWh")+"</div>";
else h+='<div class="grid">'+["ESP32 Master","PTA8D08","CVM-C4","RS-485 Field Bus","Delta DOP-107BV","RS-485 HMI Bus","Wi-Fi / Cloud"].map(x=>metric(x,"ONLINE","","ok")).join("")+'</div><div class="card"><h3>Architecture</h3><p>ESP32 is the source of truth. Field Modbus and HMI Modbus use separate RS-485 links. Protection remains deterministic and local. The hardwired NC E-stop is independent of software, HMI, Wi-Fi and AI.</p></div>';
content.innerHTML=h;
}
function event(x){state.events.unshift(x);state.events=state.events.slice(0,20)}
function startMotor(){if(!state.remote)return alert("Web control disabled in LOCAL mode.");if(!state.breaker||!state.estop||state.trip)return alert("START blocked: permissive not satisfied.");if(confirm("Start motor simulation?")){state.running=true;state.starts++;event("Remote START accepted");render("Motor Control");alert("✓ START command accepted\nMotor is RUNNING.")}}
function stopMotor(){
  state.running=false;
  event("STOP command accepted — contactor command OFF");
  render("Motor Control");
  alert("✓ STOP command accepted\nMotor is STOPPED.");
}
function resetTrip(){if(!state.estop)return alert("Release E-stop first.");state.trip=false;event("Trip reset");render("Motor Control")}
function toggleMode(){state.remote=!state.remote;event("Mode changed to "+(state.remote?"REMOTE":"LOCAL"));render("Motor Control")}
setInterval(()=>{document.querySelector("#clock").textContent=new Date().toLocaleString()},1000);
setInterval(()=>{let a=[...nav.children].find(x=>x.classList.contains("active"));if(a&&["Overview","Electrical","Temperature","Vibration & Speed"].includes(a.textContent))render(a.textContent)},1800);

/* Persistent delegated motor-control handler.
   It survives every content.innerHTML re-render. */
document.addEventListener("click",function(e){
  const btn=e.target.closest("[data-command]");
  if(!btn)return;
  e.preventDefault();
  const cmd=btn.dataset.command;
  if(cmd==="start") startMotor();
  else if(cmd==="stop") stopMotor();
  else if(cmd==="reset") resetTrip();
  else if(cmd==="mode") toggleMode();
});
