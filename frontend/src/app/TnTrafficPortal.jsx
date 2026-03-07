"use client";

import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600;700&family=Noto+Sans:wght@300;400;500;600&family=Source+Code+Pro:wght@400;600&display=swap');
  :root {
    --tn-red:#8B1A1A;--tn-red-dark:#6B0F0F;--tn-navy:#1A3A6B;--tn-navy-light:#2A5298;
    --tn-gold:#C8960C;--tn-gold-light:#F0B429;
    --green:#16A34A;--yellow:#D97706;--red:#DC2626;
    --bg:#F8F6F1;--white:#FFFFFF;--border:#D1C9BC;--border-light:#E8E2D8;
    --text:#1A1A1A;--text-muted:#5A5450;--text-light:#8A7F76;
    --panel:#FFFFFF;--panel-alt:#F3F0EA;
    --shadow:0 1px 3px rgba(0,0,0,0.08),0 4px 12px rgba(0,0,0,0.04);
    --shadow-md:0 4px 16px rgba(0,0,0,0.1);
    --font-serif:'Noto Serif',Georgia,serif;
    --font-sans:'Noto Sans',sans-serif;
    --font-mono:'Source Code Pro',monospace;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:var(--font-sans);}
  ::-webkit-scrollbar{width:6px;height:6px;}
  ::-webkit-scrollbar-track{background:var(--border-light);}
  ::-webkit-scrollbar-thumb{background:var(--tn-red);border-radius:3px;}

  .tn-stripe{background:linear-gradient(135deg,var(--tn-red-dark) 0%,var(--tn-red) 50%,var(--tn-gold) 100%);height:5px;}
  .govt-header{background:var(--white);border-bottom:2px solid var(--tn-red);padding:10px 24px;display:flex;align-items:center;gap:16px;}
  .emblem{width:56px;height:56px;background:linear-gradient(135deg,var(--tn-red),var(--tn-gold));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 2px 8px rgba(139,26,26,0.3);flex-shrink:0;}
  .govt-title{flex:1;}
  .govt-title .dept{font-size:10px;color:var(--tn-red);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;}
  .govt-title h1{font-family:var(--font-serif);font-size:19px;font-weight:700;color:var(--tn-navy);line-height:1.2;}
  .govt-title .sub{font-size:11px;color:var(--text-muted);margin-top:2px;}
  .header-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;}
  .system-status{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--green);font-weight:600;}
  .pulse{width:7px;height:7px;border-radius:50%;background:var(--green);animation:blink 2s infinite;}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  .header-time{font-family:var(--font-mono);font-size:12px;color:var(--text-muted);}

  .nav-bar{background:var(--tn-navy);padding:0 24px;display:flex;align-items:center;border-bottom:3px solid var(--tn-gold);position:sticky;top:0;z-index:100;overflow-x:auto;}
  .nav-tab{padding:13px 16px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.65);cursor:pointer;border:none;background:none;border-bottom:3px solid transparent;margin-bottom:-3px;transition:all 0.2s;display:flex;align-items:center;gap:7px;white-space:nowrap;font-family:var(--font-sans);}
  .nav-tab:hover{color:var(--tn-gold-light);background:rgba(255,255,255,0.05);}
  .nav-tab.active{color:#fff;border-bottom-color:var(--tn-gold);background:rgba(255,255,255,0.08);}
  .nav-user{margin-left:auto;display:flex;align-items:center;gap:12px;padding-left:16px;flex-shrink:0;}
  .nav-logout{padding:7px 14px;background:rgba(139,26,26,0.5);border:1px solid rgba(200,150,12,0.4);color:#fff;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;transition:background 0.2s;font-family:var(--font-sans);}
  .nav-logout:hover{background:var(--tn-red);}

  .page{padding:24px 28px;max-width:1380px;margin:0 auto;}
  .breadcrumb{font-size:11px;color:var(--text-light);margin-bottom:6px;font-family:var(--font-mono);}
  .breadcrumb span{color:var(--tn-red);}
  .page-header{margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid var(--border);display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;}
  .page-header-left h2{font-family:var(--font-serif);font-size:22px;font-weight:700;color:var(--tn-navy);display:flex;align-items:center;gap:10px;}
  .page-header-left p{color:var(--text-muted);font-size:13px;margin-top:3px;}

  .card{background:var(--panel);border:1px solid var(--border);border-radius:6px;box-shadow:var(--shadow);}
  .card-header{padding:13px 18px;border-bottom:1px solid var(--border-light);display:flex;align-items:center;justify-content:space-between;}
  .card-header h3{font-family:var(--font-serif);font-size:14px;font-weight:700;color:var(--tn-navy);display:flex;align-items:center;gap:8px;}
  .card-body{padding:18px;}

  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
  .kpi-card{background:var(--white);border:1px solid var(--border);border-radius:6px;padding:18px;border-left:4px solid;box-shadow:var(--shadow);}
  .kpi-label{font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-light);font-weight:600;margin-bottom:5px;}
  .kpi-value{font-family:var(--font-serif);font-size:30px;font-weight:700;line-height:1;}
  .kpi-sub{font-size:11px;margin-top:5px;color:var(--text-muted);}

  .badge{display:inline-flex;align-items:center;gap:3px;padding:2px 9px;border-radius:3px;font-size:11px;font-weight:600;border:1px solid;white-space:nowrap;}
  .badge-green{background:#F0FDF4;color:#16A34A;border-color:#BBF7D0;}
  .badge-yellow{background:#FFFBEB;color:#D97706;border-color:#FDE68A;}
  .badge-red{background:#FEF2F2;color:#DC2626;border-color:#FECACA;}
  .badge-blue{background:#EFF6FF;color:#1D4ED8;border-color:#BFDBFE;}
  .badge-grey{background:#F9FAFB;color:#6B7280;border-color:#E5E7EB;}

  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid;transition:all 0.2s;font-family:var(--font-sans);white-space:nowrap;}
  .btn-primary{background:var(--tn-navy);color:#fff;border-color:var(--tn-navy);}
  .btn-primary:hover{background:var(--tn-navy-light);}
  .btn-danger{background:var(--tn-red);color:#fff;border-color:var(--tn-red);}
  .btn-ghost{background:transparent;color:var(--tn-navy);border-color:var(--border);}
  .btn-ghost:hover{background:var(--panel-alt);}
  .btn-sm{padding:5px 11px;font-size:12px;}
  .btn:disabled{opacity:0.5;cursor:not-allowed;}

  .table-wrap{overflow-x:auto;border-radius:6px;border:1px solid var(--border);}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  thead th{background:var(--tn-navy);color:#fff;padding:11px 14px;text-align:left;font-weight:600;font-size:12px;letter-spacing:0.04em;white-space:nowrap;}
  tbody tr{border-bottom:1px solid var(--border-light);transition:background 0.15s;}
  tbody tr:last-child{border-bottom:none;}
  tbody tr:hover{background:#F9F7F3;}
  tbody td{padding:11px 14px;vertical-align:middle;}
  .mono{font-family:var(--font-mono);font-size:12px;}

  .form-group{margin-bottom:16px;}
  .form-label{display:block;font-size:13px;font-weight:600;color:var(--tn-navy);margin-bottom:5px;}
  .form-input{width:100%;padding:9px 13px;border:1px solid var(--border);border-radius:4px;font-size:14px;background:var(--white);color:var(--text);font-family:var(--font-sans);transition:border-color 0.2s;outline:none;}
  .form-input:focus{border-color:var(--tn-navy);box-shadow:0 0 0 2px rgba(26,58,107,0.1);}
  .form-select{width:100%;padding:9px 13px;border:1px solid var(--border);border-radius:4px;font-size:14px;background:var(--white);color:var(--text);cursor:pointer;font-family:var(--font-sans);outline:none;}

  .alert{padding:11px 15px;border-radius:4px;border-left:4px solid;font-size:13px;margin-bottom:14px;}
  .alert-warning{background:#FFFBEB;border-color:#D97706;color:#92400E;}
  .alert-danger{background:#FEF2F2;border-color:#DC2626;color:#991B1B;}
  .alert-info{background:#EFF6FF;border-color:#1D4ED8;color:#1E40AF;}
  .alert-success{background:#F0FDF4;border-color:#16A34A;color:#166534;}

  .traffic-light{width:40px;height:100px;background:#1a1a1a;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;padding:7px;border:2px solid #333;margin:0 auto;}
  .tl-bulb{width:22px;height:22px;border-radius:50%;transition:all 0.5s;}
  .tl-r{background:#3a1212;}.tl-r.on{background:#EF4444;box-shadow:0 0 14px #EF4444;}
  .tl-y{background:#2e2410;}.tl-y.on{background:#F59E0B;box-shadow:0 0 12px #F59E0B;}
  .tl-g{background:#0f2e18;}.tl-g.on{background:#22C55E;box-shadow:0 0 14px #22C55E;}

  .map-container{background:#EDE8DF;border:1px solid var(--border);border-radius:6px;position:relative;overflow:hidden;}
  .map-road-h{position:absolute;left:0;right:0;background:rgba(120,90,40,0.22);}
  .map-road-v{position:absolute;top:0;bottom:0;background:rgba(120,90,40,0.22);}
  .map-junction{position:absolute;transform:translate(-50%,-50%);cursor:pointer;display:flex;flex-direction:column;align-items:center;}
  .map-dot{width:15px;height:15px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 8px currentColor;transition:transform 0.2s;}
  .map-dot:hover{transform:scale(1.5);}
  .map-dot.g{background:#16A34A;color:#16A34A;}
  .map-dot.y{background:#D97706;color:#D97706;}
  .map-dot.r{background:#DC2626;color:#DC2626;animation:jp 1.5s infinite;}
  @keyframes jp{0%,100%{box-shadow:0 0 6px currentColor}50%{box-shadow:0 0 18px currentColor}}
  .map-lbl{font-size:9px;color:#5A5450;white-space:nowrap;margin-top:3px;font-family:var(--font-mono);max-width:70px;text-overflow:ellipsis;overflow:hidden;text-align:center;}

  .search-wrap{position:relative;}
  .search-wrap input{padding-left:34px;}
  .search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:13px;}

  .login-page{min-height:100vh;background:var(--bg);display:flex;flex-direction:column;}
  .login-body{flex:1;display:flex;align-items:center;justify-content:center;padding:32px 20px;}
  .login-card{background:var(--white);border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow-md);width:100%;max-width:450px;overflow:hidden;}
  .login-card-top{background:var(--tn-navy);padding:26px 28px;text-align:center;position:relative;}
  .login-card-top::after{content:'';position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--tn-red),var(--tn-gold),var(--tn-red));}
  .login-card-body{padding:28px;}
  .login-card-footer{background:#F3F0EA;color:var(--text-muted);text-align:center;padding:11px;font-size:11px;border-top:1px solid var(--border-light);}

  .tn-footer{background:var(--tn-navy);color:rgba(255,255,255,0.55);padding:16px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:11px;}
  .tn-footer a{color:var(--tn-gold-light);text-decoration:none;}

  input[type="range"]{width:100%;accent-color:var(--tn-navy);cursor:pointer;}
  input[type="checkbox"]{accent-color:var(--tn-navy);width:15px;height:15px;cursor:pointer;}

  @media(max-width:860px){
    .kpi-grid{grid-template-columns:repeat(2,1fr);}
    .page{padding:14px;}
  }
`;

// ── DATA ─────────────────────────────────────────────────────────────────────
const JUNCTIONS = [
  {id:"J-001",name:"Anna Salai – Mount Road",    congestion:"Red",   phase:"Red",   density:82,vehicles:342,delay:"8.2 min"},
  {id:"J-002",name:"Koyambedu Interchange",       congestion:"Yellow",phase:"Green", density:65,vehicles:210,delay:"4.5 min"},
  {id:"J-003",name:"T. Nagar – Usman Road",       congestion:"Red",   phase:"Red",   density:90,vehicles:401,delay:"11.3 min"},
  {id:"J-004",name:"Vadapalani Junction",          congestion:"Green", phase:"Green", density:48,vehicles:145,delay:"2.1 min"},
  {id:"J-005",name:"Guindy Industrial Estate",     congestion:"Yellow",phase:"Yellow",density:55,vehicles:178,delay:"3.8 min"},
  {id:"J-006",name:"Adyar Signal",                 congestion:"Green", phase:"Green", density:38,vehicles:112,delay:"1.5 min"},
  {id:"J-007",name:"Egmore – NSC Bose Road",       congestion:"Yellow",phase:"Yellow",density:74,vehicles:263,delay:"5.9 min"},
  {id:"J-008",name:"Tambaram Bypass",              congestion:"Green", phase:"Green", density:30,vehicles:90, delay:"1.2 min"},
];
const LOGS = [
  {id:"EVT-8841",time:"2026-03-07 10:45:22",type:"AI Optimisation",   junction:"Anna Salai – Mount Road (J-001)",  details:"N-S phase extended +15s due to high surge.",          status:"Success"},
  {id:"EVT-8840",time:"2026-03-07 10:12:05",type:"Manual Override",   junction:"Egmore – NSC Bose Road (J-007)",   details:"Operator requested all-red phase for VIP convoy.",    status:"Warning"},
  {id:"EVT-8839",time:"2026-03-07 09:30:00",type:"System Event",      junction:"Network Wide",                     details:"ML model weights updated and deployed.",              status:"Success"},
  {id:"EVT-8838",time:"2026-03-07 08:15:44",type:"Sensor Alert",      junction:"T. Nagar – Usman Road (J-003)",    details:"Eastbound camera occlusion. Confidence <40%.",        status:"Error"},
  {id:"EVT-8837",time:"2026-03-07 07:00:00",type:"Peak Transition",   junction:"Network Wide",                     details:"Global mode switched to Morning Rush Hour.",          status:"Success"},
  {id:"EVT-8836",time:"2026-03-06 22:30:10",type:"AI Optimisation",   junction:"Vadapalani Junction (J-004)",      details:"Off-peak compression. Green phase reduced 20s.",      status:"Success"},
  {id:"EVT-8835",time:"2026-03-06 18:45:00",type:"Emergency Override", junction:"Guindy Industrial (J-005)",       details:"Ambulance corridor cleared. Priority route 6 mins.",  status:"Success"},
];
const USERS = [
  {id:"USR-001",name:"Kabil R",       email:"kabil@tn.trafficdept.gov.in",    role:"Super Admin",        zone:"Central Command",    status:"Active",   last:"Today 09:12"},
  {id:"USR-002",name:"Anitha Sharma", email:"anitha.s@tn.trafficdept.gov.in", role:"Traffic Engineer",   zone:"Chennai North",      status:"Active",   last:"Today 08:45"},
  {id:"USR-003",name:"Rahul Menon",   email:"r.menon@tn.trafficdept.gov.in",  role:"Traffic Operator",   zone:"Chennai South",      status:"Active",   last:"Today 07:30"},
  {id:"USR-004",name:"Priya Nair",    email:"p.nair@tn.trafficdept.gov.in",   role:"Emergency Authority",zone:"Rapid Response Unit", status:"Suspended",last:"2026-03-05"},
  {id:"USR-005",name:"Suresh Kumar",  email:"suresh.k@tn.trafficdept.gov.in", role:"Traffic Engineer",   zone:"Chennai West",       status:"Active",   last:"Today 10:01"},
];
const CREDS = {admin:"Super Admin",engineer:"Traffic Engineer",operator:"Traffic Operator",emergency:"Emergency Authority"};

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Clock() {
  const [t,setT] = useState(new Date());
  useEffect(() => { const id=setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(id); },[]);
  return <span className="header-time">{t.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"medium"})}</span>;
}

function GovtHeader() {
  return (
    <>
      <div className="tn-stripe"/>
      <div className="govt-header">
        <div className="emblem">🚦</div>
        <div className="govt-title">
          <div className="dept">Government of Tamil Nadu · Department of Highways &amp; Traffic Engineering</div>
          <h1>Traffix — Smart Traffic Management System</h1>
          <div className="sub">Integrated Urban Traffic Monitoring, Prediction &amp; Signal Control Platform · Chennai Metropolitan Area</div>
        </div>
        <div className="header-right">
          <div className="system-status"><div className="pulse"/> SYSTEM OPERATIONAL</div>
          <Clock/>
        </div>
      </div>
    </>
  );
}

function Badge({type}) {
  const m={Red:"badge-red",Yellow:"badge-yellow",Green:"badge-green",Success:"badge-green",Warning:"badge-yellow",Error:"badge-red",Active:"badge-green",Suspended:"badge-red","Super Admin":"badge-red","Traffic Engineer":"badge-blue","Traffic Operator":"badge-green","Emergency Authority":"badge-yellow"};
  return <span className={`badge ${m[type]||"badge-grey"}`}>{type}</span>;
}

function DensityBar({value}) {
  const color=value>75?"var(--red)":value>50?"var(--yellow)":"var(--green)";
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,background:"var(--border-light)",borderRadius:3,height:8}}>
        <div style={{width:`${value}%`,height:"100%",borderRadius:3,background:color,transition:"width 0.5s"}}/>
      </div>
      <span className="mono" style={{width:32}}>{value}%</span>
    </div>
  );
}

// ── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({onLogin}) {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const handle=(e)=>{
    e.preventDefault(); setLoading(true); setError("");
    setTimeout(()=>{
      const role=CREDS[username.toLowerCase()];
      if(role && password===username.toLowerCase()){onLogin({username,role});}
      else{setError("Invalid Authority ID or Passkey. Please contact your system administrator.");setLoading(false);}
    },700);
  };

  return (
    <div className="login-page">
      <GovtHeader/>
      <div className="login-body">
        <div className="login-card">
          <div className="login-card-top">
            <div style={{fontSize:38,marginBottom:8}}>🔒</div>
            <h2 style={{fontFamily:"var(--font-serif)",fontSize:18,fontWeight:700,color:"#fff"}}>Authorised Personnel Login</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:3}}>Traffix Integrated Traffic Management Portal</p>
          </div>
          <div className="login-card-body">
            <div className="alert alert-info">🛡️ Restricted to authorised City Traffic Control personnel. All access is logged.</div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handle}>
              <div className="form-group">
                <label className="form-label">Authority ID / Username</label>
                <input className="form-input" type="text" placeholder="e.g. admin, engineer, operator" value={username} onChange={e=>setUsername(e.target.value)} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Secure Passkey</label>
                <input className="form-input" type="password" placeholder="Enter your passkey" value={password} onChange={e=>setPassword(e.target.value)} required/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,fontSize:13}}>
                <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}><input type="checkbox"/> Remember this device</label>
                <a href="#" style={{color:"var(--tn-navy)",textDecoration:"none"}}>Forgot passkey?</a>
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{width:"100%",justifyContent:"center",padding:"11px"}}>
                {loading?"⏳ Authenticating...":"🔓 Access Traffix Portal"}
              </button>
            </form>
            <div style={{marginTop:20,padding:"11px 14px",background:"var(--panel-alt)",borderRadius:4,border:"1px solid var(--border-light)"}}>
              <p style={{fontSize:10,color:"var(--text-muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Demo Credentials (username = password)</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,fontSize:11,fontFamily:"var(--font-mono)",color:"var(--text-muted)"}}>
                {Object.keys(CREDS).map(k=><span key={k}>👤 {k} / {k}</span>)}
              </div>
            </div>
          </div>
          <div className="login-card-footer">Powered by TN Highways Dept · Unauthorised access is punishable under IT Act 2000</div>
        </div>
      </div>
      <footer className="tn-footer">
        <span>© 2026 Government of Tamil Nadu — Department of Highways &amp; Traffic Engineering</span>
        <span>Traffix v3.2.1 · <a href="#">Privacy Policy</a> · <a href="#">Disclaimer</a></span>
      </footer>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage() {
  const [sel,setSel]=useState(null);
  const congested=JUNCTIONS.filter(j=>j.congestion==="Red").length;
  const avgDelay=(JUNCTIONS.reduce((a,j)=>a+parseFloat(j.delay),0)/JUNCTIONS.length).toFixed(1);
  const mapJ=[
    {x:"18%",y:"55%",j:JUNCTIONS[3]},{x:"38%",y:"28%",j:JUNCTIONS[0]},
    {x:"38%",y:"55%",j:JUNCTIONS[6]},{x:"38%",y:"78%",j:JUNCTIONS[5]},
    {x:"60%",y:"28%",j:JUNCTIONS[1]},{x:"60%",y:"55%",j:JUNCTIONS[2]},
    {x:"78%",y:"55%",j:JUNCTIONS[4]},{x:"78%",y:"78%",j:JUNCTIONS[7]},
  ];
  return (
    <div className="page">
      <div className="breadcrumb">Home › <span>City Command Centre</span></div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>🗺️ City Command Centre</h2>
          <p>Real-time holistic view of all active traffic junctions and congestion levels across the network.</p>
        </div>
      </div>
      <div className="kpi-grid">
        {[
          {label:"Active Junctions",val:JUNCTIONS.length,color:"var(--tn-navy)",sub:"All operational ▲"},
          {label:"Congested Nodes",val:congested,color:"var(--red)",sub:"Heavy density detected"},
          {label:"Avg Network Delay",val:`${avgDelay}m`,color:"var(--yellow)",sub:"▼ -0.8m from baseline"},
          {label:"AI Interventions",val:"1,402",color:"var(--tn-gold)",sub:"Automated changes today"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{borderLeftColor:k.color}}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.color}}>{k.val}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:18}}>
        <div className="card">
          <div className="card-header">
            <h3>📍 Live Junction Map — Chennai Metropolitan Area</h3>
            <div style={{display:"flex",gap:12,fontSize:11}}>
              {[["var(--green)","Low"],["var(--yellow)","Moderate"],["var(--red)","Heavy"]].map(([c,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:5,color:c}}>
                  <span style={{width:9,height:9,borderRadius:"50%",background:c,display:"inline-block"}}/>{l}
                </span>
              ))}
            </div>
          </div>
          <div style={{padding:0}}>
            <div className="map-container" style={{height:360}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#EDE8DF,#F5F0E8 50%,#EDE8DF)",zIndex:0}}/>
              <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(139,90,43,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(139,90,43,0.06) 1px,transparent 1px)",backgroundSize:"38px 38px",zIndex:1}}/>
              {[28,55,78].map(t=><div key={`h${t}`} className="map-road-h" style={{top:`${t}%`,height:7,zIndex:2}}/>)}
              {[18,38,60,78].map(l=><div key={`v${l}`} className="map-road-v" style={{left:`${l}%`,width:7,zIndex:2}}/>)}
              {mapJ.map(({x,y,j})=>(
                <div key={j.id} className="map-junction" style={{left:x,top:y,zIndex:10}} onClick={()=>setSel(sel?.id===j.id?null:j)}>
                  <div className={`map-dot ${j.congestion==="Red"?"r":j.congestion==="Yellow"?"y":"g"}`} title={j.name}/>
                  <div className="map-lbl">{j.name.split("–")[0].trim()}</div>
                </div>
              ))}
              <div style={{position:"absolute",top:8,left:10,zIndex:20,background:"rgba(255,255,255,0.92)",border:"1px solid var(--border)",borderRadius:4,padding:"3px 9px",fontSize:10,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>
                Greater Chennai Metropolitan Area
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>{sel?"📊 Junction Detail":"📋 All Junctions"}</h3>
            {sel && <button className="btn btn-ghost btn-sm" onClick={()=>setSel(null)}>← Back</button>}
          </div>
          <div style={{padding:14}}>
            {!sel ? (
              <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:320,overflowY:"auto"}}>
                {JUNCTIONS.map(j=>(
                  <div key={j.id} onClick={()=>setSel(j)} style={{padding:"9px 11px",border:"1px solid var(--border-light)",borderRadius:5,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--panel-alt)"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#E8E2D6"}
                    onMouseLeave={e=>e.currentTarget.style.background="var(--panel-alt)"}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--tn-navy)"}}>{j.name}</div>
                      <div className="mono" style={{fontSize:10,color:"var(--text-muted)"}}>{j.id}</div>
                    </div>
                    <Badge type={j.congestion}/>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{fontWeight:700,color:"var(--tn-navy)",fontSize:13,marginBottom:12}}>{sel.name}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[["ID",sel.id,"mono"],["Congestion",<Badge type={sel.congestion}/>,""],["Vehicles",sel.vehicles,""],["Delay",sel.delay,""],["Density",`${sel.density}%`,""],["Phase",<Badge type={sel.phase}/>,""]].map(([k,v,cls])=>(
                    <div key={k} style={{background:"var(--panel-alt)",borderRadius:4,padding:"8px 10px"}}>
                      <div style={{fontSize:9,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{k}</div>
                      <div className={cls==="mono"?"mono":""} style={{fontSize:13,fontWeight:600}}>{v}</div>
                    </div>
                  ))}
                </div>
                <DensityBar value={sel.density}/>
                <button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center",marginTop:12}}>Manage Junction</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const [range,setRange]=useState("24h");
  const hourBars=[30,20,85,95,65,55,90,88,50,35];
  const hourLabels=["00","04","08","10","12","14","16","18","20","22"];
  const weekBars=[{d:"Mon",v:80},{d:"Tue",v:75},{d:"Wed",v:85},{d:"Thu",v:90},{d:"Fri",v:95},{d:"Sat",v:60},{d:"Sun",v:50}];
  const maxH=Math.max(...hourBars);
  return (
    <div className="page">
      <div className="breadcrumb">Home › <span>System Analytics</span></div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>📊 System Analytics &amp; Predictions</h2>
          <p>Deep learning performance metrics and traffic forecasting for the Chennai network.</p>
        </div>
        <div style={{display:"flex",gap:4}}>
          {["1h","24h","7d","30d"].map(r=>(
            <button key={r} onClick={()=>setRange(r)} className="btn btn-sm" style={{background:range===r?"var(--tn-navy)":"transparent",color:range===r?"#fff":"var(--text-muted)",border:"1px solid var(--border)"}}>{r}</button>
          ))}
        </div>
      </div>
      <div className="kpi-grid">
        {[
          {label:"Citywide Efficiency",val:"92.4%",color:"var(--green)",sub:"▲ +2.1% from last week"},
          {label:"AI Interventions",val:"1,402",color:"var(--tn-navy)",sub:"Automated changes today"},
          {label:"Avg. Network Delay",val:"4.2m",color:"var(--yellow)",sub:"▼ -0.8m from baseline"},
          {label:"Vehicles Monitored",val:"1,741",color:"var(--tn-red)",sub:"Active across all nodes"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{borderLeftColor:k.color}}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.color}}>{k.val}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div className="card">
          <div className="card-header"><h3>⏰ Traffic Density by Hour (Today)</h3></div>
          <div className="card-body">
            <div style={{display:"flex",alignItems:"flex-end",gap:4,height:120}}>
              {hourBars.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div title={`${v}%`} style={{width:"100%",height:`${(v/maxH)*100}%`,borderRadius:"3px 3px 0 0",background:v>80?"var(--red)":v>55?"var(--yellow)":"var(--green)",minHeight:4}}/>
                  <span style={{fontSize:9,color:"var(--text-light)",fontFamily:"var(--font-mono)"}}>{hourLabels[i]}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:14,marginTop:10,fontSize:11,flexWrap:"wrap"}}>
              {[["var(--red)",">80%"],["var(--yellow)","55–80%"],["var(--green)","<55%"]].map(([c,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,background:c,borderRadius:2,display:"inline-block"}}/>{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>📅 Weekly Congestion Index</h3></div>
          <div className="card-body">
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:120}}>
              {weekBars.map(({d,v})=>{
                const isMax=v===Math.max(...weekBars.map(x=>x.v));
                return (
                  <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{width:"100%",height:`${v}%`,borderRadius:"3px 3px 0 0",background:isMax?"var(--tn-red)":"var(--tn-navy)",opacity:isMax?1:0.55}}/>
                    <span style={{fontSize:10,color:isMax?"var(--tn-red)":"var(--text-muted)",fontFamily:"var(--font-mono)",fontWeight:isMax?700:400}}>{d}</span>
                  </div>
                );
              })}
            </div>
            <div className="alert alert-warning" style={{marginTop:12,marginBottom:0,fontSize:12}}>
              ⚠️ Friday shows peak congestion. Pre-emptive Corridor B optimisation recommended from 17:00.
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h3>📋 Junction Performance Summary</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr>{["Junction ID","Location","Density","Congestion","Vehicles","Avg. Delay","Signal Phase"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {JUNCTIONS.map(j=>(
                <tr key={j.id}>
                  <td className="mono">{j.id}</td>
                  <td style={{fontWeight:500}}>{j.name}</td>
                  <td style={{minWidth:140}}><DensityBar value={j.density}/></td>
                  <td><Badge type={j.congestion}/></td>
                  <td className="mono">{j.vehicles}</td>
                  <td className="mono">{j.delay}</td>
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

// ── SIGNAL CONTROL ───────────────────────────────────────────────────────────
function SignalPage() {
  const [phases,setPhases]=useState(JUNCTIONS.map(j=>j.phase));
  const [sel,setSel]=useState(0);
  const [timings,setTimings]=useState(JUNCTIONS.map(()=>({green:45,yellow:5,red:40})));
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    const id=setInterval(()=>{
      setPhases(prev=>prev.map(p=>Math.random()>0.8?(p==="Green"?"Yellow":p==="Yellow"?"Red":"Green"):p));
    },4000);
    return ()=>clearInterval(id);
  },[]);

  const cycle=(i,e)=>{e.stopPropagation();setPhases(prev=>{const n=[...prev];n[i]=n[i]==="Green"?"Yellow":n[i]==="Yellow"?"Red":"Green";return n;});};
  const saveTiming=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};

  return (
    <div className="page">
      <div className="breadcrumb">Home › <span>Traffic Signal Control</span></div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>🚦 Adaptive Signal Control Panel</h2>
          <p>Monitor and manage traffic signal phases. AI auto-adjusts green durations based on live density data.</p>
        </div>
      </div>
      <div className="alert alert-info">ℹ️ Signal states refresh every 4 seconds via AI optimisation. Manual overrides are permanently logged.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {JUNCTIONS.map((j,i)=>{
          const p=phases[i];
          const bc=p==="Green"?"var(--green)":p==="Yellow"?"var(--yellow)":"var(--red)";
          return (
            <div key={j.id} className="card" style={{textAlign:"center",cursor:"pointer",borderTop:`3px solid ${bc}`,outline:sel===i?"2px solid var(--tn-navy)":"none",outlineOffset:2}} onClick={()=>setSel(i)}>
              <div style={{padding:"14px 10px"}}>
                <div className="traffic-light">
                  <div className={`tl-bulb tl-r${p==="Red"?" on":""}`}/>
                  <div className={`tl-bulb tl-y${p==="Yellow"?" on":""}`}/>
                  <div className={`tl-bulb tl-g${p==="Green"?" on":""}`}/>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--tn-navy)",margin:"10px 0 3px",lineHeight:1.3}}>{j.name.split("–")[0].trim()}</div>
                <div className="mono" style={{fontSize:10,color:"var(--text-muted)",marginBottom:8}}>{j.id}</div>
                <Badge type={p}/>
                <div style={{marginTop:9}}>
                  <button className="btn btn-ghost btn-sm" style={{fontSize:11}} onClick={(e)=>cycle(i,e)}>↻ Cycle</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <div className="card-header">
          <h3>⏱️ Signal Timing Editor — {JUNCTIONS[sel].name}</h3>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {saved && <span className="badge badge-green">✅ Saved</span>}
            <button className="btn btn-primary btn-sm" onClick={saveTiming}>💾 Save Timing</button>
            <button className="btn btn-ghost btn-sm">Reset to AI Default</button>
          </div>
        </div>
        <div className="card-body">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
            {[["green","var(--green)","🟢"],["yellow","var(--yellow)","🟡"],["red","var(--red)","🔴"]].map(([color,c,icon])=>(
              <div key={color}>
                <label className="form-label" style={{color:c}}>{icon} {color.charAt(0).toUpperCase()+color.slice(1)} Phase Duration</label>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <input type="range" min={5} max={90} value={timings[sel][color]} style={{flex:1,accentColor:c}}
                    onChange={e=>{const n=[...timings];n[sel]={...n[sel],[color]:+e.target.value};setTimings(n);}}/>
                  <span className="mono" style={{fontSize:15,fontWeight:700,width:38,color:c}}>{timings[sel][color]}s</span>
                </div>
              </div>
            ))}
          </div>
          <div className="alert alert-success" style={{marginTop:18,marginBottom:0}}>
            ✅ Total cycle: {timings[sel].green+timings[sel].yellow+timings[sel].red}s &nbsp;·&nbsp; Green ratio: {Math.round(timings[sel].green/(timings[sel].green+timings[sel].yellow+timings[sel].red)*100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EMERGENCY ────────────────────────────────────────────────────────────────
function EmergencyPage({role}) {
  const [activeCorr,setActiveCorr]=useState(null);
  const canAct=role==="Emergency Authority"||role==="Super Admin";
  const corridors=[
    {id:"c1",name:"Hospital Route Alpha (North–South)",nodes:["J-001","J-004","J-007"],status:"Standby"},
    {id:"c2",name:"Fire Department Corridor (East–West)",nodes:["J-002","J-005"],status:"Active"},
    {id:"c3",name:"Evacuation Protocol Sigma",nodes:["All Network"],status:"Disabled"},
  ];
  return (
    <div className="page">
      <div className="breadcrumb">Home › <span>Emergency Command Centre</span></div>
      <div className="page-header">
        <div className="page-header-left">
          <h2 style={{color:"var(--red)"}}>🚨 Emergency Command Centre</h2>
          <p>Critical override protocols for first responders and emergency authority personnel only.</p>
        </div>
      </div>
      {!canAct && <div className="alert alert-danger">🔒 Access Restricted — Requires Emergency Authority or Super Admin clearance.</div>}
      <div className="alert alert-warning">⚠️ Activating emergency protocols suspends AI optimisation for affected corridors. All actions are permanently logged.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card" style={{borderTop:"3px solid var(--red)"}}>
          <div className="card-header">
            <h3 style={{color:"var(--red)"}}>🚑 Priority Corridor Preemption</h3>
            {activeCorr && <span className="badge badge-red" style={{animation:"blink 1s infinite"}}>● BROADCASTING</span>}
          </div>
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
            {corridors.map(c=>(
              <div key={c.id} style={{border:"1px solid var(--border)",borderRadius:6,padding:"13px 15px",background:activeCorr===c.id?"#FEF2F2":"var(--panel-alt)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:"var(--tn-navy)"}}>{c.name}</div>
                    <div className="mono" style={{fontSize:10,color:"var(--text-muted)",marginTop:2}}>Nodes: {c.nodes.join(", ")}</div>
                  </div>
                  <Badge type={c.status==="Active"?"Red":c.status==="Standby"?"Yellow":"Grey"}/>
                </div>
                <button className={`btn btn-sm ${activeCorr===c.id?"btn-danger":"btn-ghost"}`}
                  style={{borderColor:"var(--red)",color:activeCorr===c.id?"#fff":"var(--red)"}}
                  onClick={()=>setActiveCorr(activeCorr===c.id?null:c.id)}
                  disabled={!canAct}>
                  {activeCorr===c.id?"✅ DEACTIVATE":"⚡ INITIATE OVERRIDE"}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{borderTop:"3px solid var(--yellow)"}}>
          <div className="card-header"><h3>⚠️ Disaster Protocols</h3></div>
          <div style={{padding:16}}>
            <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:14,lineHeight:1.6}}>
              Disaster mode suspends all AI optimisation and enforces hardcoded signal timings city-wide. Requires Super Admin dual-authorisation.
            </p>
            {[
              {title:"🔴 Total System Flash (All-Red)",desc:"Forces all 48 signals to blink RED. Use during catastrophic network failure.",bg:"#FEF2F2",col:"var(--red)"},
              {title:"🟡 All-Green Arterial Flush",desc:"Opens all arterial roads to maximum flow for mass evacuation.",bg:"#FFFBEB",col:"var(--yellow)"},
            ].map(item=>(
              <div key={item.title} style={{border:"1px solid var(--border)",borderRadius:6,padding:14,background:item.bg,marginBottom:12}}>
                <div style={{fontWeight:700,marginBottom:6,fontSize:13}}>{item.title}</div>
                <p style={{fontSize:12,color:"var(--text-muted)",marginBottom:10}}>{item.desc}</p>
                <button className="btn btn-sm" style={{width:"100%",justifyContent:"center",background:item.bg,color:item.col,borderColor:item.col}} disabled={role!=="Super Admin"}>
                  [ {item.title.replace(/[🔴🟡]/,"").trim().toUpperCase()} — SUPER ADMIN ONLY ]
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryPage() {
  const [search,setSearch]=useState("");
  const [typeFilter,setTypeFilter]=useState("All");
  const types=["All","AI Optimisation","Manual Override","System Event","Sensor Alert","Emergency Override","Peak Transition"];
  const filtered=LOGS.filter(l=>{
    const match=typeFilter==="All"||l.type===typeFilter;
    const q=search.toLowerCase();
    return match&&(l.junction.toLowerCase().includes(q)||l.type.toLowerCase().includes(q)||l.details.toLowerCase().includes(q)||l.id.toLowerCase().includes(q));
  });
  return (
    <div className="page">
      <div className="breadcrumb">Home › <span>System History</span></div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>📋 System History &amp; Audit Log</h2>
          <p>Immutable chronological ledger of all traffic events, AI decisions, and operator overrides.</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost btn-sm">🔽 Export CSV</button>
          <button className="btn btn-primary btn-sm">🖨️ Print Report</button>
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <div className="search-wrap" style={{flex:1,minWidth:200}}>
          <span className="search-icon">🔍</span>
          <input className="form-input" type="text" placeholder="Search by keyword, junction, event ID..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-select" style={{width:"auto",minWidth:180}} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          {types.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr>{["Event ID","Timestamp","Event Type","Location","Description","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.length===0
              ?<tr><td colSpan={6} style={{textAlign:"center",padding:"28px",color:"var(--text-muted)"}}>No events match your criteria.</td></tr>
              :filtered.map(log=>(
                <tr key={log.id}>
                  <td className="mono">{log.id}</td>
                  <td className="mono" style={{color:"var(--text-muted)",fontSize:11}}>{log.time}</td>
                  <td><span className="badge badge-blue">{log.type}</span></td>
                  <td style={{fontWeight:500,fontSize:12}}>{log.junction}</td>
                  <td style={{fontSize:12,color:"var(--text-muted)",maxWidth:240}}>{log.details}</td>
                  <td><Badge type={log.status}/></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:"var(--panel-alt)",borderTop:"1px solid var(--border)",fontSize:12,color:"var(--text-muted)"}}>
        <span>Showing {filtered.length} of {LOGS.length} events</span>
        <div style={{display:"flex",gap:6}}>
          <button className="btn btn-ghost btn-sm" style={{opacity:.5}}>← Previous</button>
          <button className="btn btn-ghost btn-sm">Next →</button>
        </div>
      </div>
    </div>
  );
}

// ── USERS ────────────────────────────────────────────────────────────────────
function UsersPage() {
  const [search,setSearch]=useState("");
  const [roleFilter,setRoleFilter]=useState("All");
  const roles=["All","Super Admin","Traffic Engineer","Traffic Operator","Emergency Authority"];
  const filtered=USERS.filter(u=>{
    const m=roleFilter==="All"||u.role===roleFilter;
    const q=search.toLowerCase();
    return m&&(u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)||u.id.toLowerCase().includes(q));
  });
  return (
    <div className="page">
      <div className="breadcrumb">Home › <span>User Access Management</span></div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>👥 User Access Management</h2>
          <p>Manage authority accounts, roles, and operational zone assignments.</p>
        </div>
        <button className="btn btn-primary">+ Add New User</button>
      </div>
      <div className="kpi-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[
          {label:"Total Accounts",val:USERS.length,color:"var(--tn-navy)"},
          {label:"Active Accounts",val:USERS.filter(u=>u.status==="Active").length,color:"var(--green)"},
          {label:"Privileged Roles",val:USERS.filter(u=>u.role==="Super Admin"||u.role==="Emergency Authority").length,color:"var(--tn-gold)"},
        ].map(k=>(
          <div key={k.label} className="kpi-card" style={{borderLeftColor:k.color}}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{color:k.color}}>{k.val}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:14}}>
        <div className="search-wrap" style={{flex:1}}>
          <span className="search-icon">🔍</span>
          <input className="form-input" type="text" placeholder="Search by name, email, or ID..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-select" style={{width:"auto",minWidth:180}} value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
          {roles.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr>{["User ID","Name & Contact","Role","Zone","Status","Last Login","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(u=>(
              <tr key={u.id}>
                <td className="mono">{u.id}</td>
                <td>
                  <div style={{fontWeight:600}}>{u.name}</div>
                  <div style={{fontSize:11,color:"var(--text-muted)"}}>✉️ {u.email}</div>
                </td>
                <td><Badge type={u.role}/></td>
                <td style={{fontSize:12}}>{u.zone}</td>
                <td><Badge type={u.status}/></td>
                <td className="mono" style={{fontSize:11,color:"var(--text-muted)"}}>{u.last}</td>
                <td>
                  <div style={{display:"flex",gap:5}}>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                    <button className="btn btn-sm" style={{background:u.status==="Active"?"#FEF2F2":"#F0FDF4",color:u.status==="Active"?"var(--red)":"var(--green)",border:"none"}}>
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

// ── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsPage() {
  const [autoOpt,setAutoOpt]=useState(true);
  const [emergBroadcast,setEmergBroadcast]=useState(true);
  const [auditLog,setAuditLog]=useState(true);
  const [threshold,setThreshold]=useState(75);
  const [syncInterval,setSyncInterval]=useState(10);
  const [saved,setSaved]=useState(false);
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);};

  const ToggleRow=({label,sub,checked,onChange})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"11px 13px",background:"var(--panel-alt)",borderRadius:5,border:"1px solid var(--border-light)"}}>
      <div><div style={{fontWeight:600,fontSize:13}}>{label}</div><div style={{fontSize:12,color:"var(--text-muted)",marginTop:2}}>{sub}</div></div>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}/>
    </div>
  );

  return (
    <div className="page">
      <div className="breadcrumb">Home › <span>System Settings</span></div>
      <div className="page-header">
        <div className="page-header-left">
          <h2>⚙️ System Configuration</h2>
          <p>Configure AI behaviour, failover protocols, and notification routing.</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {saved && <span className="badge badge-green">✅ Settings Saved</span>}
          <button className="btn btn-primary" onClick={save}>💾 Save Changes</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card">
          <div className="card-header"><h3>🤖 Optimisation Engine</h3></div>
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
            <ToggleRow label="Auto-Optimise Signal Phases" sub="Allow AI to rebalance cycles without manual review." checked={autoOpt} onChange={setAutoOpt}/>
            {[["Congestion Alert Threshold",threshold,setThreshold,40,95,"var(--tn-navy)","%"],["Telemetry Sync Interval",syncInterval,setSyncInterval,2,30,"var(--tn-navy)","s"]].map(([lbl,val,setter,mn,mx,c,unit])=>(
              <div key={lbl} style={{padding:"11px 13px",background:"var(--panel-alt)",borderRadius:5,border:"1px solid var(--border-light)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{fontWeight:600,fontSize:13}}>{lbl}</span>
                  <span className="mono" style={{fontWeight:700,color:c}}>{val}{unit}</span>
                </div>
                <input type="range" min={mn} max={mx} value={val} onChange={e=>setter(+e.target.value)}/>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>🛡️ Safety &amp; Override</h3></div>
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
            <ToggleRow label="Emergency Broadcast Channel" sub="Enable hard-priority preemption signal broadcasting." checked={emergBroadcast} onChange={setEmergBroadcast}/>
            <ToggleRow label="Immutable Audit Logging" sub="Maintain complete signal-control trace for compliance." checked={auditLog} onChange={setAuditLog}/>
            <button className="btn btn-ghost" style={{borderColor:"var(--red)",color:"var(--red)",justifyContent:"center"}}>🔄 Reset Fallback Timing Matrix</button>
          </div>
        </div>
        <div className="card" style={{gridColumn:"1 / -1"}}>
          <div className="card-header"><h3>🔔 Notification &amp; Ops Info</h3></div>
          <div style={{padding:16}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
              {[
                {label:"Alert Email Route",value:"city-noc@tn.trafficdept.gov.in",sub:"Primary NOC mailbox."},
                {label:"Runtime Profile",value:"production.ai-balanced.v3",sub:"Active optimisation profile.",mono:true},
                {label:"Last Config Update",value:"2026-03-05 09:28 IST",sub:"Synced with central controller."},
                {label:"System Version",value:"Traffix v3.2.1",sub:"Build 2026.03 — Stable."},
              ].map(({label,value,sub,mono})=>(
                <div key={label} style={{padding:"13px 14px",background:"var(--panel-alt)",borderRadius:5,border:"1px solid var(--border-light)"}}>
                  <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--text-light)",marginBottom:5}}>{label}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"var(--tn-navy)",fontFamily:mono?"var(--font-mono)":"inherit",wordBreak:"break-all"}}>{value}</div>
                  <div style={{fontSize:11,color:"var(--text-muted)",marginTop:3}}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("dashboard");

  const ALL_TABS=[
    {id:"dashboard",label:"City Map",      icon:"🗺️",roles:["Super Admin","Traffic Engineer","Traffic Operator","Emergency Authority"]},
    {id:"analytics", label:"Analytics",    icon:"📊",roles:["Super Admin","Traffic Engineer"]},
    {id:"signals",   label:"Signal Control",icon:"🚦",roles:["Super Admin","Traffic Engineer","Traffic Operator"]},
    {id:"emergency", label:"Emergency",    icon:"🚨",roles:["Super Admin","Emergency Authority"]},
    {id:"history",   label:"History",      icon:"📋",roles:["Super Admin","Traffic Engineer"]},
    {id:"users",     label:"Users",        icon:"👥",roles:["Super Admin"]},
    {id:"settings",  label:"Settings",     icon:"⚙️",roles:["Super Admin"]},
  ];

  const handleLogout=()=>{setUser(null);setTab("dashboard");};
  const visibleTabs=user?ALL_TABS.filter(t=>t.roles.includes(user.role)):[];

  const renderPage=()=>{
    switch(tab){
      case "dashboard": return <DashboardPage/>;
      case "analytics": return <AnalyticsPage/>;
      case "signals":   return <SignalPage/>;
      case "emergency": return <EmergencyPage role={user?.role}/>;
      case "history":   return <HistoryPage/>;
      case "users":     return <UsersPage/>;
      case "settings":  return <SettingsPage/>;
      default:          return <DashboardPage/>;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:styles}}/>
      {!user ? (
        <LoginPage onLogin={u=>{setUser(u);setTab("dashboard");}}/>
      ) : (
        <>
          <GovtHeader/>
          <nav className="nav-bar">
            {visibleTabs.map(t=>(
              <button key={t.id} className={`nav-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
            <div className="nav-user">
              <span style={{fontSize:12,color:"rgba(255,255,255,0.65)"}}>
                👤 <strong style={{color:"#fff"}}>{user.username}</strong>
                {" — "}
                <span style={{color:"var(--tn-gold-light)"}}>{user.role}</span>
              </span>
              <button className="nav-logout" onClick={handleLogout}>🔓 Logout</button>
            </div>
          </nav>
          <main style={{background:"var(--bg)",minHeight:"calc(100vh - 132px)"}}>
            {renderPage()}
          </main>
          <footer className="tn-footer">
            <span>© 2026 Government of Tamil Nadu — Department of Highways &amp; Traffic Engineering · All Rights Reserved</span>
            <span>Traffix v3.2.1 · <a href="#">Disclaimer</a> · <a href="#">Privacy Policy</a> · <a href="#">Contact NOC</a></span>
          </footer>
        </>
      )}
    </>
  );
}
