"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import DarkModeToggle from "@/components/DarkModeToggle";

/* ─────────────────────────────────────────────
   GLOBAL STYLES — Terminal / Mission-Control
───────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ════════════════════════════════════════════
   LIGHT MODE (DEFAULT)
   ════════════════════════════════════════════ */
:root {
  --bg0:#FFFFFF;
  --bg1:#F8FAFB;
  --bg2:#F0F3F7;
  --bg3:#E8EEF5;
  --bg4:#E0E8F0;
  --amber:#D97706;
  --amber2:#F59E0B;
  --cyan:#0891B2;
  --cyan2:#06B6D4;
  --green:#059669;
  --green2:#10B981;
  --red:#DC2626;
  --red2:#EF4444;
  --purple:#7C3AED;
  --border:#D1D5DB;
  --border2:#E5E7EB;
  --text0:#1F2937;
  --text1:#374151;
  --text2:#6B7280;
  --mono:'Space Mono',monospace;
  --sans:Arial,sans-serif;
  --display:Arial,sans-serif;
  --sidebar:220px;
  --topbar:48px;
}

/* ════════════════════════════════════════════
   DARK MODE
   ════════════════════════════════════════════ */
:root.dark-mode {
  --bg0:#070B0F;
  --bg1:#0D1117;
  --bg2:#111820;
  --bg3:#1A2332;
  --bg4:#1F2B3D;
  --amber:#FFD966;
  --amber2:#FFEB3B;
  --cyan:#00D4FF;
  --cyan2:#87CEEB;
  --green:#00FF88;
  --green2:#00CC6A;
  --red:#FF4444;
  --red2:#FF6B6B;
  --purple:#BB86FC;
  --border:#2A4A6A;
  --border2:#3A5A7A;
  --text0:#FFFFFF;
  --text1:#E0E6ED;
  --text2:#A8B8CC;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{
  font-family:var(--sans);font-size:15px;line-height:1.7;
  color:var(--text1);background:var(--bg0);
  overflow-x:hidden;min-height:100vh;
  transition:background-color 0.3s, color 0.3s;
  letter-spacing:0.3px;
}
button,input,select,textarea{font-family:inherit;}
a{color:var(--cyan);text-decoration:none;}

::-webkit-scrollbar{width:8px;height:8px;}
::-webkit-scrollbar-track{background:var(--bg1);}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px;}
::-webkit-scrollbar-thumb:hover{background:var(--amber);}

body::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;
  background:none;
}

:root.dark-mode body::before {
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px);
}

.app-shell{display:flex;min-height:100vh;}

.sidebar{
  width:var(--sidebar);flex-shrink:0;
  background:var(--bg1);border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;
  z-index:200;transition:transform .25s ease;
}
.sidebar-logo{padding:16px 18px 12px;border-bottom:1px solid var(--border);}
.logo-mark{display:flex;align-items:center;gap:10px;margin-bottom:4px;}
.logo-icon{
  width:30px;height:30px;background:linear-gradient(135deg,var(--amber),var(--amber2));
  border-radius:6px;display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:900;color:var(--bg0);font-family:var(--display);flex-shrink:0;
  box-shadow:0 0 14px rgba(232,160,32,0.35);
}
:root.dark-mode .logo-icon{
  box-shadow:0 0 14px rgba(255,217,102,0.35);
}
.logo-text{font-family:var(--display);font-size:16px;font-weight:800;color:var(--text0);letter-spacing:-.01em;}
.logo-sub{font-family:var(--mono);font-size:9px;color:var(--text2);letter-spacing:.14em;text-transform:uppercase;}

.sidebar-section{padding:10px 0;}
.sidebar-label{
  font-family:var(--mono);font-size:8.5px;font-weight:700;
  color:var(--text2);letter-spacing:.18em;text-transform:uppercase;
  padding:0 18px;margin-bottom:4px;
}
.nav-btn{
  display:flex;align-items:center;gap:10px;width:100%;padding:8px 18px;
  border:none;background:none;font-family:var(--sans);font-size:12px;font-weight:500;
  color:var(--text2);cursor:pointer;text-align:left;transition:all .15s;
  border-left:2px solid transparent;
}
.nav-btn:hover{color:var(--text0);background:rgba(0,0,0,0.03);}
:root.dark-mode .nav-btn:hover{background:rgba(255,255,255,0.03);}
.nav-btn.active{color:var(--amber);background:rgba(217,119,6,0.08);}
:root.dark-mode .nav-btn.active{background:rgba(255,217,102,0.08);}
.nav-btn.active{border-left-color:var(--amber);}
.nav-ico{font-size:14px;width:16px;text-align:center;flex-shrink:0;}
.nav-badge{
  margin-left:auto;background:var(--red);color:#fff;
  font-family:var(--mono);font-size:8px;font-weight:700;
  padding:1px 5px;border-radius:3px;
}
.sidebar-bottom{margin-top:auto;padding:14px 18px;border-top:1px solid var(--border);}
.user-card{display:flex;align-items:center;gap:9px;}
.user-ava{
  width:28px;height:28px;border-radius:5px;flex-shrink:0;
  background:linear-gradient(135deg,var(--cyan),var(--purple));
  display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:9.5px;font-weight:700;color:#fff;
}
.user-name{font-size:11.5px;font-weight:600;color:var(--text0);line-height:1.2;}
.user-role{font-family:var(--mono);font-size:8.5px;color:var(--text2);text-transform:uppercase;letter-spacing:.1em;}

.main-area{margin-left:var(--sidebar);flex:1;display:flex;flex-direction:column;min-height:100vh;}

.topbar{
  height:var(--topbar);background:var(--bg1);border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 20px;gap:14px;
  position:sticky;top:0;z-index:100;
}
.topbar-path{font-family:var(--mono);font-size:10px;color:var(--text2);display:flex;align-items:center;gap:4px;flex:1;}
.topbar-path span{color:var(--amber);font-weight:700;}
.live-pill{
  display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:9px;font-weight:700;
  color:var(--green);background:rgba(5,150,105,0.08);
  padding:3px 9px;border-radius:3px;border:1px solid rgba(5,150,105,0.2);
}
:root.dark-mode .live-pill{
  background:rgba(0,255,136,0.08);
  border-color:rgba(0,255,136,0.2);
}
.live-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:blink 1.6s infinite;}
.clock-box{font-family:var(--mono);font-size:10px;color:var(--text1);background:var(--bg2);padding:4px 9px;border-radius:3px;border:1px solid var(--border);}
.exit-btn{
  font-family:var(--mono);font-size:10px;font-weight:700;color:var(--red);
  background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.25);
  padding:4px 10px;border-radius:3px;cursor:pointer;transition:all .15s;
  text-transform:uppercase;letter-spacing:.05em;
}
:root.dark-mode .exit-btn{
  background:rgba(255,61,90,0.08);
  border-color:rgba(255,61,90,0.25);
}
.exit-btn:hover{background:rgba(220,38,38,0.15);}
:root.dark-mode .exit-btn:hover{background:rgba(255,61,90,0.15);}
.mob-menu{
  display:none;width:32px;height:32px;border:1px solid var(--border);
  background:var(--bg2);border-radius:4px;cursor:pointer;
  align-items:center;justify-content:center;color:var(--text1);font-size:15px;
}

.content{padding:20px;flex:1;}
.page-header{margin-bottom:20px;}
.page-header h1{
  font-family:var(--display);font-size:26px;font-weight:800;
  color:var(--text0);letter-spacing:-.02em;display:flex;align-items:center;gap:10px;
}
.page-header p{font-size:12px;color:var(--text2);margin-top:3px;font-family:var(--mono);}
.page-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.header-row{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:20px;}
.accent-rule{width:36px;height:2px;background:linear-gradient(90deg,var(--amber),transparent);border-radius:1px;margin:4px 0 8px;}

.kpi-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;}
.kpi-card{
  background:var(--bg1);border:1px solid var(--border);border-radius:6px;
  padding:14px 16px;position:relative;overflow:hidden;transition:border-color .2s;
}
.kpi-card:hover{border-color:var(--border2);}
.kpi-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--kpi-accent,var(--amber));}
.kpi-label{font-family:var(--mono);font-size:8.5px;font-weight:700;color:var(--text2);letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px;}
.kpi-value{font-family:var(--mono);font-size:28px;font-weight:700;color:var(--text0);line-height:1;margin-bottom:4px;}
.kpi-delta{font-size:10.5px;color:var(--text2);}
.kpi-delta.up{color:var(--green);}
.kpi-delta.dn{color:var(--red);}

.panel{background:var(--bg1);border:1px solid var(--border);border-radius:6px;overflow:hidden;transition:border-color .2s;}
.panel:hover{border-color:var(--border2);}
.panel-head{
  display:flex;align-items:center;justify-content:space-between;gap:8px;
  padding:10px 14px;border-bottom:1px solid var(--border);background:var(--bg2);
}
.panel-title{
  font-family:var(--mono);font-size:11px;font-weight:700;color:var(--amber);
  letter-spacing:.12em;text-transform:uppercase;display:flex;align-items:center;gap:7px;
}
.panel-title::before{content:'';width:3px;height:3px;background:var(--amber);border-radius:50%;box-shadow:0 0 5px var(--amber);}
.panel-body{padding:14px;}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.g13{display:grid;grid-template-columns:1fr 300px;gap:12px;}

