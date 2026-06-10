// @ts-nocheck
"use client";
import { useCallback, useEffect, useState } from "react";

const PT_ROSTER = [
  { id:1,  name:"CRAIG",  role:"Osteopath & S&C Coach",             specialisms:["rehab","injury","longevity","health_mgmt","advanced"],                              populations:["advanced","rehab","intermediate","older_adults","corporate"],                        bestFor:"Return to sport, break through perceived limits and perform without fear of injury. Clinical diagnosis meets progressive strength training.",                                            gender:"male",   tier:"SENIOR",     capacity:3,  rate:125, initials:"CR", active:true,  availability:{1:[{s:"07:00",e:"14:00"}],3:[{s:"07:00",e:"14:00"}],5:[{s:"07:00",e:"14:00"}],6:[{s:"08:00",e:"12:00"}]} },
  { id:2,  name:"JESS",   role:"Strength Coach & Women's Health PT", specialisms:["strength","body_composition","pre_postnatal","womens_health","recomposition"],              populations:["womens_health","beginners","intermediate","corporate"],                              bestFor:"Structured strength training for body composition and lean muscle growth. Specialist in women's health, pre/postnatal and long-term body confidence.",                                          gender:"female", tier:"SPECIALIST", capacity:5,  rate:80,  initials:"JE", active:true,  availability:{0:[{s:"08:00",e:"18:00"}],1:[{s:"07:30",e:"20:00"}],2:[{s:"06:30",e:"20:00"}],3:[{s:"07:30",e:"20:00"}],4:[{s:"06:30",e:"20:00"}],5:[{s:"07:30",e:"20:00"}],6:[{s:"11:00",e:"18:00"}]} },
  { id:3,  name:"MAX",    role:"Martial Arts Instructor & PT",       specialisms:["boxing","martial_arts","mobility","strength","conditioning"],                       populations:["beginners","older_adults","teens","corporate","rehab"],                              bestFor:"Boxing, Muay Thai, Kickboxing and mobility coaching. Combat skills meet structured strength programming for all levels.",                                                              gender:"male",   tier:"SPECIALIST", capacity:4,  rate:110, initials:"MX", active:true,  availability:{1:[{s:"08:00",e:"20:00"}],2:[{s:"08:00",e:"20:00"}],3:[{s:"08:00",e:"20:00"}],4:[{s:"08:00",e:"20:00"}],5:[{s:"08:00",e:"20:00"}],6:[{s:"08:00",e:"14:00"}]} },
  { id:4,  name:"MARA",   role:"Personal Trainer",                   specialisms:["running","hyrox","injury_prevention","functional","conditioning"],                  populations:["runners","hyrox","intermediate","beginners","older_adults","corporate","rehab"],    bestFor:"Running performance, HYROX prep and injury-resilient training. Functional strength with longevity always considered.",                                                                gender:"female", tier:"SPECIALIST", capacity:6,  rate:90,  initials:"MA", active:true,  availability:{1:[{s:"06:00",e:"19:00"}],2:[{s:"06:00",e:"19:00"}],3:[{s:"06:00",e:"19:00"}],4:[{s:"06:00",e:"19:00"}],5:[{s:"06:00",e:"19:00"}]} },
  { id:7,  name:"ALICE",  role:"Coach & Personal Trainer",           specialisms:["womens_health","strength","hypertrophy","pre_postnatal","recomposition","rehab"],   populations:["womens_health","beginners","intermediate","older_adults","corporate","rehab"],      bestFor:"Biomechanics and hypertrophy for women. Builds strength and lasting body confidence through technically precise, progressive programming.",                                             gender:"female", tier:"ASSOCIATE",  capacity:5,  rate:105, initials:"AL", active:true,  availability:{1:[{s:"10:30",e:"11:30"},{s:"14:00",e:"16:00"}],3:[{s:"10:30",e:"11:30"},{s:"12:00",e:"20:00"}],4:[{s:"07:00",e:"11:00"},{s:"16:00",e:"19:00"}],6:[{s:"13:00",e:"20:00"}]} },
  { id:9,  name:"SAM",    role:"Performance Coach",                  specialisms:["sport_specific","rehab","power","speed","athletic_performance"],                    populations:["advanced","rehab","sport_specific"],                                                 bestFor:"Athletic performance and injury rehab for serious athletes. Premier League background in power, speed and sports-specific S&C.",                                                       gender:"male",   tier:"SENIOR",     capacity:8,  rate:150, initials:"SA", active:true,  availability:{1:[{s:"08:00",e:"10:00"}],2:[{s:"08:00",e:"10:00"}],3:[{s:"08:00",e:"10:00"}],4:[{s:"08:00",e:"10:00"}],5:[{s:"08:00",e:"10:00"}]} },
  { id:10, name:"AIMEE",  role:"Personal Trainer",                   specialisms:["strength","recomposition","womens_health","nutrition","body_composition"],                  populations:["womens_health","beginners","intermediate","older_adults","corporate"],             bestFor:"Strength and body composition coaching for women, with specialist support for midlife and hormonal health.",                                                                           gender:"female", tier:"SPECIALIST", capacity:5,  rate:95,  initials:"AI", active:true,  availability:{1:[{s:"11:00",e:"15:00"}],3:[{s:"09:30",e:"12:30"},{s:"13:45",e:"15:00"}],4:[{s:"11:00",e:"13:00"},{s:"14:00",e:"15:00"}],5:[{s:"12:00",e:"16:00"}]} },
  { id:11, name:"LUCAS",  role:"Performance Coach & PT",             specialisms:["strength","hyrox","running","endurance","body_composition","conditioning"],                 populations:["hyrox","runners","beginners","intermediate","advanced","corporate"],               bestFor:"Strength, HYROX and endurance coaching. Structured training for performance goals — getting faster, stronger and leaner with a multi-discipline approach.",                             gender:"male",   tier:"ASSOCIATE",  capacity:6,  rate:100, initials:"LU", active:true,  availability:{1:[{s:"07:00",e:"20:00"}],2:[{s:"07:00",e:"20:00"}],3:[{s:"07:00",e:"20:00"}],4:[{s:"07:00",e:"20:00"}],5:[{s:"07:00",e:"20:00"}]} },
  { id:12, name:"GRACE",  role:"Personal Trainer",                   specialisms:["body_composition","recomposition","hypertrophy","strength","beginners"],                    populations:["beginners","intermediate","womens_health","corporate"],                              bestFor:"Structured physique transformations — body composition, muscle building and recomposition with realistic, lasting results.",                                                               gender:"female", tier:"ASSOCIATE",  capacity:7,  rate:100, initials:"GR", active:false, availability:{1:[{s:"08:00",e:"20:00"}],2:[{s:"08:00",e:"20:00"}],3:[{s:"08:00",e:"20:00"}],4:[{s:"08:00",e:"20:00"}],5:[{s:"08:00",e:"20:00"}],6:[{s:"08:00",e:"14:00"}]} },
  { id:13, name:"ADRIAN", role:"Coach & Personal Trainer",           specialisms:["weightlifting","strength","body_composition","conditioning","hyrox","crossfit","recomposition"], populations:["beginners","intermediate","advanced","hyrox","older_adults","corporate","teens"], bestFor:"Olympic weightlifting, body transformations and strength coaching. Technical lifting and high-output conditioning with 10 years of coaching experience.",                                gender:"male",   tier:"ASSOCIATE",  capacity:7,  rate:88,  initials:"AC", active:true,  availability:{1:[{s:"07:00",e:"09:00"},{s:"13:30",e:"20:00"}],2:[{s:"08:00",e:"15:00"}],3:[{s:"07:00",e:"09:00"},{s:"13:30",e:"20:00"}],4:[{s:"08:00",e:"15:00"}]} },
  { id:14, name:"ANNIE",  role:"Coach & Personal Trainer",           specialisms:["hyrox","conditioning","strength","functional","endurance"],                         populations:["hyrox","beginners","intermediate","advanced","runners","older_adults","corporate"], bestFor:"HYROX, Turf Games and hybrid training. Breaks training plateaus and builds real fitness and strength — structured programming that makes you feel both fit and strong.",                 gender:"female", tier:"ASSOCIATE",  capacity:6,  rate:100, initials:"AH", active:true,  availability:{1:[{s:"07:00",e:"10:00"}],2:[{s:"07:00",e:"10:00"}],3:[{s:"07:00",e:"10:00"}],4:[{s:"07:00",e:"10:00"}],5:[{s:"07:00",e:"10:00"}]} },
];

