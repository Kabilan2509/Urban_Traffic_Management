"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ─── GLOBAL STYLES ──────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --navy:   #0D2B5E;
  --navy2:  #1A4490;
  --navy3:  #1e3a8a;
  --red:    #8B1A1A;
  --gold:   #B8860B;
  --gold2:  #D4A017;
  --green:  #15803D;
  --yellow: #B45309;
  --danger: #B91C1C;
  --bg:     #F7F7F5;
  --white:  #FFFFFF;
  --grey1:  #F1F0EC;
  --grey2:  #E4E2DA;
  --grey3:  #9CA3AF;
  --text:   #111827;
  --text2:  #374151;
  --text3:  #6B7280;
  --border: #D9D6CF;
  --shadow: 0 1px 3px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.05);
  --shadow2:0 4px 16px rgba(0,0,0,0.10);
  --font-h: 'Source Serif 4', Georgia, serif;
  --font-b: 'DM Sans', sans-serif;
  --font-m: 'JetBrains Mono', monospace;
}
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior: smooth; }
body { background:var(--bg); color:var(--text); font-family:var(--font-b); font-size:14px; line-height:1.6; }
button,input,select,textarea { font-family:inherit; }
::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-track { background:var(--grey1); }
::-webkit-scrollbar-thumb { background:var(--navy2); border-radius:4px; }

/* ── TOP STRIPE ─────────────────────────────────────────────────────────── */
.top-stripe {
  background: repeating-linear-gradient(90deg,
    var(--red) 0px, var(--red) 6px,
    var(--gold2) 6px, var(--gold2) 12px,
    var(--navy) 12px, var(--navy) 18px);
  height: 6px;
}