.jlist{display:flex;flex-direction:column;gap:4px;}
.jrow{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:4px;cursor:pointer;border:1px solid transparent;transition:all .15s;}
.jrow:hover{background:var(--bg3);border-color:var(--border);}
.jrow.active-j{background:rgba(217,119,6,0.07);border-color:rgba(217,119,6,0.2);}
:root.dark-mode .jrow.active-j{background:rgba(255,217,102,0.07);border-color:rgba(255,217,102,0.2);}
.jrow-id{font-family:var(--mono);font-size:9px;color:var(--text2);width:44px;flex-shrink:0;}
.jrow-name{flex:1;font-size:13px;font-weight:500;color:var(--text0);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

.sdot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.sdot-g{background:var(--green);box-shadow:0 0 6px var(--green);}
.sdot-y{background:var(--amber);box-shadow:0 0 6px var(--amber);}
.sdot-r{background:var(--red);box-shadow:0 0 6px var(--red);}

.badge{
  display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:3px;
  font-family:var(--mono);font-size:9px;font-weight:700;
  text-transform:uppercase;letter-spacing:.08em;border:1px solid;
}
.badge-g{background:rgba(5,150,105,0.08);color:var(--green);border-color:rgba(5,150,105,0.25);}
:root.dark-mode .badge-g{background:rgba(0,255,136,0.08);border-color:rgba(0,255,136,0.25);}
.badge-y{background:rgba(217,119,6,0.1);color:var(--amber);border-color:rgba(217,119,6,0.3);}
:root.dark-mode .badge-y{background:rgba(255,217,102,0.1);border-color:rgba(255,217,102,0.3);}
.badge-r{background:rgba(220,38,38,0.08);color:var(--red);border-color:rgba(220,38,38,0.25);}
:root.dark-mode .badge-r{background:rgba(255,61,90,0.08);border-color:rgba(255,61,90,0.25);}
.badge-b{background:rgba(8,145,178,0.08);color:var(--cyan);border-color:rgba(8,145,178,0.25);}
:root.dark-mode .badge-b{background:rgba(0,212,255,0.08);border-color:rgba(0,212,255,0.25);}
.badge-p{background:rgba(124,58,237,0.08);color:var(--purple);border-color:rgba(124,58,237,0.25);}
:root.dark-mode .badge-p{background:rgba(155,109,255,0.08);border-color:rgba(155,109,255,0.25);}
.badge-k{background:var(--bg3);color:var(--text2);border-color:var(--border);}

.dbar{display:flex;align-items:center;gap:8px;}
.dbar-track{flex:1;background:var(--bg3);border-radius:1px;height:4px;overflow:hidden;}
.dbar-fill{height:100%;border-radius:1px;transition:width .4s ease;}
.dbar-pct{font-family:var(--mono);font-size:10px;font-weight:700;min-width:30px;text-align:right;}

.tlight{width:28px;height:70px;background:var(--bg0);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;padding:5px;border:1px solid var(--border2);}
.tb{width:14px;height:14px;border-radius:50%;transition:all .4s;}
.tb-r{background:rgba(220,38,38,0.2);}
.tb-r.on{background:var(--red);box-shadow:0 0 8px var(--red);}
.tb-y{background:rgba(217,119,6,0.2);}
.tb-y.on{background:var(--amber);box-shadow:0 0 8px var(--amber);}
.tb-g{background:rgba(5,150,105,0.2);}
.tb-g.on{background:var(--green);box-shadow:0 0 8px var(--green);}

.signal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.sig-card{background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:12px;text-align:center;cursor:pointer;border-top:2px solid;transition:all .2s;}
.sig-card:hover{background:var(--bg2);}
.sig-card.sel{border-color:var(--amber)!important;background:rgba(217,119,6,0.05);}
:root.dark-mode .sig-card.sel{background:rgba(255,217,102,0.05);}
.sig-label{font-family:var(--mono);font-size:10px;color:var(--text1);margin-top:8px;font-weight:700;}
.sig-id{font-family:var(--mono);font-size:8px;color:var(--text2);margin-bottom:6px;}

.btn{
  display:inline-flex;align-items:center;gap:6px;padding:6px 13px;border-radius:4px;
  font-family:var(--mono);font-size:10px;font-weight:700;cursor:pointer;border:1px solid;
  transition:all .15s;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;
}
.btn-amber{background:rgba(217,119,6,0.12);color:var(--amber);border-color:rgba(217,119,6,0.35);}
:root.dark-mode .btn-amber{background:rgba(255,217,102,0.12);border-color:rgba(255,217,102,0.35);}
.btn-amber:hover{background:rgba(217,119,6,0.2);border-color:var(--amber);}
:root.dark-mode .btn-amber:hover{background:rgba(255,217,102,0.2);border-color:var(--amber);}
.btn-ghost{background:transparent;color:var(--text2);border-color:var(--border);}
.btn-ghost:hover{color:var(--text1);border-color:var(--border2);background:var(--bg3);}
.btn-red{background:rgba(220,38,38,0.1);color:var(--red);border-color:rgba(220,38,38,0.3);}
:root.dark-mode .btn-red{background:rgba(255,61,90,0.1);border-color:rgba(255,61,90,0.3);}
.btn-red:hover{background:rgba(220,38,38,0.2);border-color:var(--red);}
:root.dark-mode .btn-red:hover{background:rgba(255,61,90,0.2);border-color:var(--red);}
.btn-cyan{background:rgba(8,145,178,0.08);color:var(--cyan);border-color:rgba(8,145,178,0.3);}
:root.dark-mode .btn-cyan{background:rgba(0,212,255,0.08);border-color:rgba(0,212,255,0.3);}
.btn-cyan:hover{background:rgba(8,145,178,0.15);}
:root.dark-mode .btn-cyan:hover{background:rgba(0,212,255,0.15);}
.btn:disabled{opacity:.35;cursor:not-allowed;}

.field{margin-bottom:13px;}
.field label{display:block;font-family:var(--mono);font-size:9px;font-weight:700;color:var(--text2);letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px;}
.inp{width:100%;padding:8px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-family:var(--mono);font-size:12px;color:var(--text0);outline:none;transition:border-color .15s;}
.inp:focus{border-color:var(--amber);box-shadow:0 0 0 2px rgba(217,119,6,0.12);}
:root.dark-mode .inp:focus{box-shadow:0 0 0 2px rgba(255,217,102,0.12);}
.inp::placeholder{color:var(--text2);}
.sel{width:100%;padding:7px 11px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-family:var(--mono);font-size:11px;color:var(--text1);outline:none;cursor:pointer;}
.sel:focus{border-color:var(--amber);}

table{width:100%;border-collapse:collapse;font-size:11.5px;}
thead th{background:var(--bg2);padding:8px 12px;font-family:var(--mono);font-size:8.5px;font-weight:700;color:var(--text2);text-align:left;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid var(--border);white-space:nowrap;}
tbody tr{border-bottom:1px solid var(--border);transition:background .12s;}
tbody tr:last-child{border-bottom:none;}
tbody tr:hover{background:var(--bg2);}
tbody td{padding:8px 12px;vertical-align:middle;color:var(--text1);}
.mono-cell{font-family:var(--mono);font-size:10px;color:var(--text2);}

.alert{padding:8px 12px;border-radius:4px;border-left:3px solid;font-family:var(--mono);font-size:10px;margin-bottom:10px;display:flex;align-items:flex-start;gap:8px;}
.alert-w{background:rgba(217,119,6,0.07);border-color:var(--amber);color:var(--amber);}
:root.dark-mode .alert-w{background:rgba(232,160,32,0.07);border-color:var(--amber);}
.alert-e{background:rgba(220,38,38,0.07);border-color:var(--red);color:var(--red);}
:root.dark-mode .alert-e{background:rgba(255,61,90,0.07);border-color:var(--red);}
.alert-i{background:rgba(8,145,178,0.06);border-color:var(--cyan);color:var(--cyan);}
:root.dark-mode .alert-i{background:rgba(0,212,255,0.06);border-color:var(--cyan);}
.alert-ok{background:rgba(5,150,105,0.06);border-color:var(--green);color:var(--green);}
:root.dark-mode .alert-ok{background:rgba(0,255,136,0.06);border-color:var(--green);}

.tog{width:34px;height:18px;background:var(--bg3);border-radius:9px;position:relative;cursor:pointer;transition:background .2s;border:1px solid var(--border);}
.tog.on{background:rgba(217,119,6,0.2);border-color:rgba(217,119,6,0.4);}
:root.dark-mode .tog.on{background:rgba(255,217,102,0.2);border-color:rgba(255,217,102,0.4);}
.tog::after{content:'';position:absolute;width:12px;height:12px;background:var(--text2);border-radius:50%;top:2px;left:2px;transition:transform .2s,background .2s;}
.tog.on::after{transform:translateX(16px);background:var(--amber);}

input[type=range]{-webkit-appearance:none;width:100%;height:3px;background:var(--bg3);outline:none;cursor:pointer;border-radius:1px;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:var(--amber);cursor:pointer;border:2px solid var(--bg1);box-shadow:0 0 6px rgba(217,119,6,0.4);}
:root.dark-mode input[type=range]::-webkit-slider-thumb{box-shadow:0 0 6px rgba(255,217,102,0.4);}

.ct{background:var(--bg0);border:1px solid var(--border2);border-radius:4px;padding:8px 11px;font-family:var(--mono);font-size:10px;color:var(--text0);}
.ct-lbl{color:var(--text2);font-size:8.5px;margin-bottom:2px;letter-spacing:.1em;text-transform:uppercase;}

.login-shell{min-height:100vh;background:var(--bg0);display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden;}
:root.dark-mode .login-shell{background:var(--bg0);}
.login-shell::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 600px 600px at 30% 50%,rgba(217,119,6,0.04),transparent),radial-gradient(ellipse 400px 400px at 80% 20%,rgba(8,145,178,0.04),transparent);}
:root.dark-mode .login-shell::before{background:radial-gradient(ellipse 600px 600px at 30% 50%,rgba(255,217,102,0.04),transparent),radial-gradient(ellipse 400px 400px at 80% 20%,rgba(0,212,255,0.04),transparent);}
.login-grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:40px 40px;opacity:.18;}
.login-box{position:relative;z-index:2;width:100%;max-width:400px;}
.login-head{margin-bottom:24px;text-align:center;}
.login-logo{display:inline-flex;align-items:center;gap:12px;margin-bottom:14px;}
.login-logo-icon{width:42px;height:42px;border-radius:9px;background:linear-gradient(135deg,var(--amber),var(--amber2));display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:18px;font-weight:900;color:var(--bg0);box-shadow:0 0 20px rgba(217,119,6,0.3);}
:root.dark-mode .login-logo-icon{box-shadow:0 0 20px rgba(255,217,102,0.3);}
.login-title{font-family:var(--display);font-size:28px;font-weight:800;color:var(--text0);}
.login-sub{font-family:var(--mono);font-size:9.5px;color:var(--text2);letter-spacing:.12em;text-transform:uppercase;}
.login-card{background:var(--bg1);border:1px solid var(--border);border-radius:8px;padding:24px;}
.login-sep{display:flex;align-items:center;gap:10px;margin:14px 0;}
.login-sep span{font-family:var(--mono);font-size:8.5px;color:var(--text2);text-transform:uppercase;letter-spacing:.12em;white-space:nowrap;}
.login-sep::before,.login-sep::after{content:'';flex:1;height:1px;background:var(--border);}
.cred-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.cred-pill{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:7px 9px;cursor:pointer;transition:all .15s;text-align:left;}
.cred-pill:hover{border-color:var(--amber);background:rgba(217,119,6,0.05);}
:root.dark-mode .cred-pill:hover{background:rgba(255,217,102,0.05);}
.cred-role{font-family:var(--mono);font-size:8px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:.1em;margin-bottom:2px;}
.cred-id{font-family:var(--mono);font-size:10px;color:var(--text2);}
.pw-wrap{position:relative;}
.pw-wrap .inp{padding-right:36px;}
.eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text2);font-size:13px;}
.eye:hover{color:var(--amber);}
.login-footer-text{text-align:center;margin-top:14px;font-family:var(--mono);font-size:8.5px;color:var(--text2);letter-spacing:.08em;}
.login-submit{width:100%;padding:10px;background:linear-gradient(135deg,rgba(217,119,6,0.15),rgba(217,119,6,0.08));border:1px solid rgba(217,119,6,0.4);border-radius:4px;font-family:var(--mono);font-size:11px;font-weight:700;color:var(--amber);letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .15s;margin-top:2px;}
:root.dark-mode .login-submit{background:linear-gradient(135deg,rgba(255,217,102,0.15),rgba(255,217,102,0.08));border-color:rgba(255,217,102,0.4);}
.login-submit:hover{background:rgba(217,119,6,0.2);border-color:var(--amber);}
:root.dark-mode .login-submit:hover{background:rgba(255,217,102,0.2);}
.login-submit:disabled{opacity:.4;cursor:not-allowed;}