// Generate bookable 1-hour slots for a PT on a given date string (YYYY-MM-DD)
// availability format: { [dayOfWeek]: [{s:"HH:MM", e:"HH:MM"}] }  0=Sun, 1=Mon...6=Sat
function generateSlots(pt, dateStr) {
  if (!pt.availability) return [];
  const date = new Date(dateStr + "T00:00:00");
  const dow = date.getDay();
  const windows = pt.availability[dow];
  if (!windows || windows.length === 0) return [];
  const now = new Date();
  const slots = [];
  windows.forEach(({s, e}) => {
    const [sh, sm] = s.split(":").map(Number);
    const [eh, em] = e.split(":").map(Number);
    let cur = new Date(date); cur.setHours(sh, sm, 0, 0);
    const end = new Date(date); end.setHours(eh, em, 0, 0);
    while (cur < end) {
      if (cur > now) slots.push(cur.toTimeString().slice(0, 5));
      cur = new Date(cur.getTime() + 60 * 60 * 1000);
    }
  });
  return slots;
}

// Format an ISO timestamp like "2026-05-29T14:33:52.644295+00:00" → "Fri 29 May, 14:34"
const _DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const _MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtSubmittedAt(s) {
  if (!s) return "";
  if (s === "Just now") return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  return `${_DAYS[d.getDay()]} ${d.getDate()} ${_MONTHS[d.getMonth()]}, ${hh}:${mm}`;
}