/* ── GOV HEADER ─────────────────────────────────────────────────────────── */
.gov-header {
  background: var(--navy);
  padding: 0 32px;
  display: flex;
  align-items: stretch;
  border-bottom: 3px solid var(--gold2);
  position: sticky; top: 0; z-index: 200;
  box-shadow: 0 2px 12px rgba(0,0,0,0.25);
}
.gov-logo-zone {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 0;
  border-right: 1px solid rgba(255,255,255,0.12);
  padding-right: 22px; margin-right: 20px;
}
.gov-emblem {
  width: 52px; height: 52px;
  background: conic-gradient(from 0deg, var(--gold2), var(--gold), var(--gold2) 60%, #fff8e1 100%);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
  box-shadow: 0 0 0 3px rgba(212,160,23,0.3), 0 2px 10px rgba(0,0,0,0.3);
  flex-shrink: 0;
}
.gov-brand { flex:1; }
.gov-dept {
  font-size: 10px; font-weight: 600;
  color: var(--gold2);
  letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 1px;
}
.gov-title {
  font-family: var(--font-h);
  font-size: 17px; font-weight: 700;
  color: #fff; line-height: 1.2;
}
.gov-sub { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 1px; }

.gov-header-right {
  margin-left: auto;
  display: flex; align-items: center; gap: 20px;
}
.sys-live {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 600;
  color: #4ADE80;
  background: rgba(74,222,128,0.1);
  padding: 4px 10px; border-radius: 20px;
  border: 1px solid rgba(74,222,128,0.25);
}
.sys-dot { width:7px; height:7px; border-radius:50%; background:#4ADE80; animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.9)} }
.gov-clock { font-family:var(--font-m); font-size:12px; color:rgba(255,255,255,0.5); }
.logout-btn {
  padding: 7px 16px;
  background: rgba(139,26,26,0.5);
  border: 1px solid rgba(212,160,23,0.4);
  color: #fff; border-radius: 4px; cursor:pointer;
  font-size: 12px; font-weight: 600;
  transition: background .2s;
}
.logout-btn:hover { background: var(--red); }

/* ── NAV BAR ────────────────────────────────────────────────────────────── */
.nav-bar {
  background: var(--white);
  border-bottom: 2px solid var(--border);
  padding: 0 32px;
  display: flex; align-items: center;
  box-shadow: var(--shadow);
  position: sticky; top: 72px; z-index: 100;
  overflow-x: auto;
}
.nav-item {
  padding: 13px 16px;
  border: none; background: none;
  font-size: 13px; font-weight: 600;
  color: var(--text3); cursor: pointer;
  display: flex; align-items: center; gap: 7px;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all .2s; white-space: nowrap;
}
.nav-item:hover { color: var(--navy2); background: var(--grey1); }
.nav-item.active { color: var(--navy); border-bottom-color: var(--navy2); }
.nav-badge {
  font-size: 10px; font-weight: 700;
  background: var(--red); color: #fff;
  padding: 1px 6px; border-radius: 20px;
}
.nav-user {
  margin-left: auto; display:flex; align-items:center; gap:10px;
  padding-left: 16px; flex-shrink:0;
  font-size:12px; color:var(--text3);
}
.user-chip {
  display:flex; align-items:center; gap:8px;
  background:var(--grey1); border:1px solid var(--border);
  padding:4px 12px 4px 6px; border-radius:20px;
}
.user-avatar {
  width:26px; height:26px; border-radius:50%;
  background:var(--navy); color:#fff;
  display:flex; align-items:center; justify-content:center;
  font-size:11px; font-weight:700;
}
.role-tag {
  font-size:10px; font-weight:700;
  color:var(--navy2); text-transform:uppercase;
  letter-spacing:.06em;
}

/* ── PAGE SHELL ─────────────────────────────────────────────────────────── */
.page-wrap { padding: 28px 32px; max-width: 1440px; margin: 0 auto; min-height:calc(100vh - 160px); }
.breadcrumb { font-size:11px; color:var(--text3); margin-bottom:6px; font-family:var(--font-m); }
.breadcrumb span { color:var(--navy2); }
.page-hd { margin-bottom:22px; padding-bottom:16px; border-bottom:2px solid var(--border); display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:12px; }
.page-hd-l h2 { font-family:var(--font-h); font-size:22px; font-weight:700; color:var(--navy); display:flex; align-items:center; gap:10px; }
.page-hd-l p { color:var(--text3); font-size:13px; margin-top:3px; }

/* ── CARD ───────────────────────────────────────────────────────────────── */
.card { background:var(--white); border:1px solid var(--border); border-radius:8px; box-shadow:var(--shadow); }
.card-head { padding:13px 18px; border-bottom:1px solid var(--grey2); display:flex; align-items:center; justify-content:space-between; }
.card-head h3 { font-family:var(--font-h); font-size:14px; font-weight:700; color:var(--navy); }
.card-body { padding:18px; }

/* ── KPI GRID ───────────────────────────────────────────────────────────── */
.kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:22px; }
.kpi { background:var(--white); border:1px solid var(--border); border-radius:8px; padding:18px 20px; border-left:4px solid; box-shadow:var(--shadow); display:flex; flex-direction:column; gap:4px; }
.kpi-lbl { font-size:10px; text-transform:uppercase; letter-spacing:.1em; color:var(--text3); font-weight:700; }
.kpi-val { font-family:var(--font-h); font-size:32px; font-weight:700; line-height:1; }
.kpi-sub { font-size:11px; color:var(--text3); margin-top:2px; }
.kpi-trend-up { color:var(--green); font-weight:600; }
.kpi-trend-dn { color:var(--danger); font-weight:600; }

/* ── BADGE ──────────────────────────────────────────────────────────────── */
.badge { display:inline-flex; align-items:center; gap:4px; padding:2px 9px; border-radius:4px; font-size:11px; font-weight:700; border:1px solid; white-space:nowrap; letter-spacing:.02em; }
.bg  { background:#F0FDF4; color:#15803D; border-color:#BBF7D0; }
.by  { background:#FFFBEB; color:#B45309; border-color:#FDE68A; }
.br  { background:#FEF2F2; color:#B91C1C; border-color:#FECACA; }
.bb  { background:#EFF6FF; color:#1D4ED8; border-color:#BFDBFE; }
.bk  { background:#F9FAFB; color:#6B7280; border-color:#E5E7EB; }

/* ── BUTTON ─────────────────────────────────────────────────────────────── */
.btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:5px; font-size:13px; font-weight:600; cursor:pointer; border:1.5px solid; transition:all .2s; white-space:nowrap; }
.btn-navy { background:var(--navy); color:#fff; border-color:var(--navy); }
.btn-navy:hover { background:var(--navy2); }
.btn-red { background:var(--red); color:#fff; border-color:var(--red); }
.btn-outline { background:transparent; color:var(--navy); border-color:var(--border); }
.btn-outline:hover { background:var(--grey1); }
.btn-sm { padding:5px 12px; font-size:12px; }
.btn:disabled { opacity:.45; cursor:not-allowed; }

/* ── TABLE ──────────────────────────────────────────────────────────────── */
.tbl-wrap { overflow-x:auto; border-radius:8px; border:1px solid var(--border); }
table { width:100%; border-collapse:collapse; font-size:13px; }
thead th { background:var(--navy); color:#fff; padding:11px 14px; text-align:left; font-size:11px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; white-space:nowrap; }
tbody tr { border-bottom:1px solid var(--grey2); transition:background .15s; }
tbody tr:last-child { border-bottom:none; }
tbody tr:hover { background:var(--grey1); }
tbody td { padding:11px 14px; vertical-align:middle; }
.mono { font-family:var(--font-m); font-size:12px; }

/* ── FORM ───────────────────────────────────────────────────────────────── */
.form-group { margin-bottom:18px; }
.form-label { display:block; font-size:13px; font-weight:600; color:var(--navy); margin-bottom:5px; }
.form-input {
  width:100%; padding:10px 14px;
  border:1.5px solid var(--border); border-radius:5px;
  font-size:14px; background:var(--white); color:var(--text);
  transition:border-color .2s, box-shadow .2s; outline:none;
}
.form-input:focus { border-color:var(--navy2); box-shadow:0 0 0 3px rgba(26,68,144,0.1); }
.form-select { width:100%; padding:10px 14px; border:1.5px solid var(--border); border-radius:5px; font-size:14px; background:var(--white); color:var(--text); outline:none; cursor:pointer; }
.form-select:focus { border-color:var(--navy2); }

/* ── ALERT ──────────────────────────────────────────────────────────────── */
.alert { padding:11px 15px; border-radius:6px; border-left:4px solid; font-size:13px; margin-bottom:14px; }
.alert-warn  { background:#FFFBEB; border-color:#D97706; color:#92400E; }
.alert-err   { background:#FEF2F2; border-color:#DC2626; color:#991B1B; }
.alert-info  { background:#EFF6FF; border-color:#1D4ED8; color:#1E40AF; }
.alert-ok    { background:#F0FDF4; border-color:#16A34A; color:#166534; }

/* ── DENSITY BAR ────────────────────────────────────────────────────────── */
.dbar { display:flex; align-items:center; gap:8px; }
.dbar-track { flex:1; background:var(--grey2); border-radius:4px; height:8px; }
.dbar-fill { height:100%; border-radius:4px; transition:width .5s; }

/* ── TRAFFIC LIGHT ──────────────────────────────────────────────────────── */
.tl { width:38px; height:94px; background:#111; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:space-evenly; padding:6px; border:2px solid #222; }
.tl-b { width:22px; height:22px; border-radius:50%; transition:all .5s; }
.tl-r { background:#2a0a0a; } .tl-r.on { background:#EF4444; box-shadow:0 0 16px #EF4444; }
.tl-y { background:#251800; } .tl-y.on { background:#F59E0B; box-shadow:0 0 14px #F59E0B; }
.tl-g { background:#0a1f0a; } .tl-g.on { background:#22C55E; box-shadow:0 0 16px #22C55E; }

/* ── MAP ────────────────────────────────────────────────────────────────── */
#traffix-map { height:400px; border-radius:8px; border:1px solid var(--border); z-index:1; }
.leaflet-container { border-radius:8px; }

/* ── LOGIN PAGE ─────────────────────────────────────────────────────────── */
.login-page {
  min-height:100vh;
  background: linear-gradient(135deg, #0D2B5E 0%, #1A4490 50%, #0D2B5E 100%);
  display:flex; flex-direction:column;
  position:relative; overflow:hidden;
}
.login-bg-pattern {
  position:absolute; inset:0;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px),
                    repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px);
  pointer-events:none;
}
.login-body { flex:1; display:flex; align-items:center; justify-content:center; padding:40px 20px; }
.login-card {
  background:var(--white); border-radius:12px;
  box-shadow:0 24px 60px rgba(0,0,0,0.35);
  width:100%; max-width:460px; overflow:hidden;
  position:relative; z-index:1;
}
.login-top {
  background:var(--navy);
  padding:30px 32px 24px; text-align:center;
  border-bottom:4px solid var(--gold2);
  position:relative;
}
.login-top::after {
  content:''; position:absolute; bottom:-4px; left:0; right:0; height:4px;
  background: linear-gradient(90deg, var(--red), var(--gold2), var(--red));
}
.login-body-inner { padding:30px 32px; }
.login-footer { background:var(--grey1); text-align:center; padding:12px; font-size:11px; color:var(--text3); border-top:1px solid var(--grey2); }
.password-wrap { position:relative; }
.password-wrap input { padding-right:44px; }
.eye-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:16px; color:var(--text3); }
.cred-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.cred-pill {
  background:var(--grey1); border:1px solid var(--border);
  border-radius:6px; padding:8px 12px; cursor:pointer;
  transition:all .2s; text-align:left;
}
.cred-pill:hover { background:var(--grey2); border-color:var(--navy2); }
.cred-pill .role { font-size:10px; font-weight:700; color:var(--navy2); text-transform:uppercase; letter-spacing:.08em; }
.cred-pill .cred { font-family:var(--font-m); font-size:11px; color:var(--text3); margin-top:2px; }

/* ── FOOTER ─────────────────────────────────────────────────────────────── */
.gov-footer {
  background:var(--navy);
  color:rgba(255,255,255,.45);
  padding:16px 32px;
  display:flex; justify-content:space-between; align-items:center;
  flex-wrap:wrap; gap:8px; font-size:11px;
}
.gov-footer a { color:var(--gold2); text-decoration:none; }

/* ── SIGNAL CARDS GRID ──────────────────────────────────────────────────── */
.signal-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }
.signal-card { background:var(--white); border:1px solid var(--border); border-radius:8px; padding:16px 14px; text-align:center; cursor:pointer; border-top:3px solid; transition:box-shadow .2s; }
.signal-card:hover { box-shadow:var(--shadow2); }
.signal-card.selected { box-shadow:0 0 0 2px var(--navy); }

/* ── SECTION DIVIDER ────────────────────────────────────────────────────── */
.part-banner {
  background:var(--navy);
  color:#fff; font-family:var(--font-h);
  font-size:13px; font-weight:700;
  padding:10px 18px; border-radius:6px;
  display:flex; align-items:center; gap:8px;
  letter-spacing:.04em; margin-bottom:16px;
  border-left:4px solid var(--gold2);
}

/* ── SEARCH BAR ─────────────────────────────────────────────────────────── */
.search-wrap { position:relative; }
.search-wrap input { padding-left:36px; }
.search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text3); font-size:13px; pointer-events:none; }

/* ── TOGGLE ─────────────────────────────────────────────────────────────── */
.toggle { width:42px; height:24px; background:var(--grey2); border-radius:12px; position:relative; cursor:pointer; transition:background .2s; border:none; flex-shrink:0; }
.toggle.on { background:var(--navy); }
.toggle::after { content:''; position:absolute; width:18px; height:18px; background:#fff; border-radius:50%; top:3px; left:3px; transition:transform .2s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
.toggle.on::after { transform:translateX(18px); }

/* ── RANGE SLIDER ───────────────────────────────────────────────────────── */
input[type=range] { -webkit-appearance:none; width:100%; height:5px; border-radius:4px; background:var(--grey2); outline:none; cursor:pointer; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:var(--navy); cursor:pointer; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.2); }
input[type=checkbox] { accent-color:var(--navy); width:15px; height:15px; cursor:pointer; }

/* ── CUSTOM TOOLTIP ─────────────────────────────────────────────────────── */
.ct-tooltip { background:var(--navy); border:1px solid rgba(255,255,255,.15); border-radius:6px; padding:10px 14px; font-size:12px; color:#fff; }
.ct-label { color:rgba(255,255,255,.6); font-size:11px; margin-bottom:4px; }
.ct-value { font-family:var(--font-m); font-size:14px; font-weight:600; }

@media(max-width:900px){
  .kpi-grid { grid-template-columns:repeat(2,1fr); }
  .signal-grid { grid-template-columns:repeat(2,1fr); }
  .page-wrap { padding:16px; }
  .gov-header { padding:0 16px; }
}
`;

/* ─── MOCK DATA ──────────────────────────────────────────────────────────── */
const JUNCTIONS = [
  { id:"J-001", name:"Anna Salai – Mount Road",      lat:13.0604, lng:80.2496, congestion:"Red",    phase:"Red",    density:82, vehicles:342, delay:8.2 },
  { id:"J-002", name:"Koyambedu Interchange",         lat:13.0713, lng:80.1946, congestion:"Yellow", phase:"Green",  density:65, vehicles:210, delay:4.5 },
  { id:"J-003", name:"T. Nagar – Usman Road",         lat:13.0418, lng:80.2341, congestion:"Red",    phase:"Red",    density:90, vehicles:401, delay:11.3 },
  { id:"J-004", name:"Vadapalani Junction",            lat:13.0528, lng:80.2121, congestion:"Green",  phase:"Green",  density:48, vehicles:145, delay:2.1 },
  { id:"J-005", name:"Guindy Industrial Estate",       lat:13.0069, lng:80.2206, congestion:"Yellow", phase:"Yellow", density:55, vehicles:178, delay:3.8 },
  { id:"J-006", name:"Adyar Signal",                   lat:13.0012, lng:80.2565, congestion:"Green",  phase:"Green",  density:38, vehicles:112, delay:1.5 },
  { id:"J-007", name:"Egmore – NSC Bose Road",         lat:13.0732, lng:80.2609, congestion:"Yellow", phase:"Yellow", density:74, vehicles:263, delay:5.9 },
  { id:"J-008", name:"Tambaram Bypass",                lat:12.9249, lng:80.1000, congestion:"Green",  phase:"Green",  density:30, vehicles:90,  delay:1.2 },
];

const HOURLY = [
  {h:"00",density:22,vehicles:65,  prediction:20},
  {h:"04",density:15,vehicles:40,  prediction:17},
  {h:"06",density:48,vehicles:150, prediction:52},
  {h:"08",density:88,vehicles:380, prediction:85},
  {h:"10",density:72,vehicles:260, prediction:74},
  {h:"12",density:66,vehicles:220, prediction:68},
  {h:"14",density:60,vehicles:195, prediction:62},
  {h:"16",density:85,vehicles:350, prediction:88},
  {h:"18",density:92,vehicles:410, prediction:90},
  {h:"20",density:70,vehicles:240, prediction:72},
  {h:"22",density:45,vehicles:130, prediction:43},
];

const WEEKLY = [
  {day:"Mon",avg:72,peak:92},{day:"Tue",avg:68,peak:88},
  {day:"Wed",avg:75,peak:94},{day:"Thu",avg:78,peak:96},
  {day:"Fri",avg:82,peak:98},{day:"Sat",avg:55,peak:72},
  {day:"Sun",avg:40,peak:58},
];

const PIE_DATA = [
  {name:"Low (<50%)",   value:3, color:"#15803D"},
  {name:"Moderate",     value:2, color:"#B45309"},
  {name:"High (>75%)",  value:3, color:"#B91C1C"},
];

const LOGS = [
  {id:"EVT-8841",time:"10:45:22",type:"AI Optimisation",   junction:"Anna Salai (J-001)", details:"N-S phase extended +15s. Surge detected.",       status:"Success"},
  {id:"EVT-8840",time:"10:12:05",type:"Manual Override",   junction:"Egmore (J-007)",     details:"All-red phase for VIP convoy. Operator request.", status:"Warning"},
  {id:"EVT-8839",time:"09:30:00",type:"System Event",      junction:"Network Wide",        details:"ML model weights updated and deployed.",          status:"Success"},
  {id:"EVT-8838",time:"08:15:44",type:"Sensor Alert",      junction:"T. Nagar (J-003)",   details:"E-bound camera occlusion. Confidence <40%.",      status:"Error"},
  {id:"EVT-8837",time:"07:00:00",type:"Peak Transition",   junction:"Network Wide",        details:"Mode switched to Morning Rush Hour.",             status:"Success"},
  {id:"EVT-8836",time:"06:30:10",type:"AI Optimisation",   junction:"Vadapalani (J-004)", details:"Off-peak compression -20s applied.",             status:"Success"},
  {id:"EVT-8835",time:"18:45:00",type:"Emergency Override", junction:"Guindy (J-005)",    details:"Ambulance corridor cleared. ETA 6 min.",          status:"Success"},
];

const USERS = [
  {id:"USR-001",name:"Kabil R",       role:"Super Admin",         zone:"Central Command",     status:"Active",    last:"Today 09:12"},
  {id:"USR-002",name:"Anitha Sharma", role:"Traffic Engineer",    zone:"Chennai North",       status:"Active",    last:"Today 08:45"},
  {id:"USR-003",name:"Rahul Menon",   role:"Traffic Operator",    zone:"Chennai South",       status:"Active",    last:"Today 07:30"},
  {id:"USR-004",name:"Priya Nair",    role:"Emergency Authority", zone:"Rapid Response Unit", status:"Suspended", last:"2026-03-05"},
  {id:"USR-005",name:"Suresh Kumar",  role:"Traffic Engineer",    zone:"Chennai West",        status:"Active",    last:"Today 10:01"},
];

const CREDS = {
  admin:     {role:"Super Admin",         name:"Kabil R"},
  engineer:  {role:"Traffic Engineer",    name:"Anitha Sharma"},
  operator:  {role:"Traffic Operator",    name:"Rahul Menon"},
  emergency: {role:"Emergency Authority", name:"Priya Nair"},
};

const ALL_TABS = [
  {id:"dashboard", label:"Dashboard", icon:"◎", roles:["Super Admin","Traffic Engineer","Traffic Operator","Emergency Authority"]},
  {id:"map",       label:"Live Map",  icon:"🗺", roles:["Super Admin","Traffic Engineer","Traffic Operator","Emergency Authority"]},
  {id:"analytics", label:"Analytics", icon:"📊", roles:["Super Admin","Traffic Engineer"]},
  {id:"signals",   label:"Signals",   icon:"🚦", roles:["Super Admin","Traffic Engineer","Traffic Operator"]},
  {id:"emergency", label:"Emergency", icon:"🚨", roles:["Super Admin","Emergency Authority"]},
  {id:"history",   label:"History",   icon:"📋", roles:["Super Admin","Traffic Engineer"]},
  {id:"users",     label:"Users",     icon:"👥", roles:["Super Admin"]},
  {id:"settings",  label:"Settings",  icon:"⚙", roles:["Super Admin"]},
];

let leafletLoader;

/* ─── SMALL HELPERS ──────────────────────────────────────────────────────── */
function Clock() {
  const [t, setT] = useState(null);

  useEffect(() => {
    setT(new Date());
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  if (!t) return null;

  return (
    <span className="gov-clock">
      {t.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "medium"
      })}
    </span>
  );
}

function Badge({type}) {
  const m = {
    Red:"br", Yellow:"by", Green:"bg",
    Success:"bg", Warning:"by", Error:"br",
    Active:"bg", Suspended:"br",
    "Super Admin":"br", "Traffic Engineer":"bb",
    "Traffic Operator":"bg", "Emergency Authority":"by",
  };
  return <span className={`badge ${m[type]||"bk"}`}>{type}</span>;
}

function DBar({value}) {
  const c = value>75?"#B91C1C":value>50?"#B45309":"#15803D";
  return (
    <div className="dbar">
      <div className="dbar-track" style={{flex:1}}>
        <div className="dbar-fill" style={{width:`${value}%`,background:c}}/>
      </div>
      <span className="mono" style={{width:34,textAlign:"right",color:c,fontWeight:600}}>{value}%</span>
    </div>
  );
}

const ChartTip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return (
    <div className="ct-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,fontFamily:"var(--font-m)",fontSize:12}}>
          {p.name}: <strong>{p.value}{p.name?.toLowerCase().includes("density")||p.name?.toLowerCase().includes("prediction")? "%":""}
          </strong>
        </div>
      ))}
    </div>
  );
};

/* ─── GOV HEADER ─────────────────────────────────────────────────────────── */
function GovHeader({user, onLogout}) {
  return (
    <>
      <div className="top-stripe"/>
      <header className="gov-header">
        <div className="gov-logo-zone">
          <div className="gov-emblem">🚦</div>
          <div className="gov-brand">
            <div className="gov-dept">Tamil Nadu · Highways &amp; Traffic Engineering</div>
            <div className="gov-title">Traffix — Smart Traffic Management</div>
            <div className="gov-sub">Chennai Metropolitan Area Control Centre</div>
          </div>
        </div>
        <div className="gov-header-right">
          <div className="sys-live"><div className="sys-dot"/>LIVE</div>
          <Clock/>
          {user && (
            <button className="logout-btn" onClick={onLogout}>🔓 Logout</button>
          )}
        </div>
      </header>
    </>
  );
}

/* ─── NAV BAR ────────────────────────────────────────────────────────────── */
function NavBar({tab, setTab, user}) {
  const tabs = ALL_TABS.filter(t=>t.roles.includes(user.role));
  const initials = user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return (
    <nav className="nav-bar">
      {tabs.map(t=>(
        <button key={t.id}
          className={`nav-item${tab===t.id?" active":""}`}
          onClick={()=>setTab(t.id)}>
          <span>{t.icon}</span>
          {t.label}
          {t.id==="emergency" && <span className="nav-badge">!</span>}
        </button>
      ))}
      <div className="nav-user">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div>
            <div style={{fontWeight:600,color:"var(--text)",fontSize:12}}>{user.name}</div>
            <div className="role-tag">{user.role}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─── LOGIN PAGE ─────────────────────────────────────────────────────────── */
function LoginPage({onLogin}) {
  const [u,setU]=useState(""); const [p,setP]=useState("");
  const [show,setShow]=useState(false);
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);

  const submit = e=>{
    e.preventDefault(); setErr(""); setLoading(true);
    setTimeout(()=>{
      const cred = CREDS[u.trim().toLowerCase()];
      if(cred && p===u.trim().toLowerCase()){
        const token = btoa(JSON.stringify({sub:u,role:cred.role,iat:Date.now(),exp:Date.now()+3600000}));
        onLogin({username:u, name:cred.name, role:cred.role, token});
      } else {
        setErr("Invalid credentials. Please verify your Authority ID and passkey.");
        setLoading(false);
      }
    },800);
  };

  const fillCred=(id)=>{setU(id);setP(id);};

  return (
    <div className="login-page">
      <div className="login-bg-pattern"/>
      <div className="gov-header" style={{position:"relative",zIndex:1}}>
        <div className="gov-logo-zone">
          <div className="gov-emblem">🚦</div>
          <div className="gov-brand">
            <div className="gov-dept">Tamil Nadu · Highways &amp; Traffic Engineering</div>
            <div className="gov-title">Traffix — Smart Traffic Management</div>
          </div>
        </div>
        <div className="gov-header-right"><Clock/></div>
      </div>
      <div className="login-body">
        <div className="login-card">
          <div className="login-top">
            <div style={{fontSize:42,marginBottom:10}}>🔐</div>
            <h2 style={{fontFamily:"var(--font-h)",fontSize:20,fontWeight:700,color:"#fff",marginBottom:4}}>
              Authorised Personnel Login
            </h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
              Traffix Integrated Traffic Management Portal
            </p>
          </div>
          <div className="login-body-inner">
            <div className="alert alert-info" style={{marginBottom:16,fontSize:12}}>
              🛡️ Restricted to authorised TN Traffic Control personnel only. All access is logged and audited.
            </div>
            {err && <div className="alert alert-err">{err}</div>}
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Authority ID</label>
                <input className="form-input" type="text"
                  placeholder="e.g. admin, engineer, operator"
                  value={u} onChange={e=>setU(e.target.value)} required
                  autoComplete="username"/>
              </div>
              <div className="form-group">
                <label className="form-label">Secure Passkey</label>
                <div className="password-wrap">
                  <input className="form-input"
                    type={show?"text":"password"}
                    placeholder="Enter your passkey"
                    value={p} onChange={e=>setP(e.target.value)} required
                    autoComplete="current-password"/>
                  <button type="button" className="eye-btn" onClick={()=>setShow(s=>!s)}>
                    {show?"🙈":"👁"}
                  </button>
                </div>
              </div>
              <button className="btn btn-navy" type="submit" disabled={loading}
                style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:14}}>
                {loading?"⏳ Authenticating via JWT…":"🔓 Access Traffix Portal"}
              </button>
            </form>

            <div style={{marginTop:20}}>
              <p style={{fontSize:11,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>
                Demo Credentials (ID = Password)
              </p>
              <div className="cred-row">
                {Object.keys(CREDS).map(id=>(
                  <button key={id} className="cred-pill" onClick={()=>fillCred(id)}>
                    <div className="role">{CREDS[id].role}</div>
                    <div className="cred">{id} / {id}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="login-footer">
            Secured with JWT Authentication · IT Act 2000 · Unauthorised access is prosecutable
          </div>
        </div>
      </div>
      <footer className="gov-footer" style={{position:"relative",zIndex:1}}>
        <span>© 2026 Government of Tamil Nadu — Department of Highways &amp; Traffic Engineering</span>
        <span>Traffix v3.2.1 · <a href="#">Privacy</a> · <a href="#">Disclaimer</a></span>
      </footer>
    </div>
  );
}

/* ─── DASHBOARD PAGE ─────────────────────────────────────────────────────── */
function DashboardPage({onNavTo}) {
  const [sel,setSel]=useState(null);
  const heavy=JUNCTIONS.filter(j=>j.congestion==="Red").length;
  const avgDelay=(JUNCTIONS.reduce((a,j)=>a+j.delay,0)/JUNCTIONS.length).toFixed(1);
  const totalVeh=JUNCTIONS.reduce((a,j)=>a+j.vehicles,0);

  const mapPos=[
    {j:JUNCTIONS[3], cx:170, cy:240},
    {j:JUNCTIONS[0], cx:340, cy:150},
    {j:JUNCTIONS[6], cx:340, cy:240},
    {j:JUNCTIONS[5], cx:340, cy:340},
    {j:JUNCTIONS[1], cx:510, cy:150},
    {j:JUNCTIONS[2], cx:510, cy:240},
    {j:JUNCTIONS[4], cx:660, cy:240},
    {j:JUNCTIONS[7], cx:660, cy:340},
  ];
  const dotColor={Red:"#EF4444",Yellow:"#F59E0B",Green:"#22C55E"};

  return (
    <div className="page-wrap">
      <div className="breadcrumb">Home › <span>City Command Centre</span></div>
      <div className="page-hd">
        <div className="page-hd-l">
          <h2>◎ City Command Centre</h2>
          <p>Real-time overview of all active junctions across the Chennai Metropolitan Network.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={()=>onNavTo("map")}>
          🗺 Open Leaflet Map →
        </button>
      </div>

      <div className="kpi-grid">
        {[
          {lbl:"Active Junctions",val:JUNCTIONS.length,color:"var(--navy)",sub:"All operational",trend:""},
          {lbl:"Congested Nodes",val:heavy,color:"#B91C1C",sub:"High density detected",trend:"dn"},
          {lbl:"Avg Network Delay",val:`${avgDelay}m`,color:"#B45309",sub:"vs 5.2m baseline",trend:"up"},
          {lbl:"Vehicles Monitored",val:totalVeh.toLocaleString(),color:"var(--navy2)",sub:"Across all nodes today",trend:""},
        ].map(k=>(
          <div key={k.lbl} className="kpi" style={{borderLeftColor:k.color}}>
            <div className="kpi-lbl">{k.lbl}</div>
            <div className="kpi-val" style={{color:k.color}}>{k.val}</div>
            <div className="kpi-sub">
              {k.trend==="up"&&<span className="kpi-trend-up">▼ Improving · </span>}
              {k.trend==="dn"&&<span className="kpi-trend-dn">▲ Alert · </span>}
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:18}}>
        <div className="card">
          <div className="card-head">
            <h3>📍 Junction Network Schematic — Chennai</h3>
            <div style={{display:"flex",gap:12,fontSize:11}}>
              {[["#22C55E","Low"],["#F59E0B","Moderate"],["#EF4444","High"]].map(([c,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:5,fontWeight:600,color:c}}>
                  <svg width="9" height="9"><circle cx="4.5" cy="4.5" r="4.5" fill={c}/></svg>{l}
                </span>
              ))}
            </div>
          </div>
          <div style={{padding:0,overflow:"hidden",borderRadius:"0 0 8px 8px"}}>
            <svg viewBox="0 0 820 420" style={{width:"100%",background:"#F0EDE5"}}>
              {[150,240,340].map(y=><line key={y} x1="80" y1={y} x2="740" y2={y} stroke="#C8B89A" strokeWidth="6" strokeLinecap="round"/>)}
              {[170,340,510,660].map(x=><line key={x} x1={x} y1="80" x2={x} y2="390" stroke="#C8B89A" strokeWidth="6" strokeLinecap="round"/>)}
              <text x="10" y="154" fontSize="9" fill="#9CA3AF" fontFamily="monospace">ECR</text>
              <text x="10" y="244" fontSize="9" fill="#9CA3AF" fontFamily="monospace">NH-32</text>
              <text x="10" y="344" fontSize="9" fill="#9CA3AF" fontFamily="monospace">OMR</text>
              {mapPos.map(({j,cx,cy})=>{
                const col=dotColor[j.congestion];
                const isSel=sel?.id===j.id;
                return (
                  <g key={j.id} style={{cursor:"pointer"}} onClick={()=>setSel(s=>s?.id===j.id?null:j)}>
                    {j.congestion==="Red"&&<circle cx={cx} cy={cy} r="14" fill={col} opacity="0.25">
                      <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" repeatCount="indefinite"/>
                    </circle>}
                    <circle cx={cx} cy={cy} r={isSel?11:9} fill={col} stroke="#fff" strokeWidth={isSel?3:2}
                      style={{filter:`drop-shadow(0 0 ${j.congestion==="Red"?8:4}px ${col})`}}/>
                    <text x={cx} y={cy+22} textAnchor="middle" fontSize="8" fill="#5A5450"
                      fontFamily="monospace" style={{pointerEvents:"none"}}>
                      {j.name.split("–")[0].split(" ").slice(0,2).join(" ")}
                    </text>
                  </g>
                );
              })}
              <text x="10" y="15" fontSize="10" fill="#9CA3AF" fontFamily="monospace">Chennai Metropolitan Area</text>
            </svg>
          </div>
        </div>

        <div className="card" style={{display:"flex",flexDirection:"column"}}>
          <div className="card-head">
            <h3>{sel?"📊 Detail":"📋 Junctions"}</h3>
            {sel&&<button className="btn btn-outline btn-sm" onClick={()=>setSel(null)}>✕</button>}
          </div>
          <div style={{padding:12,flex:1,overflowY:"auto",maxHeight:380}}>
            {!sel ? JUNCTIONS.map(j=>(
              <div key={j.id} onClick={()=>setSel(j)}
                style={{padding:"9px 10px",border:"1px solid var(--grey2)",borderRadius:6,cursor:"pointer",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--grey1)",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--grey2)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--grey1)"}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"var(--navy)"}}>{j.name}</div>
                  <div className="mono" style={{fontSize:10,color:"var(--text3)"}}>{j.id}</div>
                </div>
                <Badge type={j.congestion}/>
              </div>
            )) : (
              <div>
                <div style={{fontWeight:700,color:"var(--navy)",fontSize:13,marginBottom:12,lineHeight:1.4}}>{sel.name}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[["ID",sel.id],[`Congestion`,<Badge type={sel.congestion}/>],["Vehicles",sel.vehicles],["Delay",`${sel.delay} min`],["Density",`${sel.density}%`],["Phase",<Badge type={sel.phase}/>]].map(([k,v])=>(
                    <div key={k} style={{background:"var(--grey1)",borderRadius:5,padding:"8px 10px"}}>
                      <div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:2}}>{k}</div>
                      <div style={{fontSize:13,fontWeight:600}}>{v}</div>
                    </div>
                  ))}
                </div>
                <DBar value={sel.density}/>
                <button className="btn btn-navy btn-sm" style={{width:"100%",justifyContent:"center",marginTop:12}}>
                  Open in Signal Panel →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{marginTop:18}} className="card">
        <div className="card-head">
          <h3>⚡ Recent System Events</h3>
          <button className="btn btn-outline btn-sm" onClick={()=>onNavTo("history")}>View All →</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr>{["Time","Type","Junction","Details","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {LOGS.slice(0,4).map(l=>(
                <tr key={l.id}>
                  <td className="mono">{l.time}</td>
                  <td><span className="badge bb">{l.type}</span></td>
                  <td style={{fontWeight:500,fontSize:12}}>{l.junction}</td>
                  <td style={{fontSize:12,color:"var(--text3)",maxWidth:220}}>{l.details}</td>
                  <td><Badge type={l.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── LIVE MAP PAGE (Leaflet.js) ─────────────────────────────────────────── */
function MapPage() {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const [loaded,setLoaded]=useState(false);
  const [loadError,setLoadError]=useState(false);

  const initMap = useCallback((L)=>{
    if(leafletMap.current || !mapRef.current || !L) return;
    const map = L.map(mapRef.current,{center:[13.0,80.22],zoom:11});
    leafletMap.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
      attribution:'&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom:18,
    }).addTo(map);

    const color={Red:"#EF4444",Yellow:"#F59E0B",Green:"#22C55E"};
    const pulse={Red:"0 0 0 3px rgba(239,68,68,0.3)",Yellow:"",Green:""};

    JUNCTIONS.forEach(j=>{
      const icon = L.divIcon({
        className:"",
        html:`<div style="width:18px;height:18px;border-radius:50%;background:${color[j.congestion]};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3),${pulse[j.congestion]};"></div>`,
        iconSize:[18,18],iconAnchor:[9,9],
      });
      const marker = L.marker([j.lat,j.lng],{icon}).addTo(map);
      marker.bindPopup(`
        <div style="font-family:DM Sans,sans-serif;min-width:180px;padding:4px 0">
          <b style="font-size:13px;color:#0D2B5E">${j.name}</b><br>
          <span style="font-size:11px;color:#6B7280">${j.id}</span><hr style="margin:6px 0;border-color:#eee">
          <div style="font-size:12px;line-height:1.7">
            <b>Density:</b> ${j.density}%<br>
            <b>Vehicles:</b> ${j.vehicles}<br>
            <b>Delay:</b> ${j.delay} min<br>
            <b>Status:</b> <span style="color:${color[j.congestion]};font-weight:700">${j.congestion}</span>
          </div>
        </div>
      `);
    });
    setLoaded(true);
  },[]);

  useEffect(()=>{
    let cancelled = false;

    const loadMap = async ()=>{
      try {
        if (!leafletLoader) leafletLoader = import("leaflet");
        const mod = await leafletLoader;
        if (!cancelled) initMap(mod.default ?? mod);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    };

    loadMap();

    return ()=>{
      cancelled = true;
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  },[initMap]);

  return (
    <div className="page-wrap">
      <div className="breadcrumb">Home › <span>Live Traffic Map</span></div>
      <div className="page-hd">
        <div className="page-hd-l">
          <h2>🗺 Live Traffic Map — Leaflet.js</h2>
          <p>Interactive real-time junction map. Click any marker for details. Powered by OpenStreetMap.</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:18}}>
        <div className="card">
          <div className="card-head">
            <h3>📍 Chennai Junction Network — Live</h3>
            <div style={{display:"flex",gap:10,fontSize:11}}>
              {[["#22C55E","Low"],["#F59E0B","Moderate"],["#EF4444","High"]].map(([c,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:5,fontWeight:600}}>
                  <span style={{width:12,height:12,borderRadius:"50%",background:c,display:"inline-block",boxShadow:`0 0 6px ${c}`}}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div style={{padding:12, position:"relative"}}>
            <div ref={mapRef} id="traffix-map"/>
            {!loaded && !loadError && (
              <div style={{position:"absolute", inset:12, display:"flex",alignItems:"center",justifyContent:"center",background:"var(--grey1)",borderRadius:8,flexDirection:"column",gap:12}}>
                <div style={{fontSize:32,animation:"pulse 1.5s infinite"}}>🗺</div>
                <div style={{color:"var(--text3)",fontSize:13}}>Loading map...</div>
              </div>
            )}
            {loadError && (
              <div style={{position:"absolute", inset:12, display:"flex",alignItems:"center",justifyContent:"center",background:"var(--grey1)",borderRadius:8,flexDirection:"column",gap:10,padding:24,textAlign:"center"}}>
                <div style={{fontSize:30}}>⚠️</div>
                <div style={{color:"var(--text)",fontWeight:600}}>Map failed to load.</div>
                <div style={{color:"var(--text3)",fontSize:12}}>Leaflet could not initialize from the local bundle.</div>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{alignSelf:"start"}}>
          <div className="card-head"><h3>Junction Status</h3></div>
          <div style={{padding:10}}>
            {JUNCTIONS.map(j=>(
              <div key={j.id} style={{padding:"8px 10px",marginBottom:6,borderRadius:6,border:"1px solid var(--grey2)",background:"var(--grey1)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:600,color:"var(--navy)",flex:1,paddingRight:6,lineHeight:1.3}}>{j.name}</span>
                  <Badge type={j.congestion}/>
                </div>
                <DBar value={j.density}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ANALYTICS PAGE ─────────────────────────────────────────────────────── */
function AnalyticsPage() {
  const [range,setRange]=useState("24h");
  const total=JUNCTIONS.reduce((a,j)=>a+j.vehicles,0);

  return (
    <div className="page-wrap">
      <div className="breadcrumb">Home › <span>Analytics</span></div>
      <div className="page-hd">
        <div className="page-hd-l">
          <h2>📊 Traffic Analytics &amp; Predictions</h2>
          <p>ML-powered density forecasting, vehicle count trends, and network efficiency metrics.</p>
        </div>
        <div style={{display:"flex",gap:4}}>
          {["1h","24h","7d","30d"].map(r=>(
            <button key={r} onClick={()=>setRange(r)}
              className="btn btn-sm"
              style={{background:range===r?"var(--navy)":"transparent",color:range===r?"#fff":"var(--text3)",border:"1.5px solid var(--border)"}}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="kpi-grid">
        {[
          {lbl:"Network Efficiency", val:"92.4%", color:"var(--green)", sub:"▲ +2.1% this week"},
          {lbl:"AI Interventions",   val:"1,402", color:"var(--navy)",  sub:"Automated changes today"},
          {lbl:"Avg Network Delay",  val:"4.2 m", color:"#B45309",      sub:"▼ -0.8m from baseline"},
          {lbl:"Total Vehicles",     val:total.toLocaleString(), color:"var(--navy2)", sub:"Monitored today"},
        ].map(k=>(
          <div key={k.lbl} className="kpi" style={{borderLeftColor:k.color}}>
            <div className="kpi-lbl">{k.lbl}</div>
            <div className="kpi-val" style={{color:k.color}}>{k.val}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18,marginBottom:18}}>
        <div className="card">
          <div className="card-head">
            <h3>📈 Hourly Traffic Density vs AI Prediction</h3>
            <div style={{display:"flex",gap:12,fontSize:11}}>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:12,height:3,background:"#1A4490",display:"inline-block",borderRadius:2}}/> Actual</span>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:12,height:3,background:"#D4A017",display:"inline-block",borderRadius:2,borderTop:"2px dashed #D4A017"}}/> Predicted</span>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={HOURLY} margin={{top:5,right:10,bottom:0,left:-20}}>
                <defs>
                  <linearGradient id="gDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1A4490" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1A4490" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#D4A017" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#D4A017" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DA"/>
                <XAxis dataKey="h" tick={{fontSize:11,fill:"#9CA3AF"}}/>
                <YAxis tick={{fontSize:11,fill:"#9CA3AF"}}/>
                <Tooltip content={<ChartTip/>}/>
                <Area type="monotone" dataKey="density" name="Density %" stroke="#1A4490" strokeWidth={2.5} fill="url(#gDensity)"/>
                <Area type="monotone" dataKey="prediction" name="Prediction %" stroke="#D4A017" strokeWidth={2} strokeDasharray="5 3" fill="url(#gPred)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>🔵 Congestion Distribution</h3></div>
          <div className="card-body" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip formatter={(v,n)=>[`${v} junctions`,n]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%",marginTop:4}}>
              {PIE_DATA.map(d=>(
                <div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{display:"flex",alignItems:"center",gap:7,fontSize:12}}>
                    <span style={{width:10,height:10,borderRadius:2,background:d.color,display:"inline-block"}}/>
                    {d.name}
                  </span>
                  <span className="mono" style={{fontWeight:700,color:d.color}}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div className="card">
          <div className="card-head"><h3>🚗 Vehicle Count by Hour</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={HOURLY} margin={{top:5,right:10,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DA"/>
                <XAxis dataKey="h" tick={{fontSize:11,fill:"#9CA3AF"}}/>
                <YAxis tick={{fontSize:11,fill:"#9CA3AF"}}/>
                <Tooltip content={<ChartTip/>}/>
                <Bar dataKey="vehicles" name="Vehicles" fill="#1A4490" radius={[3,3,0,0]}
                  label={false}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>📅 Weekly Peak vs Average</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={WEEKLY} margin={{top:5,right:10,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DA"/>
                <XAxis dataKey="day" tick={{fontSize:11,fill:"#9CA3AF"}}/>
                <YAxis tick={{fontSize:11,fill:"#9CA3AF"}}/>
                <Tooltip content={<ChartTip/>}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Line type="monotone" dataKey="avg"  name="Avg Density" stroke="#1A4490" strokeWidth={2.5} dot={{r:4}}/>
                <Line type="monotone" dataKey="peak" name="Peak Density" stroke="#B91C1C" strokeWidth={2} strokeDasharray="4 2" dot={{r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>📋 Junction Performance Summary</h3></div>
        <div className="tbl-wrap">
          <table>
            <thead><tr>{["ID","Junction","Density","Congestion","Vehicles","Delay","Phase"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {JUNCTIONS.map(j=>(
                <tr key={j.id}>
                  <td className="mono">{j.id}</td>
                  <td style={{fontWeight:500}}>{j.name}</td>
                  <td style={{minWidth:140}}><DBar value={j.density}/></td>
                  <td><Badge type={j.congestion}/></td>
                  <td className="mono">{j.vehicles}</td>
                  <td className="mono">{j.delay} m</td>
                  <td><Badge type={j.phase}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── SIGNAL CONTROL PAGE ────────────────────────────────────────────────── */
function SignalsPage() {
  const [phases,setPhases]=useState(JUNCTIONS.map(j=>j.phase));
  const [sel,setSel]=useState(0);
  const [timings,setTimings]=useState(JUNCTIONS.map(()=>({green:45,yellow:5,red:40})));
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    const id=setInterval(()=>{
      setPhases(p=>p.map(x=>Math.random()>.82?(x==="Green"?"Yellow":x==="Yellow"?"Red":"Green"):x));
    },4000);
    return()=>clearInterval(id);
  },[]);

  const cycle=(i,e)=>{
    e.stopPropagation();
    setPhases(p=>{const n=[...p];n[i]=n[i]==="Green"?"Yellow":n[i]==="Yellow"?"Red":"Green";return n;});
  };

  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};

  return (
    <div className="page-wrap">
      <div className="breadcrumb">Home › <span>Signal Control</span></div>
      <div className="page-hd">
        <div className="page-hd-l">
          <h2>🚦 Adaptive Signal Control Panel</h2>
          <p>AI auto-adjusts green durations. Manual overrides are logged permanently.</p>
        </div>
      </div>
      <div className="alert alert-info">ℹ️ Signals refresh every 4 s via AI optimisation. Click any card to edit its timing. Click Cycle to manually advance phase.</div>

      <div className="signal-grid">
        {JUNCTIONS.map((j,i)=>{
          const ph=phases[i];
          const bc=ph==="Green"?"#22C55E":ph==="Yellow"?"#F59E0B":"#EF4444";
          return (
            <div key={j.id} className={`signal-card${sel===i?" selected":""}`}
              style={{borderTopColor:bc}} onClick={()=>setSel(i)}>
              <div className="tl" style={{margin:"0 auto 12px"}}>
                <div className={`tl-b tl-r${ph==="Red"?" on":""}`}/>
                <div className={`tl-b tl-y${ph==="Yellow"?" on":""}`}/>
                <div className={`tl-b tl-g${ph==="Green"?" on":""}`}/>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:"var(--navy)",lineHeight:1.3,marginBottom:4}}>
                {j.name.split("–")[0].trim()}
              </div>
              <div className="mono" style={{fontSize:10,color:"var(--text3)",marginBottom:8}}>{j.id}</div>
              <Badge type={ph}/>
              <div style={{marginTop:10}}>
                <button className="btn btn-outline btn-sm" style={{fontSize:11,padding:"4px 10px"}}
                  onClick={(e)=>cycle(i,e)}>↻ Cycle</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-head">
          <h3>⏱ Timing Editor — {JUNCTIONS[sel].name}</h3>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {saved&&<span className="badge bg">✓ Saved</span>}
            <button className="btn btn-navy btn-sm" onClick={save}>💾 Save</button>
            <button className="btn btn-outline btn-sm">↺ AI Default</button>
          </div>
        </div>
        <div className="card-body">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
            {[["green","#22C55E","🟢"],["yellow","#F59E0B","🟡"],["red","#EF4444","🔴"]].map(([k,c,ico])=>(
              <div key={k}>
                <label className="form-label" style={{color:c}}>
                  {ico} {k.charAt(0).toUpperCase()+k.slice(1)} Phase
                </label>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <input type="range" min={5} max={90} value={timings[sel][k]}
                    style={{flex:1,accentColor:c}}
                    onChange={e=>{const n=[...timings];n[sel]={...n[sel],[k]:+e.target.value};setTimings(n);}}/>
                  <span className="mono" style={{fontWeight:700,fontSize:16,width:40,color:c}}>{timings[sel][k]}s</span>
                </div>
              </div>
            ))}
          </div>
          <div className="alert alert-ok" style={{marginTop:18,marginBottom:0,fontSize:12}}>
            ✓ Cycle total: {timings[sel].green+timings[sel].yellow+timings[sel].red}s &nbsp;·&nbsp;
            Green ratio: {Math.round(timings[sel].green/(timings[sel].green+timings[sel].yellow+timings[sel].red)*100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── EMERGENCY PAGE ─────────────────────────────────────────────────────── */
function EmergencyPage({role}) {
  const [active,setActive]=useState(null);
  const can=role==="Emergency Authority"||role==="Super Admin";
  const corridors=[
    {id:"c1",name:"Hospital Route Alpha (N–S)",nodes:["J-001","J-004","J-007"],status:"Standby"},
    {id:"c2",name:"Fire Dept Corridor (E–W)", nodes:["J-002","J-005"],       status:"Active"},
    {id:"c3",name:"Evacuation Protocol Sigma",nodes:["All Network"],          status:"Disabled"},
  ];
  return (
    <div className="page-wrap">
      <div className="breadcrumb">Home › <span>Emergency Command</span></div>
      <div className="page-hd">
        <div className="page-hd-l">
          <h2 style={{color:"var(--danger)"}}>🚨 Emergency Command Centre</h2>
          <p>Critical override protocols — authorised emergency personnel only.</p>
        </div>
      </div>
      {!can&&<div className="alert alert-err">🔒 Restricted — Emergency Authority or Super Admin clearance required.</div>}
      <div className="alert alert-warn">⚠️ Activating any protocol suspends AI optimisation for affected corridors and is logged permanently.</div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card" style={{borderTop:"3px solid var(--danger)"}}>
          <div className="card-head">
            <h3 style={{color:"var(--danger)"}}>🚑 Priority Corridor Preemption</h3>
            {active&&<span className="badge br" style={{animation:"pulse 1s infinite"}}>● LIVE</span>}
          </div>
          <div style={{padding:14,display:"flex",flexDirection:"column",gap:10}}>
            {corridors.map(c=>(
              <div key={c.id} style={{border:"1px solid var(--border)",borderRadius:7,padding:"13px 14px",background:active===c.id?"#FEF2F2":"var(--grey1)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:"var(--navy)"}}>{c.name}</div>
                    <div className="mono" style={{fontSize:10,color:"var(--text3)",marginTop:2}}>
                      {c.nodes.join(" · ")}
                    </div>
                  </div>
                  <Badge type={c.status==="Active"?"Red":c.status==="Standby"?"Yellow":"bk"}/>
                </div>
                <button
                  className={`btn btn-sm ${active===c.id?"btn-red":"btn-outline"}`}
                  style={{borderColor:"var(--red)",color:active===c.id?"#fff":"var(--red)"}}
                  onClick={()=>setActive(active===c.id?null:c.id)}
                  disabled={!can}>
                  {active===c.id?"✓ DEACTIVATE":"⚡ INITIATE OVERRIDE"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{borderTop:"3px solid #B45309"}}>
          <div className="card-head"><h3>⚠️ Disaster Protocols</h3></div>
          <div style={{padding:14}}>
            <p style={{fontSize:13,color:"var(--text3)",marginBottom:14,lineHeight:1.7}}>
              Disaster mode suspends AI optimisation network-wide. Requires Super Admin dual-authorisation.
            </p>
            {[
              {t:"🔴 Total System Flash",d:"All 48 signals blink RED. Use during catastrophic failure.",bg:"#FEF2F2",c:"var(--danger)"},
              {t:"🟡 All-Green Arterial Flush",d:"Open all arterials to max flow for mass evacuation.",bg:"#FFFBEB",c:"#B45309"},
            ].map(it=>(
              <div key={it.t} style={{border:"1px solid var(--border)",borderRadius:7,padding:14,background:it.bg,marginBottom:10}}>
                <div style={{fontWeight:700,marginBottom:5,fontSize:13}}>{it.t}</div>
                <p style={{fontSize:12,color:"var(--text3)",marginBottom:10}}>{it.d}</p>
                <button className="btn btn-sm" style={{width:"100%",justifyContent:"center",background:it.bg,color:it.c,borderColor:it.c}}
                  disabled={role!=="Super Admin"}>
                  SUPER ADMIN ONLY — DUAL AUTH REQUIRED
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HISTORY PAGE ───────────────────────────────────────────────────────── */
function HistoryPage() {
  const [q,setQ]=useState("");
  const [tf,setTf]=useState("All");
  const types=["All","AI Optimisation","Manual Override","System Event","Sensor Alert","Emergency Override","Peak Transition"];
  const rows=LOGS.filter(l=>(tf==="All"||l.type===tf)&&(l.junction+l.type+l.details+l.id).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="page-wrap">
      <div className="breadcrumb">Home › <span>History &amp; Audit Log</span></div>
      <div className="page-hd">
        <div className="page-hd-l">
          <h2>📋 Audit Log</h2>
          <p>Immutable chronological record of all AI decisions, operator actions, and system events.</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-outline btn-sm">↓ Export CSV</button>
          <button className="btn btn-navy btn-sm">🖨 Print</button>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <div className="search-wrap" style={{flex:1,minWidth:200}}>
          <span className="search-icon">🔍</span>
          <input className="form-input" type="text" placeholder="Search events…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="form-select" style={{width:"auto",minWidth:180}} value={tf} onChange={e=>setTf(e.target.value)}>
          {types.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr>{["Event ID","Time","Type","Junction","Details","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.length===0
              ?<tr><td colSpan={6} style={{textAlign:"center",padding:28,color:"var(--text3)"}}>No events found.</td></tr>
              :rows.map(l=>(
              <tr key={l.id}>
                <td className="mono">{l.id}</td>
                <td className="mono" style={{color:"var(--text3)"}}>{l.time}</td>
                <td><span className="badge bb">{l.type}</span></td>
                <td style={{fontWeight:500,fontSize:12}}>{l.junction}</td>
                <td style={{fontSize:12,color:"var(--text3)",maxWidth:240}}>{l.details}</td>
                <td><Badge type={l.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:"var(--grey1)",borderTop:"1px solid var(--border)",fontSize:12,color:"var(--text3)"}}>
        <span>Showing {rows.length} / {LOGS.length} events</span>
        <div style={{display:"flex",gap:6}}>
          <button className="btn btn-outline btn-sm" style={{opacity:.5}}>← Prev</button>
          <button className="btn btn-outline btn-sm">Next →</button>
        </div>
      </div>
    </div>
  );
}

/* ─── USERS PAGE ─────────────────────────────────────────────────────────── */
function UsersPage() {
  const [q,setQ]=useState(""); const [rf,setRf]=useState("All");
  const roles=["All","Super Admin","Traffic Engineer","Traffic Operator","Emergency Authority"];
  const rows=USERS.filter(u=>(rf==="All"||u.role===rf)&&(u.name+u.id).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page-wrap">
      <div className="breadcrumb">Home › <span>User Management</span></div>
      <div className="page-hd">
        <div className="page-hd-l">
          <h2>👥 User Access Management</h2>
          <p>Manage authority accounts, JWT tokens, roles, and operational zone assignments.</p>
        </div>
        <button className="btn btn-navy btn-sm">+ Add User</button>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[
          {lbl:"Total Accounts",  val:USERS.length,                                              c:"var(--navy)"},
          {lbl:"Active",          val:USERS.filter(u=>u.status==="Active").length,                c:"var(--green)"},
          {lbl:"Privileged Roles",val:USERS.filter(u=>["Super Admin","Emergency Authority"].includes(u.role)).length, c:"var(--gold)"},
        ].map(k=>(
          <div key={k.lbl} className="kpi" style={{borderLeftColor:k.c}}>
            <div className="kpi-lbl">{k.lbl}</div>
            <div className="kpi-val" style={{color:k.c}}>{k.val}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <div className="search-wrap" style={{flex:1}}>
          <span className="search-icon">🔍</span>
          <input className="form-input" type="text" placeholder="Search users…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="form-select" style={{width:"auto",minWidth:180}} value={rf} onChange={e=>setRf(e.target.value)}>
          {roles.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead><tr>{["User ID","Name","Role","Zone","Status","Last Login","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(u=>(
              <tr key={u.id}>
                <td className="mono">{u.id}</td>
                <td><div style={{fontWeight:600}}>{u.name}</div></td>
                <td><Badge type={u.role}/></td>
                <td style={{fontSize:12}}>{u.zone}</td>
                <td><Badge type={u.status}/></td>
                <td className="mono" style={{fontSize:11,color:"var(--text3)"}}>{u.last}</td>
                <td>
                  <div style={{display:"flex",gap:5}}>
                    <button className="btn btn-outline btn-sm">Edit</button>
                    <button className="btn btn-sm" style={{background:u.status==="Active"?"#FEF2F2":"#F0FDF4",color:u.status==="Active"?"var(--danger)":"var(--green)",border:"none"}}>
                      {u.status==="Active"?"Suspend":"Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── SETTINGS PAGE ──────────────────────────────────────────────────────── */
function SettingsPage() {
  const [ai,setAi]=useState(true); const [emg,setEmg]=useState(true); const [log,setLog]=useState(true);
  const [thr,setThr]=useState(75); const [sync,setSync]=useState(10);
  const [saved,setSaved]=useState(false);

  const TogRow=({label,sub,v,onChg})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"12px 14px",background:"var(--grey1)",borderRadius:6,border:"1px solid var(--grey2)"}}>
      <div><div style={{fontWeight:600,fontSize:13}}>{label}</div><div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>{sub}</div></div>
      <button className={`toggle${v?" on":""}`} onClick={()=>onChg(!v)}/>
    </div>
  );

  return (
    <div className="page-wrap">
      <div className="breadcrumb">Home › <span>Settings</span></div>
      <div className="page-hd">
        <div className="page-hd-l">
          <h2>⚙ System Configuration</h2>
          <p>AI engine, security, and operational settings for the Traffix platform.</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {saved&&<span className="badge bg">✓ Saved</span>}
          <button className="btn btn-navy" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);}}>💾 Save Changes</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card">
          <div className="card-head"><h3>🤖 AI Optimisation Engine</h3></div>
          <div style={{padding:14,display:"flex",flexDirection:"column",gap:10}}>
            <TogRow label="Auto-Optimise Signal Phases" sub="AI rebalances cycles without manual review." v={ai} onChg={setAi}/>
            {[["Congestion Alert Threshold",thr,setThr,40,95,"%"],["Telemetry Sync Interval",sync,setSync,2,30,"s"]].map(([l,v,s,mn,mx,u])=>(
              <div key={l} style={{padding:"12px 14px",background:"var(--grey1)",borderRadius:6,border:"1px solid var(--grey2)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontWeight:600,fontSize:13}}>{l}</span>
                  <span className="mono" style={{fontWeight:700,color:"var(--navy)",fontSize:15}}>{v}{u}</span>
                </div>
                <input type="range" min={mn} max={mx} value={v} onChange={e=>s(+e.target.value)}/>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>🔒 Security &amp; Override</h3></div>
          <div style={{padding:14,display:"flex",flexDirection:"column",gap:10}}>
            <TogRow label="Emergency Broadcast Channel" sub="Hard-priority preemption broadcasting." v={emg} onChg={setEmg}/>
            <TogRow label="Immutable Audit Logging" sub="Full signal-control trace for compliance." v={log} onChg={setLog}/>
            <div style={{padding:"12px 14px",background:"var(--grey1)",borderRadius:6,border:"1px solid var(--grey2)"}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>JWT Auth Settings</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:10}}>
                Algorithm: <span className="mono">HS256</span> · Token TTL: <span className="mono">60 min</span>
              </div>
              <button className="btn btn-outline btn-sm" style={{borderColor:"var(--red)",color:"var(--red)"}}>🔄 Rotate Secret Key</button>
            </div>
          </div>
        </div>
        <div className="card" style={{gridColumn:"1 / -1"}}>
          <div className="card-head"><h3>🔌 Database &amp; Backend Connection</h3></div>
          <div style={{padding:14,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[
              {l:"MongoDB Atlas",v:"Connected ✓",s:"traffix / cluster0",ok:true},
              {l:"Backend API",  v:"https://traffix-api.onrender.com",s:"FastAPI · Healthy",ok:true},
              {l:"Auth Service", v:"JWT / HS256",s:"Token TTL: 60 min",ok:true},
              {l:"Build Version",v:"Traffix v3.2.1",s:"Build 2026.03 · Stable",ok:true},
            ].map(({l,v,s,ok})=>(
              <div key={l} style={{padding:"12px 14px",background:ok?"#F0FDF4":"var(--grey1)",borderRadius:6,border:`1px solid ${ok?"#BBF7D0":"var(--grey2)"}`}}>
                <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".1em",color:"var(--text3)",marginBottom:4}}>{l}</div>
                <div style={{fontSize:12,fontWeight:700,color:"var(--navy)",wordBreak:"break-all"}}>{v}</div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── GOV FOOTER ─────────────────────────────────────────────────────────── */
function GovFooter() {
  return (
    <footer className="gov-footer">
      <span>© 2026 Government of Tamil Nadu · Department of Highways &amp; Traffic Engineering · All Rights Reserved</span>
      <span>Traffix v3.2.1 · <a href="#">Disclaimer</a> · <a href="#">Privacy Policy</a> · <a href="#">Contact NOC</a></span>
    </footer>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────────────────── */
export default function App() {
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("dashboard");

  const login = u=>{setUser(u); setTab("dashboard");};
  const logout = ()=>{setUser(null); setTab("dashboard");};
  const navTo = t=>{setTab(t);};

  const renderPage=()=>{
    switch(tab){
      case "dashboard": return <DashboardPage onNavTo={navTo}/>;
      case "map":       return <MapPage/>;
      case "analytics": return <AnalyticsPage/>;
      case "signals":   return <SignalsPage/>;
      case "emergency": return <EmergencyPage role={user?.role}/>;
      case "history":   return <HistoryPage/>;
      case "users":     return <UsersPage/>;
      case "settings":  return <SettingsPage/>;
      default:          return <DashboardPage onNavTo={navTo}/>;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}}/>
      {!user ? (
        <LoginPage onLogin={login}/>
      ) : (
        <>
          <GovHeader user={user} onLogout={logout}/>
          <NavBar tab={tab} setTab={setTab} user={user}/>
          <main style={{background:"var(--bg)",minHeight:"calc(100vh - 200px)"}}>
            {renderPage()}
          </main>
          <GovFooter/>
        </>
      )}
    </>
  );
}