.detail-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);}
.detail-row:last-child{border-bottom:none;}
.detail-key{font-family:var(--mono);font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:.1em;}
.detail-val{font-family:var(--mono);font-size:11px;color:var(--text0);font-weight:700;}

#traffix-map{height:340px;border-radius:4px;border:1px solid var(--border);}
.leaflet-container{border-radius:4px;background:var(--bg1)!important;}
.leaflet-tile-pane{filter:brightness(0.9) contrast(1.1);}
:root.dark-mode .leaflet-tile-pane{filter:brightness(0.55) invert(1) contrast(3) hue-rotate(200deg) saturate(0.4) brightness(0.65);}
.leaflet-popup-content-wrapper{background:var(--bg1)!important;border:1px solid var(--border2)!important;box-shadow:0 8px 28px rgba(0,0,0,0.1)!important;color:var(--text0)!important;border-radius:6px!important;}
:root.dark-mode .leaflet-popup-content-wrapper{box-shadow:0 8px 28px rgba(0,0,0,0.6)!important;}
.leaflet-popup-tip{background:var(--bg1)!important;}

.emg-card{background:var(--bg1);border:1px solid var(--border);border-radius:6px;padding:14px;border-top:3px solid;transition:all .2s;margin-bottom:10px;}
.emg-card.active-c{border-top-color:var(--red);background:rgba(220,38,38,0.04);}
:root.dark-mode .emg-card.active-c{background:rgba(255,61,90,0.04);}
.emg-card.standby-c{border-top-color:var(--amber);}
.emg-card.disabled-c{border-top-color:var(--bg4);}

.sys-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
.sys-item{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:9px 11px;}
.sys-item-label{font-family:var(--mono);font-size:8px;color:var(--text2);text-transform:uppercase;letter-spacing:.12em;margin-bottom:3px;}
.sys-item-val{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--green);}

.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:300;backdrop-filter:blur(3px);}
.mob-overlay.open{display:block;}

@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .3s ease both;}

@media(max-width:900px){
  .sidebar{transform:translateX(-100%);}
  .sidebar.open{transform:translateX(0);}
  .main-area{margin-left:0;}
  .mob-menu{display:flex!important;}
  .kpi-strip{grid-template-columns:repeat(2,1fr);}
  .signal-grid{grid-template-columns:repeat(2,1fr);}
  .g2,.g13{grid-template-columns:1fr;}
  .g3{grid-template-columns:1fr 1fr;}
  .hide-mob{display:none!important;}
}
@media(max-width:500px){
  .kpi-strip{grid-template-columns:1fr 1fr;}
  .cred-grid{grid-template-columns:1fr;}
  .g3{grid-template-columns:1fr;}
  .signal-grid{grid-template-columns:repeat(2,1fr);}
}

/* Theme Toggle Button Styling */
.theme-toggle {
  width: 36px !important;
  height: 36px !important;
  border-radius: 4px !important;
  border: 1px solid var(--border) !important;
  background: var(--bg2) !important;
  color: var(--text1) !important;
  cursor: pointer;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease !important;
  font-size: 14px !important;
  flex-shrink: 0;
  padding: 0 !important;
}

.theme-toggle:hover {
  color: var(--amber) !important;
  background: var(--bg3) !important;
  border-color: var(--amber) !important;
}

.theme-toggle svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

/* Improved Dark Mode Text Visibility */
:root.dark-mode body { color: var(--text0); }
:root.dark-mode .text1 { color: var(--text0); }
:root.dark-mode .text2 { color: var(--text1); }
:root.dark-mode .page-header h1 { color: var(--text0); }
:root.dark-mode .kpi-value { color: var(--text0); }
:root.dark-mode .jrow-name { color: var(--text0); }

/* SVG Map Styling for Both Themes */
svg[viewBox="0 0 820 420"] {
  background: var(--bg0) !important;
}

:root.dark-mode svg[viewBox="0 0 820 420"] {
  background: #1A2235 !important;
}

/* Map SVG Text Size Increase */
svg[viewBox="0 0 820 420"] text {
  font-size: 9px !important;
  font-weight: 500 !important;
}

/* Junction Label Text Size */
.jrow-name {
  font-size: 13px !important;
}