// Next N calendar days as YYYY-MM-DD strings (starting tomorrow)
function getNextDays(n) {
  const days = [];
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0,0,0,0);
  for (let i = 0; i < n; i++) {
    days.push(d.toISOString().slice(0,10));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const STATUS = {
  new:       {label:"NEW",       color:"#c1ff72"},
  assigned:  {label:"ASSIGNED",  color:"#ffffff"},
  contacted: {label:"CONTACTED", color:"#d6242d"},
};

const GOAL_LABELS = {performance:"PERFORMANCE",play:"PLAY & SOCIAL FITNESS",consistency:"CONSISTENCY",longevity:"LONGEVITY & HEALTH",aesthetics:"AESTHETICS",mindset:"MINDSET & RESILIENCE",other:"OTHER"};
// goal may be a single value, an array, or a comma-joined string of values
function goalLabel(v){return (Array.isArray(v)?v:String(v||"").split(",")).filter(Boolean).map(g=>GOAL_LABELS[g]||g).join(" · ");}
const FREQ_LABELS = {never:"NEW TO TRAINING","1_2":"1–2X / WEEK","3_4":"3–4X / WEEK","5_6":"5–6X / WEEK","7plus":"7+ / WEEK"};

function leadHasInjury(injuries) {
  if (!injuries || !injuries.trim()) return false;
  const lower = injuries.trim().toLowerCase();
  return lower !== "none" && lower !== "no" && lower !== "n/a";
}

const STEPS = [
  {title:"WHICH OF THESE TRAINING GOALS BEST DESCRIBES WHAT YOU'RE LOOKING FOR?", field:"goal", type:"select", multi:true, maxSelect:3, cols:2, options:[
    {value:"performance", label:"Performance – strength, speed, endurance or comp prep"},
    {value:"play",        label:"Play – social fitness, energy, connection and events"},
    {value:"consistency", label:"Consistency – building a sustainable lifestyle"},
    {value:"longevity",   label:"Longevity – injury prevention or recovery"},
    {value:"aesthetics",  label:"Aesthetics – building a lean or athletic physique"},
    {value:"mindset",     label:"Mindset & Resilience – fuelling your mental health"},
    {value:"other",       label:"Other"},
  ]},
  {title:"NOW TELL US, MORE SPECIFICALLY, WHAT YOU'D LIKE TO WORK ON:", field:"goal_detail", type:"text", placeholder:"Share as much or as little as you like..."},
  {title:"HOW OFTEN DO YOU CURRENTLY TRAIN?", field:"freq", type:"select", cols:1, options:[
    {value:"never",  label:"Never"},
    {value:"1_2",    label:"1–2 times / week"},
    {value:"3_4",    label:"3–4 times / week"},
    {value:"5_6",    label:"5–6 times / week"},
    {value:"7plus",  label:"7+ times / week"},
  ]},
  {title:"DO YOU HAVE ANY PREVIOUS INJURIES OR MEDICAL CONDITIONS WE SHOULD KNOW ABOUT?", field:"injuries", type:"text", placeholder:"Leave blank if none", optional:true},
  {title:"DO YOU HAVE A PREFERENCE FOR YOUR TRAINER'S GENDER?", field:"pt_gender_pref", type:"select", cols:1, options:[
    {value:"no_preference", label:"No preference"},
    {value:"male",          label:"Male"},
    {value:"female",        label:"Female"},
  ]},
  {title:"BEFORE WE MATCH YOU, IS THERE ANYTHING ELSE WE SHOULD KNOW?", field:"anything_else", type:"text", placeholder:"Fitness experience, goals, preferences...", optional:true},
];

export default function PTMatcher({ mode = "member", sessionEmail = "" }) {
  const [view,setView]=useState(mode==="admin"?"admin":"member");
  const [leads,setLeads]=useState([]);
  const [leadsLoading,setLeadsLoading]=useState(mode==="admin");
  const [selected,setSelected]=useState(null);
  const [matchResults,setMatchResults]=useState([]);
  const [submitting,setSubmitting]=useState(false);
  const [selectedMatchIdx,setSelectedMatchIdx]=useState(0);
  const [bookingPT,setBookingPT]=useState(null);
  const [bookingConfirmed,setBookingConfirmed]=useState(false);
  const [bookingRequests,setBookingRequests]=useState([]);
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({name:"",email:"",dob:"",gender:"",goal:[],goal_detail:"",freq:"",injuries:"",pt_gender_pref:"",anything_else:""});
  const [nameStep,setNameStep]=useState(false);
  const [briefState,setBriefState]=useState({ sending: false, message: "" });
  const [leadsError,setLeadsError]=useState("");

  const loadLeads = useCallback(async () => {
    if (mode !== "admin") return;
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        const msg = res.status===401
          ? "Not signed in (or session expired). Sign in with an @oneldn.com Google account."
          : `Failed to load leads — HTTP ${res.status}${body?.detail?` · ${body.detail}`:""}`;
        setLeadsError(msg);
        setLeadsLoading(false);
        return;
      }
      const out = await res.json();
      setLeads(out.leads ?? []);
      setLeadsError("");
      setLeadsLoading(false);
    } catch (err) {
      setLeadsError(`Network error loading leads — ${String(err)}`);
      setLeadsLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "admin") return;
    loadLeads();
    const interval = setInterval(loadLeads, 15000);
    return () => clearInterval(interval);
  }, [mode, loadLeads]);

  useEffect(() => {
    setBriefState({ sending: false, message: "" });
  }, [selected?.id]);

  function handleSelect(field,value){
    setAnswers(p=>{
      const cur=p[field];
      if(Array.isArray(cur)){
        if(cur.includes(value)) return {...p,[field]:cur.filter(v=>v!==value)};
        if(cur.length>=3) return p; // cap multi-select at 3
        return {...p,[field]:[...cur,value]};
      }
      return {...p,[field]:value};
    });
  }
  function handleNext(){
    if(step<STEPS.length-1){ setStep(s=>s+1); }
    else{ submitForm(answers); }
  }
  async function submitForm(data){
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return;
      const out = await res.json();
      const matches = out.matches ?? [];
      setMatchResults(matches); setSelectedMatchIdx(0);
      const lead={id:out.lead?.id || leads.length+10,name:data.name||"New Member",email:data.email,dob:data.dob,gender:data.gender,goal:Array.isArray(data.goal)?data.goal.join(","):data.goal,goal_detail:data.goal_detail,freq:data.freq,injuries:data.injuries,pt_gender_pref:data.pt_gender_pref,anything_else:data.anything_else,status:"new",assignedPT:out.lead?.assigned_pt_id || null,submittedAt:"Just now",notes:""};
      setLeads(p=>[lead,...p]); setView("result");
      if(typeof window!=="undefined") window.scrollTo({top:0});
    } finally {
      setSubmitting(false);
    }
  }
  async function assignPT(lid,pid){
    await fetch("/api/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lid, ptId: pid, status: "assigned", assignedBy: sessionEmail }),
    });
    setLeads(p=>p.map(l=>l.id===lid?{...l,assignedPT:pid,status:"assigned"}:l));setSelected(p=>p?{...p,assignedPT:pid,status:"assigned"}:p);
    loadLeads();
  }
  async function updateStatus(lid,s){
    const current = leads.find((l) => l.id === lid);
    await fetch("/api/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lid, ptId: current?.assignedPT || null, status: s, assignedBy: sessionEmail }),
    });
    setLeads(p=>p.map(l=>l.id===lid?{...l,status:s}:l));setSelected(p=>p?{...p,status:s}:p);
    loadLeads();
  }

  async function sendBrief(lead){
    if (!lead?.assignedPT) return;
    setBriefState({ sending: true, message: "" });
    const res = await fetch("/api/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id }),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBriefState({ sending: false, message: out.error || "Could not send brief" });
      return;
    }
    setBriefState({ sending: false, message: `Brief sent to ${out.ptName}` });
  }

  async function logContact(lid){
    await updateStatus(lid, "contacted");
    setBriefState({ sending: false, message: "Marked as contacted" });
  }

  const newCount=leads.filter(l=>l.status==="new").length;

  const CSS = `
    @font-face {
      font-family: 'Horizon';
      src: url('/fonts/horizon.otf') format('opentype');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Horizon';
      src: url('/fonts/horizon.otf') format('opentype');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'HorizonOutlined';
      src: url('/fonts/horizon_outlined.otf') format('opentype');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#333}

    .h1  { font-family:'Horizon','Courier Prime',monospace; font-weight:400; font-size:clamp(38px,9vw,55px); line-height:0.92; letter-spacing:0.02em; text-transform:uppercase; }
    .h2  { font-family:'Horizon','Courier Prime',monospace; font-weight:400; font-size:clamp(24px,5vw,44px); line-height:0.95; letter-spacing:0.02em; text-transform:uppercase; }
    .step-heading { font-family:'Horizon','Courier Prime',monospace; font-weight:400; font-size:20px; line-height:1.15; letter-spacing:0.02em; text-transform:uppercase; text-align:left; display:inline-block; max-width:100%; }
    .h3  { font-family:'Horizon','Courier Prime',monospace; font-weight:400; font-size:20px; letter-spacing:0.03em; text-transform:uppercase; }
    .h-outlined { font-family:'HorizonOutlined','Courier Prime',monospace; font-weight:400; letter-spacing:0.02em; text-transform:uppercase; }
    .label { font-family:'Courier Prime',monospace; font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; }
    .body  { font-family:'Courier Prime',monospace; font-size:14px; font-weight:400; line-height:1.65; }

    .nav { background:#000; border-bottom:1px solid #1a1a1a; padding:0 24px; height:64px; display:flex; align-items:center; justify-content:center; position:sticky; top:0; z-index:100; }
    .nav-logo-img { height:36px; width:auto; object-fit:contain; }
    .nav-tabs { position:absolute; right:24px; display:flex; gap:4px; }
    .nav-tab { font-family:'Horizon',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#888; background:transparent; border:1px solid #222; padding:7px 14px; cursor:pointer; transition:all 0.15s; }
    .nav-tab:hover { color:#fff; border-color:#fff; }
    .nav-tab.active { color:#000; background:#c1ff72; border-color:#c1ff72; }

    .ticker { background:#000; border-bottom:1px solid #1a1a1a; padding:10px 0; }
    .ticker-item { font-family:'Courier Prime',monospace; font-size:11px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:#fff; }

    .btn-red { font-family:'Horizon',monospace; font-size:13px; letter-spacing:0.16em; text-transform:uppercase; background:#d6242d; color:#fff; border:none; padding:17px 32px; cursor:pointer; width:100%; transition:opacity 0.15s; }
    .btn-red:hover { opacity:0.85; }
    .btn-red:disabled { opacity:0.3; cursor:not-allowed; }
    .btn-outline { font-family:'Horizon',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; background:transparent; color:#fff; border:1px solid #333; padding:10px 20px; cursor:pointer; transition:all 0.15s; }
    .btn-outline:hover { border-color:#fff; }
    .btn-ghost { font-family:'Horizon',monospace; font-size:9px; letter-spacing:0.12em; text-transform:uppercase; background:transparent; color:#666; border:1px solid #222; padding:7px 14px; cursor:pointer; transition:all 0.15s; }
    .btn-ghost:hover { color:#fff; border-color:#555; }
    .btn-ghost.assigned { color:#c1ff72; border-color:#c1ff72; }

    .opt { background:#0a0a0a; border:1px solid #222; padding:18px 20px; cursor:pointer; transition:all 0.15s; text-align:left; width:100%; display:flex; align-items:center; gap:14px; }
    .opt:hover { border-color:#fff; background:#111; }
    .opt.sel { border-color:#c1ff72; background:#0d1a00; }
    .opt-label { font-family:'Courier Prime',monospace; font-size:13px; letter-spacing:0.04em; text-transform:uppercase; }

    .lead-row { padding:14px 20px; border-bottom:1px solid #111; cursor:pointer; transition:background 0.1s; display:flex; align-items:center; gap:12px; }
    .lead-row:hover { background:#0d0d0d; }
    .lead-row.active { background:#0d1a00; border-left:2px solid #c1ff72; }
    .lead-name { font-family:'Horizon',monospace; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; color:#fff; }

    .pt-card { border:1px solid #222; padding:20px; margin-bottom:10px; display:flex; gap:16px; transition:border-color 0.15s; }
    .pt-card:hover { border-color:#444; }
    .pt-card.top { border-color:#c1ff72; background:#050f00; }
    .pt-name { font-family:'Horizon',monospace; font-size:22px; letter-spacing:0.04em; text-transform:uppercase; }

    .av { display:flex; align-items:center; justify-content:center; font-family:'Horizon',monospace; letter-spacing:0.06em; flex-shrink:0; text-transform:uppercase; }

    .section-label { font-family:'Courier Prime',monospace; font-size:9px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:#555; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #111; }
    .progress { height:2px; background:#1a1a1a; }
    .progress-fill { height:100%; background:#c1ff72; transition:width 0.35s; }
    .loading-bar { height:3px; background:#1a1a1a; overflow:hidden; position:relative; }
    .loading-bar-fill { position:absolute; height:100%; background:#c1ff72; animation:indet 1.1s ease-in-out infinite; }
    @keyframes indet { 0%{left:-40%;width:40%} 50%{left:30%;width:55%} 100%{left:100%;width:40%} }
    .fade-up { animation:fu 0.3s ease forwards; }
    @keyframes fu { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

    input, textarea { font-family:'Courier Prime',monospace; font-size:14px; background:#fff; border:1px solid #ccc; color:#111; padding:14px 16px; width:100%; outline:none; transition:border-color 0.15s; box-sizing:border-box; }
    input:focus, textarea:focus { border-color:#c1ff72; background:#fff; }
    input::placeholder, textarea::placeholder { color:#999; letter-spacing:0.04em; text-transform:uppercase; font-family:'Courier Prime',monospace; }
    @media (max-width: 768px) { input, textarea { font-size:16px; } textarea { resize:none; } }
    select { font-family:'Horizon',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; background:#0a0a0a; border:1px solid #222; color:#fff; padding:8px 12px; cursor:pointer; outline:none; }
    select option { background:#0a0a0a; font-family:'Courier Prime',monospace; }

    .lime { color:#c1ff72; } .red { color:#d6242d; } .dim { color:#999; }
    .pill { font-family:'Courier Prime',monospace; font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; padding:3px 8px; border:1px solid; display:inline-flex; align-items:center; gap:5px; }
  `;

  return (
    <div style={{fontFamily:"'Courier Prime',monospace",background:"#000",minHeight:"100vh",color:"#fff"}}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* NAV */}
      <nav className="nav">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="data:image/png;base64,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ICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgr3ow0HAAA4eklEQVR4Ae2dDbhdRXnvT0hCvpGEkEACJoeECqaChVypV1QiKrX2WrQgclvbXtDq5UqprV59vK1AbW8/0MpVq1Zbr7XaavRSrZYrRQVEbVWogvIhJEhA8k0S8n1yTs7p77+y57jPyd77rL32zN5r7/Of51l7rT1r5p13/jPzzjvvfKy+PjsjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBgBI2AEjIARMAJGwAgYASNgBIyAETACRsAIGAEjYASMgBEwAkbACBiBbkdgZGRkCnnQZWcEjIARMAI9hoCFe8ECpXOcvn79+vlz5sxZOG3atEXTp09fNHXq1AU8z+eaDdkZxxxzzFSuYZ4Pcx3iOli59nHff/jw4X1DQ0P7Dh06tI/nPdz3QncP7/YtXrz44JQpUxSva91jjz02AiaB/33k7SnytIf7bnAZzSsB9Lwfv/3Dw8P7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" className="nav-logo-img" alt="ONE LDN" style={{position:"absolute",left:24}}/>
        {mode==="admin"&&(
          <div className="nav-tabs">
            <button className={`nav-tab ${view==="member"||view==="result"?"active":""}`}
              onClick={()=>{setView("member");setStep(0);setNameStep(false);setAnswers({name:"",email:"",dob:"",gender:"",goal:[],goal_detail:"",freq:"",injuries:"",pt_gender_pref:"",anything_else:""});}}>
              FIND MY PT
            </button>
            <button className={`nav-tab ${view==="admin"?"active":""}`} onClick={()=>setView("admin")}>ADMIN</button>
          </div>
        )}
      </nav>

      {/* BANNER */}
      <div className="ticker">
        <div style={{padding:"8px 24px",textAlign:"center"}}>
          <span className="ticker-item">INDIVIDUALLY BRILLIANT, UNBEATABLE AS ONE</span>
        </div>
      </div>

      {/* ═══ MEMBER FORM ═══ */}
      {view==="member" && (
        <div className="fade-up">
          <div style={{padding:"52px 0 36px",borderBottom:"1px solid #1a1a1a"}}>
            <div style={{maxWidth:560,margin:"0 auto",padding:"0 24px"}}>
              <p className="label" style={{marginBottom:14,color:"#fff"}}>Personal Training</p>
              <h1 className="h1">FIND YOUR<br/><span className="lime">SPECIALIST.</span></h1>
            </div>
            <div style={{maxWidth:560,margin:"0 auto",padding:"0 24px"}}>
              <p className="body dim" style={{marginTop:18}}>Tell us a bit about yourself and get matched with the right coach for your experience, training style and goals.</p>
            </div>
          </div>
          <div style={{maxWidth:560,margin:"0 auto",padding:"44px 24px"}}>
            {!nameStep ? (
              <div className="fade-up">
                <p className="section-label">About you</p>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <input placeholder="Full name" value={answers.name} onChange={e=>setAnswers(p=>({...p,name:e.target.value}))}/>
                  <input placeholder="Email address" type="email" value={answers.email} onChange={e=>setAnswers(p=>({...p,email:e.target.value}))}/>
                  <p className="section-label" style={{marginBottom:0,paddingBottom:0,borderBottom:"none",marginTop:8}}>Date of birth</p>
                  <input type="date" min="1925-01-01" max={new Date().toISOString().slice(0,10)} value={answers.dob} onChange={e=>setAnswers(p=>({...p,dob:e.target.value}))}/>
                  <p className="section-label" style={{marginBottom:0,paddingBottom:0,borderBottom:"none",marginTop:8}}>Gender</p>
                  <select value={answers.gender} onChange={e=>setAnswers(p=>({...p,gender:e.target.value}))}
                    style={{fontFamily:"'Courier Prime',monospace",fontSize:14,background:"#fff",border:"1px solid #ccc",color:"#111",padding:"14px 16px",width:"100%",outline:"none",textTransform:"none",letterSpacing:0}}>
                    <option value="">Select…</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                  <button className="btn-red" onClick={()=>{if(answers.name&&answers.email&&answers.gender)setNameStep(true);}} disabled={!answers.name||!answers.email||!answers.gender}>
                    START MATCHING →
                  </button>
                </div>
              </div>
            ):(
              <div className="fade-up">
                <div className="progress" style={{marginBottom:28}}><div className="progress-fill" style={{width:`${((step+1)/STEPS.length)*100}%`}}/></div>
                <p className="label dim" style={{marginBottom:14}}>STEP {step+1} OF {STEPS.length}</p>
                <h2 className="step-heading" style={{marginBottom:28}}>{STEPS[step].title}</h2>
                {STEPS[step].type==="text" ? (
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <textarea
                      rows={4}
                      placeholder={STEPS[step].placeholder}
                      value={answers[STEPS[step].field]}
                      onChange={e=>setAnswers(p=>({...p,[STEPS[step].field]:e.target.value}))}
                      style={{resize:"vertical"}}
                    />
                    <button className="btn-red"
                      onClick={handleNext}
                      disabled={submitting || (!STEPS[step].optional && !answers[STEPS[step].field])}>
                      {submitting?"MATCHING...":step===STEPS.length-1?"SEE MY MATCHES →":"CONTINUE →"}
                    </button>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {STEPS[step].multi&&<p className="label dim" style={{marginBottom:8,fontSize:9}}>SELECT UP TO {STEPS[step].maxSelect}</p>}
                    <div style={{display:"grid",gridTemplateColumns:`repeat(${STEPS[step].cols},1fr)`,gap:6}}>
                      {STEPS[step].options.map(opt=>{
                        const sel=STEPS[step].multi?answers[STEPS[step].field].includes(opt.value):answers[STEPS[step].field]===opt.value;
                        return(
                        <button key={opt.value} className={`opt ${sel?"sel":""}`}
                          onClick={()=>handleSelect(STEPS[step].field,opt.value)}>
                          <div style={{flex:1}}>
                            <div className="opt-label" style={{color:sel?"#c1ff72":"#fff"}}>{opt.label}</div>
                            {opt.sub&&<div className="body dim" style={{fontSize:12,marginTop:4}}>{opt.sub}</div>}
                          </div>
                          {sel&&<span className="lime">✓</span>}
                        </button>
                        );
                      })}
                    </div>
                    <button className="btn-red" style={{marginTop:8}}
                      disabled={submitting || (STEPS[step].multi?answers[STEPS[step].field].length===0:!answers[STEPS[step].field])}
                      onClick={handleNext}>
                      {submitting?"MATCHING...":step===STEPS.length-1?"SEE MY MATCHES →":"CONTINUE →"}
                    </button>
                  </div>
                )}
                {submitting&&(
                  <div style={{marginTop:16}}>
                    <div className="loading-bar"><div className="loading-bar-fill"/></div>
                    <p className="label dim" style={{marginTop:10,fontSize:9}}>FINDING YOUR SPECIALISTS — THIS CAN TAKE A FEW SECONDS</p>
                  </div>
                )}
                {step>0&&!submitting&&<button className="btn-outline" style={{marginTop:16,width:"auto",padding:"10px 20px"}} onClick={()=>setStep(s=>s-1)}>← BACK</button>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ MATCH RESULT ═══ */}
      {view==="result"&&(
        <div className="fade-up">
          <div style={{padding:"52px 24px 36px",borderBottom:"1px solid #1a1a1a"}}>
            <div style={{maxWidth:680,margin:"0 auto"}}>
              <p className="label lime" style={{marginBottom:14}}>MATCH COMPLETE</p>
              <h1 className="h1">YOUR<br/><span className="lime">SPECIALISTS.</span></h1>
            </div>
            <div style={{maxWidth:640,margin:"0 auto"}}>
              <p className="body dim" style={{marginTop:18}}>Ranked by fit to your goal and profile. Your details have been passed to the team — you&apos;ll hear from us within 24–48 hours.</p>
            </div>
          </div>
          <div style={{maxWidth:640,margin:"0 auto",padding:"44px 24px"}}>
            <p className="section-label">Recommended coaches</p>
            {matchResults.map((pt,i)=>(
              <div key={pt.id}
                className={`pt-card ${i===selectedMatchIdx?"top":""}`}
                style={{cursor:"pointer"}}
                onClick={()=>setSelectedMatchIdx(i)}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                    <span className="pt-name" style={{color:"#fff"}}>{pt.name}</span>
                    {i===0&&<span className="pill" style={{color:"#000",background:"#c1ff72",borderColor:"#c1ff72",fontSize:8}}>BEST MATCH</span>}
                    {i===selectedMatchIdx&&i!==0&&<span className="pill" style={{color:"#fff",borderColor:"#fff",fontSize:8}}>SELECTED</span>}
                  </div>
                  <p className="label" style={{marginBottom:8,fontSize:9,color:"#fff"}}>{pt.role}</p>
                  <p className="body dim" style={{fontSize:13}}>{pt.bestFor}</p>
                  {(pt.client_reasoning||pt.reasoning)&&(
                    <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #1a1a1a"}}>
                      <p className="label" style={{fontSize:8,color:"#c1ff72",marginBottom:4}}>WHY THIS MATCH</p>
                      <p className="body dim" style={{fontSize:13}}>{pt.client_reasoning??pt.reasoning}</p>
                    </div>
                  )}
                  {i===selectedMatchIdx&&<button className="btn-red" style={{marginTop:18}} onClick={e=>{e.stopPropagation();setBookingPT(pt);setBookingConfirmed(false);setView("booking");}}>REQUEST INTRO SESSION →</button>}
                </div>
              </div>
            ))}
            <div style={{marginTop:24,padding:"18px 20px",borderLeft:"2px solid #d6242d",background:"#0a0000"}}>
              <p className="body" style={{fontSize:13,color:"#888"}}>
                <span style={{color:"#fff",fontFamily:"'Horizon',monospace",fontSize:11,letterSpacing:"0.1em"}}>WHAT HAPPENS NEXT —</span>{" "}
                Your matched PT will contact you within 24–48 hours to arrange your intro session. No commitment required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ADMIN VIEW ═══ */}
      {view==="admin"&&(
        <div>
          <div style={{padding:"40px 24px 28px",borderBottom:"1px solid #1a1a1a",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
            <div>
              <p className="label red" style={{marginBottom:10}}>Operations Dashboard</p>
              <h1 className="h2">PT LEAD TRIAGE</h1>
              <p className="body dim" style={{marginTop:10,fontSize:13}}>
                <span style={{color:"#fff"}}>{leads.length}</span> total &nbsp;·&nbsp; <span className="lime">{newCount} unassigned</span>
              </p>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {bookingRequests.filter(r=>r.status==="pending").length>0&&(
                <button className="btn-outline" style={{padding:"12px 20px",fontSize:10,color:"#c1ff72",borderColor:"#c1ff72"}} onClick={()=>setView("bookings")}>
                  BOOKING REQUESTS <span style={{background:"#c1ff72",color:"#000",padding:"2px 6px",marginLeft:6,fontFamily:"'Horizon',monospace",fontSize:9}}>{bookingRequests.filter(r=>r.status==="pending").length}</span>
                </button>
              )}
              <button className="btn-red" style={{width:"auto",padding:"12px 24px",fontSize:10}} onClick={()=>{setView("member");setStep(0);setNameStep(false);setAnswers({name:"",email:"",dob:"",gender:"",goal:[],goal_detail:"",freq:"",injuries:"",pt_gender_pref:"",anything_else:""});}}>+ NEW LEAD</button>
            </div>
          </div>

          {leadsError && (
            <div style={{padding:"12px 24px",background:"#1a0505",borderBottom:"1px solid #d6242d",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
              <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
                <span className="label red" style={{fontSize:10}}>ERROR</span>
                <span className="body" style={{fontSize:12,color:"#fff"}}>{leadsError}</span>
              </div>
              <button className="btn-outline" style={{padding:"6px 14px",fontSize:9}} onClick={()=>{setLeadsError("");loadLeads();}}>RETRY</button>
            </div>
          )}

          <div style={{display:"flex",height:"calc(100vh - 195px)"}}>
            {/* Lead list */}
            <div style={{width:292,borderRight:"1px solid #111",display:"flex",flexDirection:"column",flexShrink:0}}>
              <div style={{padding:"10px 16px",borderBottom:"1px solid #111",display:"flex",gap:6,flexWrap:"wrap"}}>
                {["new","assigned","contacted"].map(s=>{const c=STATUS[s];return(
                  <span key={s} className="pill" style={{color:c.color,borderColor:c.color+"44",fontSize:8,cursor:"pointer"}}>{c.label}</span>
                );})}
              </div>
              <div style={{overflowY:"auto",flex:1}}>
                {leadsLoading && (
                  <p className="label dim" style={{padding:"20px 16px",fontSize:9}}>Loading leads…</p>
                )}
                {!leadsLoading && leads.length === 0 && (
                  <p className="label dim" style={{padding:"20px 16px",fontSize:9}}>No leads yet</p>
                )}
                {leads.map(lead=>{
                  const pt=PT_ROSTER.find(p=>p.id===lead.assignedPT); const cfg=STATUS[lead.status]||STATUS.new;
                  return(
                    <div key={lead.id} className={`lead-row ${selected?.id===lead.id?"active":""}`} onClick={()=>setSelected(leads.find(l=>l.id===lead.id))}>
                      <div className="av" style={{width:34,height:34,background:lead.status==="new"?"#c1ff72":"#1a1a1a",color:lead.status==="new"?"#000":"#555",fontSize:12}}>{lead.name.charAt(0)}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span className="lead-name">{lead.name}</span>
                          {lead.status==="new"&&<div style={{width:5,height:5,background:"#c1ff72",borderRadius:"50%"}}/>}
                        </div>
                        <div className="label" style={{fontSize:9,color:"#444",marginTop:2}}>{goalLabel(lead.goal)}{pt?` · ${pt.name}`:""}</div>
                      </div>
                      <span className="label" style={{fontSize:8,color:cfg.color}}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lead detail */}
            {selected?(()=>{
              const lead=leads.find(l=>l.id===selected.id)||selected;
              const matches=matchPTs(lead); const apt=PT_ROSTER.find(p=>p.id===lead.assignedPT); const cfg=STATUS[lead.status]||STATUS.new;
              return(
                <div key={lead.id} style={{flex:1,overflowY:"auto",padding:"28px 28px"}} className="fade-up">
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,paddingBottom:20,borderBottom:"1px solid #111"}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div className="av" style={{width:52,height:52,background:"#1a1a1a",color:"#fff",fontSize:16}}>{lead.name.charAt(0)}</div>
                      <div>
                        <h2 className="h3" style={{fontSize:20}}>{lead.name}</h2>
                        <p className="label dim" style={{fontSize:9,marginTop:4}}>{fmtSubmittedAt(lead.submittedAt)}</p>
                      </div>
                    </div>
                    <select value={lead.status} onChange={e=>updateStatus(lead.id,e.target.value)}>
                      {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>

                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
                    {[goalLabel(lead.goal),FREQ_LABELS[lead.freq],leadHasInjury(lead.injuries)?"⚠ INJURY/REHAB":null].filter(Boolean).map(t=>(
                      <span key={t} className="pill" style={{color:t.includes("⚠")?"#d6242d":"#444",borderColor:t.includes("⚠")?"#d6242d":"#222",fontSize:8}}>{t}</span>
                    ))}
                  </div>

                  {apt&&(
                    <div style={{background:"#050f00",border:"1px solid #c1ff7244",padding:"14px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
                      <div className="av" style={{width:40,height:40,background:"#c1ff72",color:"#000",fontSize:13}}>{apt.initials}</div>
                      <div style={{flex:1}}>
                        <p className="label" style={{fontSize:9,color:"#c1ff72",marginBottom:3}}>ASSIGNED TO</p>
                        <p style={{fontFamily:"'Horizon',monospace",fontSize:15,letterSpacing:"0.04em",textTransform:"uppercase"}}>{apt.name} <span style={{fontFamily:"'Courier Prime',monospace",color:"#555",fontSize:11,textTransform:"none",letterSpacing:0}}>— {apt.role}</span></p>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                        <div style={{display:"flex",gap:8}}>
                          <button
                            className="btn-ghost"
                            disabled={briefState.sending}
                            onClick={()=>sendBrief(lead)}
                          >
                            {briefState.sending ? "SENDING…" : "SEND BRIEF"}
                          </button>
                          <button
                            className={`btn-outline ${lead.status==="contacted"?"assigned":""}`}
                            style={{padding:"8px 14px",fontSize:9,borderColor:lead.status==="contacted"?"#c1ff72":"#c1ff72",color:"#c1ff72"}}
                            disabled={lead.status==="contacted"}
                            onClick={()=>logContact(lead.id)}
                          >
                            {lead.status==="contacted" ? "CONTACTED ✓" : "LOG CONTACT"}
                          </button>
                        </div>
                        {briefState.message && selected?.id===lead.id && (
                          <p className="label lime" style={{fontSize:8}}>{briefState.message}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{marginBottom:24}}>
                    <p className="section-label">{apt?"MATCHED COACHES":"⚡ SUGGESTED MATCHES — ASSIGN NOW"}</p>
                    {matches.map((pt,i)=>(
                      <div key={pt.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #111"}}>
                        <div className="av" style={{width:38,height:38,background:i===0?"#c1ff72":"#1a1a1a",color:i===0?"#000":"#555",fontSize:12}}>{pt.initials}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                            <span style={{fontFamily:"'Horizon',monospace",fontSize:16,letterSpacing:"0.04em",textTransform:"uppercase",color:i===0?"#c1ff72":"#fff"}}>{pt.name}</span>
                            {i===0&&<span className="pill" style={{background:"#c1ff72",color:"#000",borderColor:"#c1ff72",fontSize:7}}>BEST FIT</span>}
                            <span className="label dim" style={{marginLeft:"auto",fontSize:8}}>{pt.capacity} SPOTS · £{pt.rate}</span>
                          </div>
                          <p className="label" style={{fontSize:8,color:"#d6242d",marginTop:3}}>{pt.tier} · {pt.role}</p>
                        </div>
                        <button className={`btn-ghost ${lead.assignedPT===pt.id?"assigned":""}`} onClick={()=>assignPT(lead.id,pt.id)}>
                          {lead.assignedPT===pt.id?"ASSIGNED ✓":"ASSIGN"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="section-label">NOTES</p>
                    <textarea defaultValue={lead.notes} placeholder="Add context, flags or follow-up notes..." style={{minHeight:80,lineHeight:1.6,resize:"vertical"}}/>
                  </div>
                </div>
              );
            })():(
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                <p className="h2 dim" style={{fontSize:26}}>SELECT A LEAD</p>
                <p className="label dim" style={{fontSize:9}}>CHOOSE FROM THE PANEL ON THE LEFT</p>
              </div>
            )}

            {/* Roster sidebar */}
            <div style={{width:292,borderLeft:"1px solid #111",padding:"16px 12px",overflowY:"auto",flexShrink:0}}>
              <p className="section-label">PT ROSTER</p>
              {PT_ROSTER.map(pt=>(
                <div key={pt.id} style={{marginBottom:8,padding:"10px",border:"1px solid #111",background:"#050505"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div className="av" style={{width:28,height:28,background:"#1a1a1a",color:"#555",fontSize:10}}>{pt.initials}</div>
                    <div>
                      <p style={{fontFamily:"'Horizon',monospace",fontSize:11,letterSpacing:"0.04em",textTransform:"uppercase"}}>{pt.name}</p>
                      <p className="label" style={{fontSize:8,color:"#d6242d"}}>{pt.tier}</p>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span className="label dim" style={{fontSize:7}}>{pt.capacity} OPEN</span>
                    <div style={{width:32,height:2,background:"#111"}}><div style={{width:`${Math.max(10,(pt.capacity/10)*100)}%`,height:"100%",background:"#d6242d"}}/></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ═══ BOOKING REQUESTS (ADMIN) ═══ */}
      {view==="bookings"&&mode==="admin"&&(
        <div className="fade-up">
          <div style={{padding:"40px 24px 28px",borderBottom:"1px solid #1a1a1a",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
            <div>
              <p className="label" style={{marginBottom:10,color:"#c1ff72"}}>Admin</p>
              <h1 className="h2">BOOKING REQUESTS</h1>
              <p className="body dim" style={{marginTop:10,fontSize:13}}>
                <span className="lime">{bookingRequests.filter(r=>r.status==="pending").length} pending</span>
                &nbsp;·&nbsp; {bookingRequests.length} total
              </p>
            </div>
            <button className="btn-outline" style={{padding:"10px 20px",fontSize:10}} onClick={()=>setView("admin")}>← LEAD TRIAGE</button>
          </div>
          <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px"}}>
            {bookingRequests.length===0 ? (
              <p className="body dim" style={{fontSize:13}}>No booking requests yet.</p>
            ) : bookingRequests.map(req=>(
              <div key={req.id} style={{border:`1px solid ${req.status==="pending"?"#333":"#1a1a1a"}`,padding:"20px",marginBottom:10,display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:220}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                    <span className="label" style={{color:"#fff",fontSize:11}}>{req.memberName||"Member"}</span>
                    <span className="pill" style={{color:req.status==="pending"?"#c1ff72":"#555",borderColor:req.status==="pending"?"#c1ff72":"#333",fontSize:8}}>{req.status.toUpperCase()}</span>
                  </div>
                  <p className="body dim" style={{fontSize:12,marginBottom:4}}>{req.memberEmail}</p>
                  <p className="label" style={{fontSize:10,color:"#fff",marginBottom:2}}>PT: {req.pt.name}</p>
                  <p className="body dim" style={{fontSize:12}}>{req.label||"Time TBC"}</p>
                  <p className="label dim" style={{fontSize:8,marginTop:8}}>Requested: {req.requestedAt}</p>
                </div>
                {req.status==="pending"&&(
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button className="btn-red" style={{padding:"8px 16px",fontSize:9,width:"auto"}}
                      onClick={()=>setBookingRequests(r=>r.map(x=>x.id===req.id?{...x,status:"approved"}:x))}>
                      APPROVE
                    </button>
                    <button className="btn-outline" style={{padding:"8px 16px",fontSize:9}}
                      onClick={()=>setBookingRequests(r=>r.map(x=>x.id===req.id?{...x,status:"declined"}:x))}>
                      DECLINE
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ═══ BOOKING VIEW ═══ */}
      {view==="booking"&&bookingPT&&(
        <div className="fade-up">
          {/* Header */}
          <div style={{padding:"52px 24px 36px",borderBottom:"1px solid #1a1a1a"}}>
            <div style={{maxWidth:680,margin:"0 auto"}}>
              <p className="label lime" style={{marginBottom:14}}>REQUEST INTRO SESSION</p>
              <h1 className="h1">{bookingPT.name}</h1>
              <p className="body dim" style={{marginTop:14}}>{bookingPT.role}</p>
            </div>
          </div>

          {!bookingConfirmed ? (
            <div style={{maxWidth:640,margin:"0 auto",padding:"44px 24px"}}>
              <div style={{padding:"28px",border:"1px solid #333",marginBottom:24}}>
                <p className="body dim" style={{fontSize:13}}>
                  Confirm your request for an intro session with {bookingPT.name}. The team will be in touch within 24–48 hours to arrange a time.
                </p>
                <button className="btn-red" style={{marginTop:20}} onClick={()=>{
                  setBookingRequests(r=>[...r,{id:r.length+1,memberName:answers.name,memberEmail:answers.email,pt:bookingPT,status:"pending",requestedAt:new Date().toLocaleString()}]);
                  setBookingConfirmed(true);
                }}>CONFIRM REQUEST →</button>
              </div>
              <button className="btn-outline" style={{marginTop:16,width:"auto",padding:"10px 20px"}} onClick={()=>setView("result")}>← BACK TO RESULTS</button>
            </div>
          ) : (
            /* Confirmation screen */
            <div style={{maxWidth:640,margin:"0 auto",padding:"44px 24px"}}>
              <div style={{padding:"28px",border:"1px solid #c1ff72",background:"#050f00",marginBottom:24}}>
                <p className="label lime" style={{marginBottom:10}}>REQUEST SENT</p>
                <p className="body" style={{fontSize:14,marginBottom:8}}>
                  <span style={{color:"#fff",fontFamily:"'Horizon',monospace",fontSize:12,letterSpacing:"0.08em"}}>{bookingPT.name}</span>
                </p>
                <p className="body dim" style={{fontSize:13}}>
                  Your request is pending confirmation. We&apos;ll be in touch within 24–48 hours to arrange a time for your intro session.
                </p>
              </div>
              <button className="btn-outline" style={{width:"auto",padding:"10px 20px"}} onClick={()=>{setView("member");setStep(0);setNameStep(false);setAnswers({name:"",email:"",dob:"",gender:"",goal:[],goal_detail:"",freq:"",injuries:"",pt_gender_pref:"",anything_else:""});}}>START AGAIN</button>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div style={{borderTop:"1px solid #111",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:24}}>
        <p className="label dim" style={{fontSize:9}}>IMPERIAL WHARF, THE BOULEVARD, LONDON SW6 2UB</p>
        <p className="label dim" style={{fontSize:9}}>ALL RIGHTS RESERVED © 2026 ONE LDN</p>
      </div>
    </div>
  );
}