.sig-label {
  font-size: 11px !important;
  font-weight: 600 !important;
}
`;

/* ─── DATA ─── */
const JUNCTIONS = [
  {id:"J-001",name:"Anna Salai – Mount Road",lat:13.0604,lng:80.2496,congestion:"Red",phase:"Red",density:82,vehicles:342,delay:8.2},
  {id:"J-002",name:"Koyambedu Interchange",lat:13.0713,lng:80.1946,congestion:"Yellow",phase:"Green",density:65,vehicles:210,delay:4.5},
  {id:"J-003",name:"T. Nagar – Usman Road",lat:13.0418,lng:80.2341,congestion:"Red",phase:"Red",density:90,vehicles:401,delay:11.3},
  {id:"J-004",name:"Vadapalani Junction",lat:13.0528,lng:80.2121,congestion:"Green",phase:"Green",density:48,vehicles:145,delay:2.1},
  {id:"J-005",name:"Guindy Industrial Estate",lat:13.0069,lng:80.2206,congestion:"Yellow",phase:"Yellow",density:55,vehicles:178,delay:3.8},
  {id:"J-006",name:"Adyar Signal",lat:13.0012,lng:80.2565,congestion:"Green",phase:"Green",density:38,vehicles:112,delay:1.5},
  {id:"J-007",name:"Egmore – NSC Bose Road",lat:13.0732,lng:80.2609,congestion:"Yellow",phase:"Yellow",density:74,vehicles:263,delay:5.9},
  {id:"J-008",name:"Tambaram Bypass",lat:12.9249,lng:80.1000,congestion:"Green",phase:"Green",density:30,vehicles:90,delay:1.2},
];
const HOURLY=[
  {h:"00",d:22,v:65,p:20},{h:"04",d:15,v:40,p:17},{h:"06",d:48,v:150,p:52},
  {h:"08",d:88,v:380,p:85},{h:"10",d:72,v:260,p:74},{h:"12",d:66,v:220,p:68},
  {h:"14",d:60,v:195,p:62},{h:"16",d:85,v:350,p:88},{h:"18",d:92,v:410,p:90},
  {h:"20",d:70,v:240,p:72},{h:"22",d:45,v:130,p:43},
];
const WEEKLY=[
  {day:"Mon",avg:72,peak:92},{day:"Tue",avg:68,peak:88},{day:"Wed",avg:75,peak:94},
  {day:"Thu",avg:78,peak:96},{day:"Fri",avg:82,peak:98},{day:"Sat",avg:55,peak:72},{day:"Sun",avg:40,peak:58},
];
const PIE_DATA=[
  {name:"Low",value:3,color:"#059669"},{name:"Moderate",value:2,color:"#D97706"},{name:"High",value:3,color:"#DC2626"},
];
const LOGS=[
  {id:"EVT-8841",time:"10:45:22",type:"AI Optimisation",junction:"Anna Salai (J-001)",details:"N-S phase extended +15s.",status:"Success"},
  {id:"EVT-8840",time:"10:12:05",type:"Manual Override",junction:"Egmore (J-007)",details:"All-red phase for VIP convoy.",status:"Warning"},
  {id:"EVT-8839",time:"09:30:00",type:"System Event",junction:"Network Wide",details:"ML model weights updated.",status:"Success"},
  {id:"EVT-8838",time:"08:15:44",type:"Sensor Alert",junction:"T. Nagar (J-003)",details:"E-bound camera occlusion.",status:"Error"},
  {id:"EVT-8837",time:"07:00:00",type:"Peak Transition",junction:"Network Wide",details:"Mode → Morning Rush.",status:"Success"},
  {id:"EVT-8836",time:"06:30:10",type:"AI Optimisation",junction:"Vadapalani (J-004)",details:"Off-peak compression -20s.",status:"Success"},
  {id:"EVT-8835",time:"18:45:00",type:"Emergency Override",junction:"Guindy (J-005)",details:"Ambulance corridor cleared.",status:"Success"},
];
const USERS=[
  {id:"USR-001",name:"Kabil R",role:"Super Admin",zone:"Central Command",status:"Active",last:"Today 09:12"},
  {id:"USR-002",name:"Anitha Sharma",role:"Traffic Engineer",zone:"Chennai North",status:"Active",last:"Today 08:45"},
  {id:"USR-003",name:"Rahul Menon",role:"Traffic Operator",zone:"Chennai South",status:"Active",last:"Today 07:30"},
  {id:"USR-004",name:"Priya Nair",role:"Emergency Authority",zone:"Rapid Response",status:"Suspended",last:"2026-03-05"},
  {id:"USR-005",name:"Suresh Kumar",role:"Traffic Engineer",zone:"Chennai West",status:"Active",last:"Today 10:01"},
];
const CREDS = {
  admin:{username:"admin",id:"USR-001",name:"Kabil R",role:"Super Admin",zone:"Central Command"},
  engineer:{username:"engineer",id:"USR-002",name:"Anitha Sharma",role:"Traffic Engineer",zone:"Chennai North"},
  operator:{username:"operator",id:"USR-003",name:"Rahul Menon",role:"Traffic Operator",zone:"Chennai South"},
  emergency:{username:"emergency",id:"USR-004",name:"Priya Nair",role:"Emergency Authority",zone:"Rapid Response"},
};
const ALL_TABS=[
  {id:"dashboard",label:"Command Centre",ico:"⬡",roles:["Super Admin","Traffic Engineer","Traffic Operator","Emergency Authority"]},
  {id:"map",label:"Live Map",ico:"◈",roles:["Super Admin","Traffic Engineer","Traffic Operator","Emergency Authority"]},
  {id:"analytics",label:"Analytics",ico:"▦",roles:["Super Admin","Traffic Engineer"]},
  {id:"signals",label:"Signal Control",ico:"◉",roles:["Super Admin","Traffic Engineer","Traffic Operator"]},
  {id:"emergency",label:"Emergency",ico:"⚠",roles:["Super Admin","Emergency Authority"],badge:true},
  {id:"history",label:"Audit Log",ico:"≡",roles:["Super Admin","Traffic Engineer"]},
  {id:"users",label:"Users",ico:"◎",roles:["Super Admin"]},
  {id:"settings",label:"Settings",ico:"◌",roles:["Super Admin"]},
];

/* ─── HELPERS ─── */
function congestColor(c){
  return c==="Red"?"#DC2626":c==="Yellow"?"#D97706":"#059669";
}

function badgeClass(s){
  const m={
    Red:"badge-r",Yellow:"badge-y",Green:"badge-g",
    Success:"badge-g",Warning:"badge-y",Error:"badge-r",
    Active:"badge-g",Suspended:"badge-r",
    "Super Admin":"badge-r","Traffic Engineer":"badge-b",
    "Traffic Operator":"badge-g","Emergency Authority":"badge-y",
  };
  return `badge ${m[s]||"badge-k"}`;
}

function DBar({value}){
  const c=value>75?"#DC2626":value>50?"#D97706":"#059669";
  return(
    <div className="dbar">
      <div className="dbar-track"><div className="dbar-fill" style={{width:`${value}%`,background:c}}/></div>
      <span className="dbar-pct" style={{color:c}}>{value}%</span>
    </div>
  );
}

function SdotFor({c}){
  return <div className={`sdot ${c==="Red"?"sdot-r":c==="Yellow"?"sdot-y":"sdot-g"}`}/>;
}

function CT({active,payload,label}){
  if(!active||!payload?.length) return null;
  return(
    <div className="ct">
      <div className="ct-lbl">{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color||"#FFFFFF",fontSize:10}}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
}

function Clock(){
  const [t,setT]=useState(null);
  useEffect(()=>{setT(new Date());const i=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(i);},[]);
  if(!t) return null;
  return <span>{t.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>;
}

/* ─── LOGIN ─── */
function Login({onLogin}){
  const [u,setU]=useState("");const [p,setP]=useState("");
  const [show,setShow]=useState(false);const [err,setErr]=useState("");const [ld,setLd]=useState(false);
  const submit=(e)=>{
    e.preventDefault();setErr("");setLd(true);
    setTimeout(()=>{
      const c=CREDS[u.trim().toLowerCase()];
      if(c&&p===u.trim().toLowerCase()){onLogin(c);}
      else{setErr("AUTHENTICATION FAILED — CHECK AUTHORITY ID AND PASSKEY");setLd(false);}
    },700);
  };
  return(
    <div className="login-shell">
      <div className="login-grid-bg"/>
      <div className="login-box fade-up">
        <div className="login-head">
          <div className="login-logo">
            <div className="login-logo-icon">TX</div>
            <div>
              <div className="login-title">TRAFFIX</div>
              <div className="login-sub">Smart Traffic Management System</div>
            </div>
          </div>
        </div>
        <div className="login-card">
          <div className="alert alert-i" style={{marginBottom:14,fontSize:9}}>
            🛡️ RESTRICTED SYSTEM — AUTHORISED PERSONNEL ONLY. ALL ACCESS IS AUDITED.
          </div>
          {err&&<div className="alert alert-e" style={{marginBottom:12,fontSize:9}}>{err}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Authority ID</label>
              <input className="inp" type="text" placeholder="admin / engineer / operator / emergency" value={u} onChange={e=>setU(e.target.value)} required autoComplete="username"/>
            </div>
            <div className="field">
              <label>Secure Passkey</label>
              <div className="pw-wrap">
                <input className="inp" type={show?"text":"password"} placeholder="Enter passkey" value={p} onChange={e=>setP(e.target.value)} required/>
                <button type="button" className="eye" onClick={()=>setShow(s=>!s)}>{show?"●":"○"}</button>
              </div>
            </div>
            <button className="login-submit" type="submit" disabled={ld}>{ld?"AUTHENTICATING…":"ACCESS TRAFFIX PORTAL"}</button>
          </form>
          <div className="login-sep"><span>Demo Credentials</span></div>
          <div className="cred-grid">
            {Object.keys(CREDS).map(id=>(
              <button key={id} className="cred-pill" onClick={()=>{setU(id);setP(id);}}>
                <div className="cred-role">{CREDS[id].role}</div>
                <div className="cred-id">{id} / {id}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="login-footer-text">SECURED · JWT HS256 · IT ACT 2000 · UNAUTHORIZED ACCESS PROSECUTABLE</div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ─── */
function Sidebar({tab,setTab,user,open,onClose,onLogout}){
  const tabs=ALL_TABS.filter((t)=>t.roles.includes(user.role));
  const initials=user.name.split(" ").map((n) =>n[0]).join("").slice(0,2).toUpperCase();
  return(
    <>
      {open&&<div className="mob-overlay open" onClick={onClose}/>}
      <aside className={`sidebar${open?" open":""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">TX</div>
            <span className="logo-text">TRAFFIX</span>
          </div>
          <div className="logo-sub">TN · Highways &amp; Traffic</div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          <div className="sidebar-section">
            <div className="sidebar-label">Navigation</div>
            {tabs.map((t)=>(
              <button key={t.id} className={`nav-btn${tab===t.id?" active":""}`} onClick={()=>{setTab(t.id);onClose();}}>
                <span className="nav-ico">{t.ico}</span>
                {t.label}
                {t.badge&&<span className="nav-badge">!</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-section" style={{marginTop:8}}>
            <div className="sidebar-label">System</div>
            <div style={{padding:"6px 18px",display:"flex",flexDirection:"column",gap:5}}>
              {[["Network","LIVE","var(--green)"],["Nodes",`${JUNCTIONS.length} Active`,"var(--amber)"],["Build","v3.2.1","var(--text2)"]].map(([k,v,c])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"var(--mono)",fontSize:8.5,color:"var(--text2)",textTransform:"uppercase",letterSpacing:".1em"}}>{k}</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:9,color:c,fontWeight:700}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-ava">{initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
            <button className="btn btn-ghost" style={{padding:"3px 7px",fontSize:9}} onClick={onLogout}>EXIT</button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ─── TOPBAR ─── */
function Topbar({tab,onMenuToggle}){
  const meta=ALL_TABS.find(t=>t.id===tab);
  return(
    <div className="topbar">
      <button className="mob-menu" onClick={onMenuToggle} style={{display:"none"}}>☰</button>
      <div className="topbar-path">
        <span>TRAFFIX</span> / {meta?.label||tab}
      </div>
      <div className="live-pill"><div className="live-dot"/>SYS LIVE</div>
      <div className="clock-box"><Clock/></div>
      <DarkModeToggle/>
    </div>
  );
}

/* ─── DASHBOARD ─── */
function Dashboard({onNav,junctions=JUNCTIONS,events=LOGS}){
  const [selJ,setSelJ]=useState(null);
  const heavy=junctions.filter((j)=>j.congestion==="Red").length;
  const avgDelay=(junctions.reduce((a,j)=>a+j.delay,0)/junctions.length).toFixed(1);
  const totalVeh=junctions.reduce((a,j)=>a+j.vehicles,0);
  const dotColor={Red:"#DC2626",Yellow:"#D97706",Green:"#059669"};
  const mapPos=[
    {j:junctions[3],cx:170,cy:240},{j:junctions[0],cx:340,cy:150},
    {j:junctions[6],cx:340,cy:240},{j:junctions[5],cx:340,cy:340},
    {j:junctions[1],cx:510,cy:150},{j:junctions[2],cx:510,cy:240},
    {j:junctions[4],cx:660,cy:240},{j:junctions[7],cx:660,cy:340},
  ];
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header">
          <h1>⬡ Command Centre</h1>
          <div className="accent-rule"/>
          <p>// REAL-TIME OVERVIEW · CHENNAI METROPOLITAN NETWORK</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={()=>onNav("map")}>OPEN MAP →</button>
        </div>
      </div>
      <div className="kpi-strip">
        {[
          {label:"Active Nodes",val:junctions.length,delta:"All operational",accent:"#059669"},
          {label:"Congested",val:heavy,delta:"High density",accent:"#DC2626"},
          {label:"Avg Delay",val:`${avgDelay}m`,delta:"vs 5.2m baseline",accent:"#D97706"},
          {label:"Vehicles",val:totalVeh.toLocaleString(),delta:"Monitored",accent:"#0891B2"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--kpi-accent":k.accent}}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.accent}}>{k.val}</div>
            <div className="kpi-delta">{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="g13" style={{marginBottom:12}}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Network Schematic — Chennai</div>
            <div style={{display:"flex",gap:10,fontSize:9,fontFamily:"var(--mono)"}}>
              {[["#059669","Low"],["#D97706","Med"],["#DC2626","High"]].map(([c,l])=>(
                <span key={l} style={{color:c,display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:c,display:"inline-block",boxShadow:`0 0 4px ${c}`}}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 820 420" style={{width:"100%"}}>
            {[50,150,250,350].map(y=><line key={y} x1="60" y1={y+50} x2="760" y2={y+50} stroke="var(--border2)" strokeWidth="1"/>)}
            {[170,340,510,660].map(x=><line key={x} x1={x} y1="50" x2={x} y2="390" stroke="var(--border2)" strokeWidth="1"/>)}
            {[["ECR",154],["NH-32",244],["OMR",344]].map(([l,y])=>(
              <text key={l} x="20" y={(y)+4} fontSize="9" fill="var(--text2)" fontFamily="'Space Mono',monospace" fontWeight="500">{l}</text>
            ))}
            {[[170,240,340,150],[340,150,510,150],[510,150,510,240],[340,240,510,240],[510,240,660,240],[340,150,340,240],[170,240,170,340],[660,240,660,340]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth="6" strokeLinecap="round"/>
            ))}
            {mapPos.filter(({j})=>Boolean(j)).map(({j,cx,cy})=>{
              const col=dotColor[j.congestion];const isSel=selJ?.id===j.id;
              return(
                <g key={j.id} style={{cursor:"pointer"}} onClick={()=>setSelJ((s)=>s?.id===j.id?null:j)}>
                  {j.congestion==="Red"&&<circle cx={cx} cy={cy} r="16" fill={col} opacity="0.1"><animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite"/></circle>}
                  <circle cx={cx} cy={cy} r={isSel?10:7} fill={col} stroke={isSel?"#fff":col} strokeWidth={isSel?2:0} style={{filter:`drop-shadow(0 0 ${j.congestion==="Red"?8:4}px ${col})`}}/>
                  <text x={cx} y={cy+20} textAnchor="middle" fontSize="9" fill="var(--text2)" fontFamily="'Space Mono',monospace" fontWeight="500">
                    {j.name.split("–")[0].split(" ").slice(0,2).join(" ")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">{selJ?"Junction Detail":"All Junctions"}</div>
            {selJ&&<button className="btn btn-ghost" style={{padding:"2px 7px",fontSize:9}} onClick={()=>setSelJ(null)}>✕ CLOSE</button>}
          </div>
          <div style={{padding:10,maxHeight:380,overflowY:"auto"}}>
            {!selJ?(
              <div className="jlist">
                {junctions.map((j)=>(
                  <div key={j.id} className="jrow" onClick={()=>setSelJ(j)}>
                    <SdotFor c={j.congestion}/>
                    <span className="jrow-id">{j.id}</span>
                    <span className="jrow-name">{j.name}</span>
                    <DBar value={j.density}/>
                  </div>
                ))}
              </div>
            ):(
              <div>
                <div style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:"var(--text0)",marginBottom:10,lineHeight:1.4}}>{selJ.name}</div>
                <div style={{marginBottom:10}}>
                  {[["ID",selJ.id],["Congestion",<span className={badgeClass(selJ.congestion)}>{selJ.congestion}</span>],["Phase",<span className={badgeClass(selJ.phase)}>{selJ.phase}</span>],["Vehicles",selJ.vehicles],["Delay",`${selJ.delay} min`]].map(([k,v],i)=>(
                    <div key={i} className="detail-row">
                      <span className="detail-key">{k}</span>
                      <span className="detail-val">{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:10}}>
                  <div className="detail-key" style={{marginBottom:5}}>Density</div>
                  <DBar value={selJ.density}/>
                </div>
                <button className="btn btn-amber" style={{width:"100%",justifyContent:"center",fontSize:9}} onClick={()=>onNav("signals")}>OPEN IN SIGNAL PANEL →</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Recent System Events</div>
          <button className="btn btn-ghost" style={{fontSize:9}} onClick={()=>onNav("history")}>VIEW ALL →</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>Time</th><th>Type</th><th>Junction</th><th className="hide-mob">Details</th><th>Status</th></tr></thead>
            <tbody>
              {events.slice(0,4).map((l)=>(
                <tr key={l.id}>
                  <td className="mono-cell">{l.time}</td>
                  <td><span className="badge badge-b">{l.type}</span></td>
                  <td style={{fontSize:11.5,color:"var(--text0)"}}>{l.junction}</td>
                  <td className="mono-cell hide-mob">{l.details}</td>
                  <td><span className={badgeClass(l.status)}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── MAP ─── */
let leafletLoader;
function MapPage({junctions=JUNCTIONS}){
  const mapRef=useRef(null);const leafletMap=useRef(null);
  const [loaded,setLoaded]=useState(false);const [err,setErr]=useState(false);
  const initMap=useCallback((L)=>{
    if(leafletMap.current||!mapRef.current||!L) return;
    const map=L.map(mapRef.current,{center:[13.0,80.22],zoom:11});
    leafletMap.current=map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© OSM',maxZoom:18}).addTo(map);
    const color={Red:"#DC2626",Yellow:"#D97706",Green:"#059669"};
    junctions.forEach((j)=>{
      const icon=L.divIcon({className:"",html:`<div style="width:12px;height:12px;border-radius:50%;background:${color[j.congestion]};border:2px solid #0D1117;box-shadow:0 0 8px ${color[j.congestion]};"></div>`,iconSize:[12,12],iconAnchor:[6,6]});
      L.marker([j.lat,j.lng],{icon}).addTo(map).bindPopup(`<b style="color:var(--text0);font-family:'Space Mono';font-size:12px;">${j.name}</b><br/><small style="color:var(--text2);font-family:'Space Mono';font-size:11px;">${j.id} · ${j.density}% · ${j.vehicles} veh</small>`);
    });
    setLoaded(true);
  },[junctions]);
  useEffect(()=>{
    let c=false;
    const go=async()=>{try{if(!leafletLoader)leafletLoader=import("leaflet");const mod=await leafletLoader;if(!c)initMap(mod.default??mod);}catch{if(!c)setErr(true);}};
    go();
    return()=>{c=true;if(leafletMap.current){leafletMap.current.remove();leafletMap.current=null;}};
  },[initMap]);
  // LSTM and RL integration planning
  // Backend: Add endpoints
  //   - POST /api/predict/lstm: Accepts historical and current traffic data, returns LSTM predictions
  //   - POST /api/optimize/rl: Accepts current junction state, returns optimized signal timings
  // Frontend:
  //   - Analytics page: Fetch LSTM predictions from backend, display in charts
  //   - Signals page: Fetch RL optimization results, update signal controls
  // Data flow:
  //   - Collect traffic data from sensors/API, store in backend
  //   - LSTM model trained on historical + real-time data
  //   - RL agent optimizes signal timings based on current state and reward feedback
  //   - UI updates with prediction and optimization results

  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>◈ Live Traffic Map</h1><div className="accent-rule"/><p>// INTERACTIVE JUNCTION MAP · CLICK MARKERS FOR DETAILS</p></div>
      </div>
      <div className="g13" style={{minHeight:"calc(100vh - 120px)"}}>
        <div className="panel" style={{height:"100%",minHeight:400,display:"flex",flexDirection:"column",flex:1}}>
          <div className="panel-head">
            <div className="panel-title">Chennai Network — Live</div>
            <div style={{display:"flex",gap:10,fontSize:9,fontFamily:"var(--mono)"}}>
              {[ ["#059669","Low"], ["#D97706","Med"], ["#DC2626","High"] ].map(([c,l])=>(
                <span key={l} style={{color:c,display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:c,display:"inline-block"}}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div style={{padding:10,position:"relative",flex:1}}>
            <div ref={mapRef} id="traffix-map" style={{height:"100%",minHeight:340}}/>
            {!loaded&&!err&&<div style={{position:"absolute",inset:10,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg2)",borderRadius:4,fontFamily:"var(--mono)",fontSize:11,color:"var(--text2)"}}>LOADING MAP…</div>}
            {err&&<div style={{position:"absolute",inset:10,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg2)",borderRadius:4,fontFamily:"var(--mono)",fontSize:11,color:"var(--red)"}}>⚠ MAP UNAVAILABLE</div>}
          </div>
        </div>
        <div className="panel" style={{alignSelf:"start",maxHeight:400,overflowY:"auto"}}>
          <div className="panel-head"><div className="panel-title">Junction Status</div></div>
          <div style={{padding:8}}>
            {junctions.map((j)=>(
              <div key={j.id} style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div>
                    <span className="mono-cell" style={{fontSize:8.5}}>{j.id}</span>
                    <div style={{fontSize:12,fontWeight:500,color:"var(--text0)",marginTop:1}}>{j.name.split("–")[0].trim()}</div>
                  </div>
                  <SdotFor c={j.congestion}/>
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

/* ─── ANALYTICS ─── */
function Analytics({junctions=JUNCTIONS}){
  const [range,setRange]=useState("24h");
  const total=junctions.reduce((a,j)=>a+j.vehicles,0);
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>▦ Analytics</h1><div className="accent-rule"/><p>// ML-POWERED DENSITY FORECASTING &amp; NETWORK EFFICIENCY</p></div>
        <div className="page-actions">
          {["1h","24h","7d","30d"].map(r=>(
            <button key={r} className={`btn ${range===r?"btn-amber":"btn-ghost"}`} onClick={()=>setRange(r)}>{r}</button>
          ))}
        </div>
      </div>
      <div className="kpi-strip">
        {[
          {label:"Efficiency",val:"92.4%",accent:"#059669",delta:"▲ +2.1% this week"},
          {label:"AI Actions",val:"1,402",accent:"#0891B2",delta:"Automated today"},
          {label:"Avg Delay",val:"4.2m",accent:"#D97706",delta:"▼ -0.8m baseline"},
          {label:"Vehicles",val:total.toLocaleString(),accent:"#7C3AED",delta:"Monitored today"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--kpi-accent":k.accent}}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.accent}}>{k.val}</div>
            <div className="kpi-delta">{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="g2" style={{marginBottom:12}}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Hourly Density vs Prediction</div>
            <div style={{display:"flex",gap:10,fontSize:9,fontFamily:"var(--mono)"}}>
              <span style={{color:"#0891B2"}}>── ACTUAL</span>
              <span style={{color:"#D97706"}}>-- PREDICTED</span>
            </div>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={HOURLY} margin={{top:5,right:5,bottom:0,left:-25}}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0891B2" stopOpacity={0.15}/><stop offset="95%" stopColor="#0891B2" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D97706" stopOpacity={0.1}/><stop offset="95%" stopColor="#D97706" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border2)"/>
                <XAxis dataKey="h" tick={{fontSize:8,fill:"var(--text2)",fontFamily:"Space Mono"}}/>
                <YAxis tick={{fontSize:8,fill:"var(--text2)",fontFamily:"Space Mono"}}/>
                <Tooltip content={<CT/>}/>
                <Area type="monotone" dataKey="d" name="Density%" stroke="#0891B2" strokeWidth={2} fill="url(#gA)"/>
                <Area type="monotone" dataKey="p" name="Prediction%" stroke="#D97706" strokeWidth={1.5} strokeDasharray="5 3" fill="url(#gP)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Congestion Distribution</div></div>
          <div className="panel-body" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart><Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">{PIE_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip formatter={(v,n)=>[`${v} nodes`,n]}/></PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%",marginTop:4}}>
              {PIE_DATA.map(d=>(
                <div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{display:"flex",alignItems:"center",gap:6,fontFamily:"var(--mono)",fontSize:9,color:"var(--text2)"}}>
                    <span style={{width:6,height:6,background:d.color,display:"inline-block",borderRadius:1,boxShadow:`0 0 5px ${d.color}`}}/>
                    {d.name.toUpperCase()}
                  </span>
                  <span style={{fontFamily:"var(--mono)",fontWeight:700,fontSize:10,color:d.color}}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="g2" style={{marginBottom:12}}>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Vehicle Count by Hour</div></div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={175}>
              <BarChart data={HOURLY} margin={{top:5,right:5,bottom:0,left:-25}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border2)"/>
                <XAxis dataKey="h" tick={{fontSize:8,fill:"var(--text2)",fontFamily:"Space Mono"}}/>
                <YAxis tick={{fontSize:8,fill:"var(--text2)",fontFamily:"Space Mono"}}/>
                <Tooltip content={<CT/>}/>
                <Bar dataKey="v" name="Vehicles" fill="#7C3AED" radius={[2,2,0,0]} opacity={0.8}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Weekly Peak vs Average</div></div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={175}>
              <LineChart data={WEEKLY} margin={{top:5,right:5,bottom:0,left:-25}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border2)"/>
                <XAxis dataKey="day" tick={{fontSize:8,fill:"var(--text2)",fontFamily:"Space Mono"}}/>
                <YAxis tick={{fontSize:8,fill:"var(--text2)",fontFamily:"Space Mono"}}/>
                <Tooltip content={<CT/>}/>
                <Legend wrapperStyle={{fontSize:9,fontFamily:"Space Mono"}}/>
                <Line type="monotone" dataKey="avg" name="Avg" stroke="#0891B2" strokeWidth={2} dot={{r:2,fill:"#0891B2"}}/>
                <Line type="monotone" dataKey="peak" name="Peak" stroke="#DC2626" strokeWidth={2} strokeDasharray="4 2" dot={{r:2,fill:"#DC2626"}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><div className="panel-title">Junction Performance Matrix</div></div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>ID</th><th>Junction</th><th style={{minWidth:120}}>Density</th><th>Congestion</th><th className="hide-mob">Vehicles</th><th className="hide-mob">Delay</th><th>Phase</th></tr></thead>
            <tbody>
              {junctions.map((j)=>(
                <tr key={j.id}>
                  <td className="mono-cell">{j.id}</td>
                  <td style={{color:"var(--text0)",fontWeight:500,fontSize:11}}>{j.name}</td>
                  <td><DBar value={j.density}/></td>
                  <td><span className={badgeClass(j.congestion)}>{j.congestion}</span></td>
                  <td className="mono-cell hide-mob">{j.vehicles}</td>
                  <td className="mono-cell hide-mob">{j.delay}m</td>
                  <td><span className={badgeClass(j.phase)}>{j.phase}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── SIGNALS ─── */
function Signals({junctions=JUNCTIONS,phases,setPhases,emergencyState,alerts}){
  const [sel,setSel]=useState(0);
  const [timings,setTimings]=useState(junctions.map(()=>({green:45,yellow:5,red:40})));
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    const id=setInterval(()=>{
      setPhases((prev)=>prev.map((phase,i)=>{
        if(emergencyState.disasterMode==="all-red") return "Red";
        if(emergencyState.disasterMode==="arterial-flush") return "Green";
        if(emergencyState.affectedNodes.includes(junctions[i]?.id)) return "Green";
        return Math.random()>.82?(phase==="Green"?"Yellow":phase==="Yellow"?"Red":"Green"):phase;
      }));
    },4000);
    return()=>clearInterval(id);
  },[junctions,emergencyState,setPhases]);
  const cycle=(i,e)=>{
    e.stopPropagation();
    if(emergencyState.disasterMode||emergencyState.affectedNodes.includes(junctions[i]?.id)) return;
    setPhases((p)=>{const n=[...p];n[i]=n[i]==="Green"?"Yellow":n[i]==="Yellow"?"Red":"Green";return n;});
  };
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>◉ Signal Control</h1><div className="accent-rule"/><p>// AI ADAPTIVE SIGNAL CONTROL · MANUAL OVERRIDES PERMANENTLY LOGGED</p></div>
      </div>
      <div className="alert alert-i">ℹ AI refreshes signals every 4s. Click a card to edit timing. CYCLE advances phase manually.</div>
      {emergencyState.activeCorridor&&<div className="alert alert-e">⚠ EMERGENCY OVERRIDE ACTIVE: {emergencyState.affectedNodes.join(" · ")}</div>}
      {emergencyState.disasterMode==="all-red"&&<div className="alert alert-e">⚠ DISASTER: ALL JUNCTIONS FORCED RED</div>}
      {emergencyState.disasterMode==="arterial-flush"&&<div className="alert alert-w">⚠ DISASTER: ARTERIAL FLUSH — ALL GREEN</div>}
      {alerts.slice(0,2).map((a)=><div key={a.id} className={`alert ${a.level==="danger"?"alert-e":"alert-w"}`}>{a.message}</div>)}
      <div className="signal-grid">
        {junctions.map((j,i)=>{
          const ph=emergencyState.disasterMode==="all-red"?"Red":emergencyState.disasterMode==="arterial-flush"||emergencyState.affectedNodes.includes(j.id)?"Green":phases[i];
          const bc=congestColor(ph);
          return(
            <div key={j.id} className={`sig-card${sel===i?" sel":""}`} style={{borderTopColor:bc}} onClick={()=>setSel(i)}>
              <div className="tlight" style={{margin:"0 auto 8px"}}>
                <div className={`tb tb-r${ph==="Red"?" on":""}`}/><div className={`tb tb-y${ph==="Yellow"?" on":""}`}/><div className={`tb tb-g${ph==="Green"?" on":""}`}/>
              </div>
              <div className="sig-id">{j.id}</div>
              <div className="sig-label">{j.name.split("–")[0].trim()}</div>
              <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
                <span className={badgeClass(ph)}>{ph}</span>
                {(emergencyState.affectedNodes.includes(j.id)||emergencyState.disasterMode)&&<span style={{fontSize:8,color:"var(--red)",fontFamily:"var(--mono)",fontWeight:700}}>FORCED</span>}
                <button className="btn btn-ghost" style={{fontSize:8.5,padding:"2px 7px",marginTop:2}} onClick={e=>cycle(i,e)} disabled={Boolean(emergencyState.disasterMode)||emergencyState.affectedNodes.includes(j.id)}>↻ CYCLE</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Timing Editor — {junctions[sel]?.name}</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {saved&&<span className="badge badge-g">✓ SAVED</span>}
            <button className="btn btn-amber" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}}>SAVE</button>
            <button className="btn btn-ghost">↺ AI DEFAULT</button>
          </div>
        </div>
        <div className="panel-body">
          <div className="g3">
            {[["green","#059669"],["yellow","#D97706"],["red","#DC2626"]].map(([k,c])=>(
              <div key={k}>
                <div className="field" style={{marginBottom:6}}>
                  <label style={{color:c}}>{k.toUpperCase()} PHASE</label>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <input type="range" min={5} max={90} value={(timings[sel])?.[k]??30} disabled={Boolean(emergencyState.disasterMode)||emergencyState.affectedNodes.includes(junctions[sel]?.id)} onChange={e=>{const n=[...timings];(n[sel])[k]=+e.target.value;setTimings(n);}}/>
                    <span style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:700,color:c,minWidth:34,textAlign:"right"}}>{(timings[sel])?.[k]??30}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="alert alert-ok" style={{marginTop:8,marginBottom:0}}>
            ✓ CYCLE: {((timings[sel])?.green??0)+((timings[sel])?.yellow??0)+((timings[sel])?.red??0)}s · GREEN RATIO: {Math.round((((timings[sel])?.green??0)/Math.max(1,((timings[sel])?.green??0)+((timings[sel])?.yellow??0)+((timings[sel])?.red??0)))*100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── EMERGENCY ─── */
function Emergency({role,junctions=JUNCTIONS,emergencyState,setEmergencyState,alerts}){
  const can=role==="Emergency Authority"||role==="Super Admin";
  const corridors=[
    {id:"c1",name:"Hospital Route Alpha (N–S)",nodes:["J-001","J-004","J-007"],status:"Standby"},
    {id:"c2",name:"Fire Dept Corridor (E–W)",nodes:["J-002","J-005"],status:"Active"},
    {id:"c3",name:"Evacuation Protocol Sigma",nodes:["All Network"],status:"Disabled"},
  ];
  const toggle=(c)=>setEmergencyState((prev)=>prev.activeCorridor===c.id?{activeCorridor:null,affectedNodes:[],disasterMode:null}:{activeCorridor:c.id,affectedNodes:c.nodes.includes("All Network")?junctions.map((j)=>j.id):c.nodes,disasterMode:null});
  const disaster=(mode) =>setEmergencyState({activeCorridor:null,affectedNodes:junctions.map((j)=>j.id),disasterMode:mode});
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1 style={{color:"var(--red)"}}>⚠ Emergency Command</h1><div className="accent-rule" style={{background:"linear-gradient(90deg,var(--red),transparent)"}}/><p>// CRITICAL OVERRIDE PROTOCOLS — AUTHORISED EMERGENCY PERSONNEL ONLY</p></div>
      </div>
      {!can&&<div className="alert alert-e">🔒 RESTRICTED — EMERGENCY AUTHORITY OR SUPER ADMIN CLEARANCE REQUIRED</div>}
      <div className="alert alert-w">⚠ ACTIVATING ANY PROTOCOL SUSPENDS AI OPTIMISATION AND IS PERMANENTLY LOGGED</div>
      {alerts.filter((a)=>a.scope==="emergency").map((a)=><div key={a.id} className={`alert ${a.level==="danger"?"alert-e":"alert-w"}`}>{a.message}</div>)}
      <div className="g2">
        <div className="panel" style={{borderTop:"2px solid var(--red)"}}>
          <div className="panel-head">
            <div className="panel-title" style={{color:"var(--red)"}}>Priority Corridor Preemption</div>
            {emergencyState.activeCorridor&&<span className="badge badge-r">● LIVE</span>}
          </div>
          <div className="panel-body" style={{display:"flex",flexDirection:"column",gap:8}}>
            {corridors.map(c=>{
              const isActive=emergencyState.activeCorridor===c.id;
              return(
                <div key={c.id} className={`emg-card ${isActive?"active-c":c.status==="Standby"?"standby-c":"disabled-c"}`}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,gap:7}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:12,color:"var(--text0)",marginBottom:2}}>{c.name}</div>
                      <div className="mono-cell">{c.nodes.join(" · ")}</div>
                    </div>
                    <span className={badgeClass(c.status==="Active"?"Red":c.status==="Standby"?"Yellow":"bk")}>{c.status.toUpperCase()}</span>
                  </div>
                  <button className={`btn ${isActive?"btn-red":"btn-ghost"}`} onClick={()=>toggle(c)} disabled={!can} style={{fontSize:9}}>
                    {isActive?"■ DEACTIVATE":"▶ INITIATE OVERRIDE"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel" style={{borderTop:"2px solid var(--amber)"}}>
          <div className="panel-head"><div className="panel-title" style={{color:"var(--amber)"}}>Disaster Protocols</div></div>
          <div className="panel-body">
            <p className="mono-cell" style={{marginBottom:12,lineHeight:1.7,fontSize:9.5}}>Disaster mode suspends AI network-wide. Requires Super Admin dual-authorisation.</p>
            {[
              {t:"Total System Flash",d:"All signals blink RED. Catastrophic failure.",c:"var(--red)",mode:"all-red"},
              {t:"All-Green Arterial Flush",d:"Open all arterials for mass evacuation.",c:"var(--amber)",mode:"arterial-flush"},
            ].map(it=>(
              <div key={it.t} style={{border:"1px solid var(--border)",borderRadius:4,padding:12,marginBottom:8,background:"var(--bg2)",borderLeft:`3px solid ${it.c}`}}>
                <div style={{fontFamily:"var(--mono)",fontWeight:700,marginBottom:3,fontSize:11,color:it.c}}>{it.t}</div>
                <p className="mono-cell" style={{fontSize:9.5,marginBottom:8}}>{it.d}</p>
                <button className="btn btn-ghost" style={{width:"100%",justifyContent:"center",color:it.c,borderColor:it.c,fontSize:9}} onClick={()=>disaster(it.mode)} disabled={role!=="Super Admin"}>
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

/* ─── HISTORY ─── */
function History({events=LOGS}){
  const [q,setQ]=useState("");const [tf,setTf]=useState("All");
  const types=["All","AI Optimisation","Manual Override","System Event","Sensor Alert","Emergency Override","Peak Transition"];
  const rows=events.filter((l)=>(tf==="All"||l.type===tf)&&((l.junction+l.type+l.details+(l.id||"")).toLowerCase().includes(q.toLowerCase())));
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>≡ Audit Log</h1><div className="accent-rule"/><p>// IMMUTABLE CHRONOLOGICAL RECORD — ALL AI DECISIONS &amp; OPERATOR ACTIONS</p></div>
        <div className="page-actions">
          <button className="btn btn-ghost hide-mob">↗ EXPORT CSV</button>
          <button className="btn btn-amber">PRINT</button>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"1 1 180px",minWidth:140}}>
          <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--text2)",fontSize:11,pointerEvents:"none"}}>⌕</span>
          <input className="inp" style={{paddingLeft:28}} type="text" placeholder="Search events…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="sel" style={{flex:"0 0 auto",minWidth:170}} value={tf} onChange={e=>setTf(e.target.value)}>
          {types.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="panel">
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th className="hide-mob">Event ID</th><th>Time</th><th>Type</th><th>Junction</th><th className="hide-mob">Details</th><th>Status</th></tr></thead>
            <tbody>
              {rows.length===0?(
                <tr><td colSpan={6} style={{textAlign:"center",padding:24,fontFamily:"var(--mono)",color:"var(--text2)",fontSize:10}}>NO EVENTS FOUND</td></tr>
              ):rows.map((l)=>(
                <tr key={l.id}>
                  <td className="mono-cell hide-mob">{l.id}</td>
                  <td className="mono-cell">{l.time}</td>
                  <td><span className="badge badge-b">{l.type}</span></td>
                  <td style={{color:"var(--text0)",fontSize:11.5}}>{l.junction}</td>
                  <td className="mono-cell hide-mob" style={{maxWidth:200}}>{l.details}</td>
                  <td><span className={badgeClass(l.status)}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",borderTop:"1px solid var(--border)",fontFamily:"var(--mono)",fontSize:9,color:"var(--text2)"}}>
          <span>SHOWING {rows.length} / {events.length} EVENTS</span>
          <div style={{display:"flex",gap:5}}>
            <button className="btn btn-ghost" style={{opacity:.5,fontSize:9}}>← PREV</button>
            <button className="btn btn-ghost" style={{fontSize:9}}>NEXT →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── USERS ─── */
function Users(){
  const [q,setQ]=useState("");const [rf,setRf]=useState("All");
  const roles=["All","Super Admin","Traffic Engineer","Traffic Operator","Emergency Authority"];
  const rows=USERS.filter(u=>(rf==="All"||u.role===rf)&&(u.name+u.id).toLowerCase().includes(q.toLowerCase()));
  // Modal state for new user
  const [showModal,setShowModal]=useState(false);
  const [newUser,setNewUser]=useState({id:"",name:"",role:"Traffic Operator",zone:"",status:"Active",last:"Never"});
  function handleAddUser(){
    if(!newUser.id||!newUser.name||!newUser.zone)return;
    USERS.push({...newUser});
    setShowModal(false);
    setNewUser({id:"",name:"",role:"Traffic Operator",zone:"",status:"Active",last:"Never"});
  }
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>◎ Users</h1><div className="accent-rule"/><p>// AUTHORITY ACCOUNTS · ROLES · ZONE ASSIGNMENTS</p></div>
        <div className="page-actions"><button className="btn btn-amber" onClick={()=>setShowModal(true)}>+ ADD USER</button></div>
      </div>
      <div className="kpi-strip" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[
          {label:"Total Accounts",val:USERS.length,accent:"#0891B2"},
          {label:"Active",val:USERS.filter(u=>u.status==="Active").length,accent:"#059669"},
          {label:"Privileged",val:USERS.filter(u=>["Super Admin","Emergency Authority"].includes(u.role)).length,accent:"#7C3AED"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{"--kpi-accent":k.accent}}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.accent}}>{k.val}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"1 1 180px",minWidth:140}}>
          <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--text2)",fontSize:11,pointerEvents:"none"}}>⌕</span>
          <input className="inp" style={{paddingLeft:28}} type="text" placeholder="Search users…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="sel" style={{flex:"0 0 auto",minWidth:200}} value={rf} onChange={e=>setRf(e.target.value)}>
          {roles.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="panel">
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th className="hide-mob">User ID</th><th>Name</th><th>Role</th><th className="hide-mob">Zone</th><th>Status</th><th className="hide-mob">Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map(u=>(
                <tr key={u.id}>
                  <td className="mono-cell hide-mob">{u.id}</td>
                  <td style={{color:"var(--text0)",fontWeight:600,fontSize:11.5}}>{u.name}</td>
                  <td><span className={badgeClass(u.role)}>{u.role}</span></td>
                  <td className="mono-cell hide-mob">{u.zone}</td>
                  <td><span className={badgeClass(u.status)}>{u.status}</span></td>
                  <td className="mono-cell hide-mob">{u.last}</td>
                  <td>
                    <div style={{display:"flex",gap:4}}>
                      <button className="btn btn-ghost" style={{fontSize:9}}>EDIT</button>
                      <button className="btn btn-ghost" style={{fontSize:9,color:u.status==="Active"?"var(--red)":"var(--green)",borderColor:u.status==="Active"?"rgba(220,38,38,0.3)":"rgba(5,150,105,0.3)"}}>{u.status==="Active"?"SUSPEND":"ACTIVATE"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",padding:32,borderRadius:8,minWidth:320,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:16}}>Add New User</h2>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <input className="inp" placeholder="User ID" value={newUser.id} onChange={e=>setNewUser({...newUser,id:e.target.value})}/>
              <input className="inp" placeholder="Name" value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})}/>
              <input className="inp" placeholder="Zone" value={newUser.zone} onChange={e=>setNewUser({...newUser,zone:e.target.value})}/>
              <select className="sel" value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
                {roles.filter(r=>r!=="All").map(r=><option key={r}>{r}</option>)}
              </select>
              <select className="sel" value={newUser.status} onChange={e=>setNewUser({...newUser,status:e.target.value})}>
                {["Active","Suspended"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-amber" onClick={handleAddUser}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SETTINGS ─── */
function Settings({settings,onSave,user}){
  const [ai,setAi]=useState(settings.autoOptimise);
  const [emg,setEmg]=useState(settings.emergencyBroadcast);
  const [log,setLog]=useState(settings.auditLogging);
  const [thr,setThr]=useState(settings.congestionThreshold);
  const [sync,setSync]=useState(settings.syncInterval);
  const [saved,setSaved]=useState(false);const [saving,setSaving]=useState(false);const [err,setErr]=useState("");
  useEffect(()=>{setAi(settings.autoOptimise);setEmg(settings.emergencyBroadcast);setLog(settings.auditLogging);setThr(settings.congestionThreshold);setSync(settings.syncInterval);},[settings]);
  const TogRow=({label,sub,v,onChg})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
      <div style={{flex:1,paddingRight:12}}>
        <div style={{fontFamily:"var(--mono)",fontSize:10.5,color:"var(--text0)",fontWeight:700,marginBottom:2}}>{label}</div>
        <div style={{fontFamily:"var(--mono)",fontSize:8.5,color:"var(--text2)"}}>{sub}</div>
      </div>
      <button className={`tog${v?" on":""}`} onClick={()=>onChg(!v)}/>
    </div>
  );
  const handleSave=async()=>{
    setSaving(true);setErr("");
    const ok=await onSave({autoOptimise:ai,emergencyBroadcast:emg,auditLogging:log,congestionThreshold:thr,syncInterval:sync});
    setSaving(false);
    if(!ok){setErr("SETTINGS COULD NOT BE PERSISTED. LOCAL VALUES RETAINED.");return;}
    setSaved(true);setTimeout(()=>setSaved(false),2500);
  };
  return(
    <div className="content fade-up">
      <div className="header-row">
        <div className="page-header"><h1>◌ Settings</h1><div className="accent-rule"/><p>// AI ENGINE · SECURITY · OPERATIONAL CONFIGURATION</p></div>
        <div className="page-actions">
          {saved&&<span className="badge badge-g">✓ SAVED</span>}
          <button className="btn btn-amber" onClick={handleSave} disabled={saving}>{saving?"SAVING…":"SAVE CHANGES"}</button>
        </div>
      </div>
      {err&&<div className="alert alert-e">{err}</div>}
      <div className="g2">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">AI Optimisation Engine</div></div>
          <div className="panel-body">
            <TogRow label="Auto-Optimise Signal Phases" sub="AI rebalances cycles without manual review" v={ai} onChg={setAi}/>
            {[["Congestion Alert Threshold",thr,setThr,40,95,"%"],["Telemetry Sync Interval",sync,setSync,2,30,"s"]].map(([l,v,s,mn,mx,u])=>(
              <div key={l} style={{padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontFamily:"var(--mono)",fontSize:10.5,color:"var(--text0)",fontWeight:700}}>{l}</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--amber)",fontWeight:700}}>{v}{u}</span>
                </div>
                <input type="range" min={mn} max={mx} value={v} onChange={e=>(s)(+e.target.value)}/>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Security &amp; Override</div></div>
          <div className="panel-body">
            <TogRow label="Emergency Broadcast Channel" sub="Hard-priority preemption broadcasting" v={emg} onChg={setEmg}/>
            <TogRow label="Immutable Audit Logging" sub="Full signal-control trace for compliance" v={log} onChg={setLog}/>
            <div style={{paddingTop:10}}>
              <div style={{fontFamily:"var(--mono)",fontSize:10.5,color:"var(--text0)",fontWeight:700,marginBottom:3}}>JWT Auth</div>
              <div className="mono-cell" style={{marginBottom:8}}>Algorithm: HS256 · Token TTL: 60 min</div>
              <button className="btn btn-red" style={{fontSize:9}}>ROTATE SECRET KEY</button>
            </div>
          </div>
        </div>
        <div className="panel" style={{gridColumn:"1 / -1"}}>
          <div className="panel-head"><div className="panel-title">System Status</div></div>
          <div className="panel-body">
            <div className="sys-grid">
              {[
                {l:"MongoDB Atlas",v:"Connected ✓",s:"traffix / cluster0"},
                {l:"Backend API",v:"Healthy ✓",s:"FastAPI · traffix-api.onrender.com"},
                {l:"Auth Service",v:"Active ✓",s:"JWT HS256 · TTL 60m"},
                {l:"Build",v:"v3.2.1",s:"2026.03 · Stable"},
              ].map(it=>(
                <div key={it.l} className="sys-item">
                  <div className="sys-item-label">{it.l}</div>
                  <div className="sys-item-val">{it.v}</div>
                  <div className="mono-cell" style={{fontSize:8.5,marginTop:2}}>{it.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT ─── */
export default function App(){
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("dashboard");
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [junctions,setJunctions]=useState(JUNCTIONS);
  const [events,setEvents]=useState(LOGS);
  const [settings,setSettings]=useState({autoOptimise:true,emergencyBroadcast:true,auditLogging:true,congestionThreshold:75,syncInterval:10});
  const [signalPhases,setSignalPhases]=useState(JUNCTIONS.map(j=>j.phase));
  const [emergencyState,setEmergencyState]=useState({activeCorridor:null,affectedNodes:[],disasterMode:null});

  useEffect(()=>{setSignalPhases(junctions.map(j=>j.phase));},[junctions]);

  const alerts=useMemo(()=>{
    const a=[];
    const severe=junctions.filter(j=>j.density>=settings.congestionThreshold);
    if(severe.length>=2) a.push({id:"net-cong",level:"danger",scope:"signals",message:`HIGH CONGESTION: ${severe.length} JUNCTIONS OVER ${settings.congestionThreshold}% THRESHOLD`});
    if(emergencyState.activeCorridor) a.push({id:"corr-ov",level:"danger",scope:"emergency",message:`EMERGENCY OVERRIDE ACTIVE ON CORRIDOR ${emergencyState.activeCorridor}`});
    if(emergencyState.disasterMode==="all-red") a.push({id:"dis-red",level:"danger",scope:"emergency",message:"ALL-RED DISASTER PROTOCOL ACTIVE"});
    if(emergencyState.disasterMode==="arterial-flush") a.push({id:"dis-flush",level:"warn",scope:"emergency",message:"ARTERIAL FLUSH PROTOCOL ACTIVE"});
    return a;
  },[junctions,settings.congestionThreshold,emergencyState,signalPhases]);

  const loadEvents=useCallback(async()=>{try{const r=await fetch("/api/events",{cache:"no-store"});if(!r.ok)return;const d=await r.json();if(Array.isArray(d)&&d.length)setEvents(d.map((e)=>({...e,id:e.id||e.eventId})));}catch{}},[]);

  useEffect(()=>{
    let c=false;
    const load=async()=>{try{const[jr,er,sr]=await Promise.all([fetch("/api/junctions",{cache:"no-store"}),fetch("/api/events",{cache:"no-store"}),fetch("/api/settings",{cache:"no-store"})]);if(!jr.ok||!er.ok||!sr.ok)return;const[jd,ed,sd]=await Promise.all([jr.json(),er.json(),sr.json()]);if(!c&&Array.isArray(jd)&&jd.length)setJunctions(jd);if(!c&&Array.isArray(ed)&&ed.length)setEvents(ed.map((e)=>({...e,id:e.id||e.eventId})));if(!c&&sd)setSettings((p)=>({...p,...sd}));}catch{}};
    load();return()=>{c=true;};
  },[]);

  const saveSettings=useCallback(async(next)=>{try{const r=await fetch("/api/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(next)});if(!r.ok)return false;const s=await r.json();setSettings((p)=>({...p,...s}));await loadEvents();return true;}catch{return false;}},[loadEvents]);
  async function postActivity(entry){try{await fetch("/api/activities",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(entry)});await loadEvents();}catch{}}
  const login=async(u)=>{setUser(u);setTab("dashboard");await postActivity({kind:"auth",actor:u.name,role:u.role,target:"Traffix",action:"auth.login",summary:`${u.name} signed in`,status:"Success"});};
  const logout=async()=>{const cu=user;setUser(null);setTab("dashboard");if(cu)await postActivity({kind:"auth",actor:cu.name,role:cu.role,target:"Traffix",action:"auth.logout",summary:`${cu.name} signed out`,status:"Success"});};

  const renderPage=()=>{
    switch(tab){
      case "dashboard": return <Dashboard onNav={setTab} junctions={junctions} events={events}/>;
      case "map":       return <MapPage junctions={junctions}/>;
      case "analytics": return <Analytics junctions={junctions}/>;
      case "signals":   return <Signals junctions={junctions} phases={signalPhases} setPhases={setSignalPhases} emergencyState={emergencyState} alerts={alerts}/>;
      case "emergency": return <Emergency role={user?.role} junctions={junctions} emergencyState={emergencyState} setEmergencyState={setEmergencyState} alerts={alerts}/>;
      case "history":   return <History events={events}/>;
      case "users":     return <Users/>;
      case "settings":  return <Settings settings={settings} onSave={saveSettings} user={user}/>;
      default:          return <Dashboard onNav={setTab} junctions={junctions} events={events}/>;
    }
  };

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}}/>
      {!user?(
        <Login onLogin={login}/>
      ):(
        <div className="app-shell">
          <Sidebar tab={tab} setTab={setTab} user={user} open={drawerOpen} onClose={()=>setDrawerOpen(false)} onLogout={logout}/>
          <div className="main-area">
            <Topbar tab={tab} onMenuToggle={()=>setDrawerOpen(o=>!o)}/>
            <main style={{flex:1}}>{renderPage()}</main>
            <footer style={{padding:"9px 20px",borderTop:"1px solid var(--border)",background:"var(--bg1)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5}}>
              <span style={{fontFamily:"var(--mono)",fontSize:8.5,color:"var(--text2)"}}>© 2026 GOVT OF TAMIL NADU · DEPT. OF HIGHWAYS &amp; TRAFFIC ENGINEERING</span>
              <span style={{fontFamily:"var(--mono)",fontSize:8.5,color:"var(--text2)"}}>TRAFFIX v3.2.1 · <a href="#" style={{color:"var(--amber)"}}>DISCLAIMER</a> · <a href="#" style={{color:"var(--amber)"}}>PRIVACY</a></span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}