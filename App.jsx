import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
  
    --navy0: #0a0e1a;
    --navy1: #0d1228;
    --navy2: #111830;
    --navy3: #151e38;
    --navy4: #1a2440;
    --navy5: #1f2b4a;
    --card:  rgba(17,24,48,0.85);
    --b1: rgba(255,255,255,0.06);
    --b2: rgba(255,255,255,0.10);
    --b3: rgba(255,255,255,0.18);
    --blue:  #4299e1;
    --blue2: #63b3ed;
    --indigo:#667eea;
    --cyan:  #00d4ff;
    --teal:  #38b2ac;
    --green: #68d391;
    --green2:#00ff94;
    --red:   #fc8181;
    --red2:  #ff4455;
    --amber: #f6ad55;
    --pink:  #f687b3;
    --purple:#9f7aea;
    --t1: #e2e8f0;
    --t2: #94a3b8;
    --t3: #4a5568;
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Plus Jakarta Sans', sans-serif;
  }
  body { background: var(--navy0); color: var(--t1); font-family: var(--sans); overflow-x: hidden; }
  * { scrollbar-width: thin; scrollbar-color: var(--navy4) transparent; }
  input, button { font-family: var(--sans); }

  @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.95)} }
  @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,30px) scale(1.05)} 66%{transform:translate(30px,-40px) scale(1.1)} }
  @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,40px) scale(0.9)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideRight { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
  @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes ring-pulse { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }

  .stagger-1{animation:fadeUp .5s ease both .05s}
  .stagger-2{animation:fadeUp .5s ease both .12s}
  .stagger-3{animation:fadeUp .5s ease both .19s}
  .stagger-4{animation:fadeUp .5s ease both .26s}
  .stagger-5{animation:fadeUp .5s ease both .33s}
  .stagger-6{animation:fadeUp .5s ease both .40s}

  .glass {
    background: var(--card);
    border: 1px solid var(--b1);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
  }
  .glass::before {
    content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
  }
  .nav-btn { background:transparent;border:none;cursor:pointer;width:100%;text-align:left; }
  .nav-btn:hover .nav-label { color:var(--t1)!important; }
  .card-hover { transition: transform .2s, box-shadow .2s; }
  .card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.4); }
  .recharts-tooltip-wrapper { outline: none; }
  input:focus { outline: none; border-color: var(--blue)!important; box-shadow: 0 0 0 3px rgba(66,153,225,0.15); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--navy4); border-radius: 4px; }
`;

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const SCAN_TREND = [
  {m:"Jan",scans:120,issues:34,resolved:28},{m:"Feb",scans:180,issues:52,resolved:47},
  {m:"Mar",scans:240,issues:61,resolved:58},{m:"Apr",scans:310,issues:48,resolved:45},
  {m:"May",scans:420,issues:73,resolved:69},{m:"Jun",scans:380,issues:55,resolved:52},
  {m:"Jul",scans:510,issues:42,resolved:40},{m:"Aug",scans:620,issues:38,resolved:37},
  {m:"Sep",scans:740,issues:61,resolved:59},{m:"Oct",scans:810,issues:29,resolved:28},
  {m:"Nov",scans:940,issues:44,resolved:43},{m:"Dec",scans:1100,issues:23,resolved:23},
];
const THREAT_PIE = [
  {name:"Broken Auth",value:8,color:"#fc8181"},
  {name:"Injection",value:5,color:"#f6ad55"},
  {name:"Excess Data",value:12,color:"#667eea"},
  {name:"Rate Limit",value:7,color:"#4299e1"},
  {name:"CORS",value:4,color:"#38b2ac"},
  {name:"Other",value:3,color:"#9f7aea"},
];
const WEEKLY_SCANS = [
  {d:"Mon",v:82},{d:"Tue",v:140},{d:"Wed",v:95},{d:"Thu",v:210},{d:"Fri",v:175},{d:"Sat",v:60},{d:"Sun",v:44},
];
const SCORE_RADIAL = [{name:"Score",value:94,fill:"#00ff94"}];

const RECENT_SCANS = [
  {name:"Payment Gateway v3",method:"POST /checkout",sev:"critical",score:24,time:"2m ago",src:"Postman",threats:8},
  {name:"Auth Microservice",method:"GET /oauth/token",sev:"high",score:61,time:"14m ago",src:"GitHub",threats:5},
  {name:"User Profile API",method:"PUT /users/{id}",sev:"safe",score:98,time:"1h ago",src:"OpenAPI",threats:0},
  {name:"Inventory Service",method:"GET /products",sev:"medium",score:73,time:"2h ago",src:"CI/CD",threats:3},
  {name:"Webhook Handler",method:"POST /events",sev:"safe",score:97,time:"3h ago",src:"GitHub",threats:0},
  {name:"Admin Dashboard",method:"DELETE /users",sev:"high",score:55,time:"5h ago",src:"OpenAPI",threats:6},
];
const PIPELINES = [
  {name:"api-gateway",branch:"main",status:"pass",time:"1m 23s",commit:"feat: rate limiting",ago:"2m"},
  {name:"auth-service",branch:"release/2.1",status:"fail",time:"2m 01s",commit:"fix: JWT expiry",ago:"8m"},
  {name:"payment-svc",branch:"develop",status:"running",time:"0m 47s",commit:"chore: deps bump",ago:"now"},
  {name:"user-api",branch:"main",status:"pass",time:"1m 08s",commit:"refactor: middleware",ago:"1h"},
];
const ENDPOINTS_DATA = [
  {method:"GET",path:"/api/v1/users",status:"safe",latency:"42ms",calls:"12.4k"},
  {method:"POST",path:"/api/v1/auth/login",status:"high",latency:"180ms",calls:"8.1k"},
  {method:"PUT",path:"/api/v1/payments",status:"critical",latency:"320ms",calls:"3.2k"},
  {method:"DELETE",path:"/api/v1/admin/users",status:"critical",latency:"95ms",calls:"0.4k"},
  {method:"GET",path:"/api/v1/products",status:"safe",latency:"38ms",calls:"21.7k"},
  {method:"POST",path:"/api/v1/webhooks",status:"medium",latency:"210ms",calls:"6.8k"},
];
const GITHUB_REPOS = [
  {name:"acme/payment-api",branch:"main",prs:3,issues:2,score:61,scan:"5m ago",status:"high"},
  {name:"acme/auth-service",branch:"main",prs:1,issues:5,score:55,scan:"20m ago",status:"critical"},
  {name:"acme/api-gateway",branch:"release/3",prs:0,issues:0,score:97,scan:"1h ago",status:"safe"},
  {name:"acme/user-api",branch:"develop",prs:2,issues:1,score:83,scan:"2h ago",status:"medium"},
  {name:"acme/inventory",branch:"main",prs:0,issues:0,score:99,scan:"4h ago",status:"safe"},
  {name:"acme/webhook-svc",branch:"main",prs:1,issues:3,score:72,scan:"6h ago",status:"medium"},
];
const CICD_INTEGRATIONS = [
  {name:"GitHub Actions",icon:"ti-brand-github",on:true,runs:124,ok:118},
  {name:"GitLab CI",icon:"ti-brand-gitlab",on:false,runs:0,ok:0},
  {name:"Jenkins",icon:"ti-settings-2",on:true,runs:48,ok:42},
  {name:"CircleCI",icon:"ti-rotate-clockwise-2",on:false,runs:0,ok:0},
  {name:"AWS CodePipeline",icon:"ti-brand-aws",on:true,runs:31,ok:31},
  {name:"Azure DevOps",icon:"ti-brand-azure",on:false,runs:0,ok:0},
];
const REPORTS_LIST = [
  {name:"Payment API — Security Audit Q2 2025",date:"Jun 12, 2025",pages:18,score:61,size:"2.4 MB"},
  {name:"Auth Service — Full Penetration Report",date:"Jun 8, 2025",pages:24,score:55,size:"3.1 MB"},
  {name:"API Gateway — Compliance (SOC2)",date:"Jun 1, 2025",pages:12,score:97,size:"1.8 MB"},
  {name:"User API — Monthly Summary",date:"May 28, 2025",pages:9,score:83,size:"1.2 MB"},
  {name:"Inventory — Full OWASP Scan",date:"May 15, 2025",pages:6,score:99,size:"0.9 MB"},
];
const POSTMAN_COLS = [
  {name:"Payment API Collection",reqs:24,issues:4,status:"high",updated:"1h ago"},
  {name:"Auth Service Tests",reqs:18,issues:0,status:"safe",updated:"3h ago"},
  {name:"User Management API",reqs:31,issues:2,status:"medium",updated:"1d ago"},
  {name:"Admin Panel Endpoints",reqs:12,issues:7,status:"critical",updated:"2d ago"},
];
const OPENAPI_EPS = [
  {method:"GET",path:"/pets",desc:"List all pets",status:"safe"},
  {method:"POST",path:"/pets",desc:"Create a new pet",status:"high"},
  {method:"GET",path:"/pets/{id}",desc:"Get pet by ID",status:"medium"},
  {method:"DELETE",path:"/pets/{id}",desc:"Delete a pet",status:"critical"},
  {method:"PUT",path:"/pets/{id}",desc:"Update a pet",status:"safe"},
  {method:"GET",path:"/owners",desc:"List all owners",status:"safe"},
  {method:"POST",path:"/auth/login",desc:"Authenticate user",status:"high"},
];
const ALERTS = [
  {id:1,type:"critical",msg:"SQL Injection detected in POST /api/v1/payments",time:"2m ago",read:false},
  {id:2,type:"high",msg:"Rate limit bypassed on /auth/login — 2400 req/min",time:"8m ago",read:false},
  {id:3,type:"medium",msg:"CORS wildcard origin in inventory-svc",time:"1h ago",read:true},
  {id:4,type:"info",msg:"GitHub Actions pipeline completed — api-gateway",time:"2h ago",read:true},
  {id:5,type:"critical",msg:"Admin endpoint DELETE /users exposed without auth",time:"5h ago",read:true},
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const SEV = {
  critical:{color:"#fc8181",bg:"rgba(252,129,129,0.12)",border:"rgba(252,129,129,0.28)",label:"CRITICAL"},
  high:{color:"#f6ad55",bg:"rgba(246,173,85,0.12)",border:"rgba(246,173,85,0.28)",label:"HIGH"},
  medium:{color:"#4299e1",bg:"rgba(66,153,225,0.12)",border:"rgba(66,153,225,0.28)",label:"MEDIUM"},
  low:{color:"#68d391",bg:"rgba(104,211,145,0.12)",border:"rgba(104,211,145,0.28)",label:"LOW"},
  safe:{color:"#00ff94",bg:"rgba(0,255,148,0.1)",border:"rgba(0,255,148,0.25)",label:"SAFE"},
  pass:{color:"#68d391",bg:"rgba(104,211,145,0.1)",border:"rgba(104,211,145,0.22)",label:"PASS"},
  fail:{color:"#fc8181",bg:"rgba(252,129,129,0.1)",border:"rgba(252,129,129,0.22)",label:"FAIL"},
  running:{color:"#00d4ff",bg:"rgba(0,212,255,0.1)",border:"rgba(0,212,255,0.22)",label:"RUNNING"},
  info:{color:"#9f7aea",bg:"rgba(159,122,234,0.1)",border:"rgba(159,122,234,0.22)",label:"INFO"},
};
const METHOD_CLR = {GET:"#68d391",POST:"#4299e1",PUT:"#f6ad55",DELETE:"#fc8181",PATCH:"#00d4ff"};

function Chip({status,small=false}){
  const s=SEV[status]||SEV.medium;
  return <span style={{fontSize:small?8:9,fontWeight:700,letterSpacing:"0.1em",fontFamily:"var(--mono)",color:s.color,background:s.bg,border:`1px solid ${s.border}`,padding:small?"2px 6px":"3px 8px",borderRadius:4}}>{s.label}</span>;
}
function LiveDot({color="var(--green2)",size=6}){
  return(
    <span style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:size+6,height:size+6}}>
      <span style={{position:"absolute",width:size+6,height:size+6,borderRadius:"50%",background:color,opacity:.3,animation:"ring-pulse 1.6s ease-out infinite"}}/>
      <span style={{width:size,height:size,borderRadius:"50%",background:color,display:"block"}}/>
    </span>
  );
}
function AnimNum({val,suffix="",prefix=""}){
  const [n,setN]=useState(0);
  useEffect(()=>{
    let s=0; let reqId;
    const end=parseFloat(val); const dur=1400;
    const step=ts=>{
      if(!s)s=ts;
      const p=Math.min((ts-s)/dur,1);
      setN(parseFloat((p*end).toFixed(1)));
      if(p<1) reqId = requestAnimationFrame(step);
    };
    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  },[val]);
  return <span>{prefix}{typeof val==="number"&&val%1===0?Math.floor(n).toLocaleString():n}{suffix}</span>;
}
function ScoreArc({score,color,size=64}){
  const r=26,c=2*Math.PI*r,fill=(score/100)*c;
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
        style={{filter:`drop-shadow(0 0 5px ${color})`,transition:"stroke-dasharray 1.2s ease"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`,fill:color,fontSize:12,fontWeight:700,fontFamily:"var(--mono)"}}>
        {score}
      </text>
    </svg>
  );
}
const CustomTooltip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(
    <div style={{background:"var(--navy3)",border:"1px solid var(--b2)",borderRadius:10,padding:"10px 14px",fontSize:12,fontFamily:"var(--mono)"}}>
      <p style={{color:"var(--t2)",marginBottom:6}}>{label}</p>
      {payload.map((p,i)=><p key={i} style={{color:p.color,marginBottom:2}}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   BACKGROUND BLOBS
═══════════════════════════════════════════════════════════ */
function BgBlobs(){
  return(
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(66,153,225,0.18) 0%,transparent 70%)",top:"-20%",left:"-10%",animation:"blob1 18s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(159,122,234,0.14) 0%,transparent 70%)",bottom:"-15%",right:"-5%",animation:"blob2 22s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,212,255,0.1) 0%,transparent 70%)",top:"40%",right:"20%",animation:"blob3 15s ease-in-out infinite"}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════════ */
function LoginPage({onLogin}){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [showPass,setShowPass]=useState(false);

  const handle=()=>{
    if(!email||!pass){setErr("Please fill in all fields.");return;}
    
    // Email format validation using Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      setErr("Please enter a valid email format.");
      return;
    }

    setErr("");setLoading(true);
    setTimeout(()=>{setLoading(false);onLogin({name:"Kartikeya Shukla",email,role:"Platform Lead"});},1600);
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",position:"relative",overflow:"hidden"}}>
      <BgBlobs/>
      {/* LEFT PANEL */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 80px",position:"relative",zIndex:1}}>
        <div style={{animation:"fadeUp .6s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:48}}>
            <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,var(--blue),var(--indigo))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(66,153,225,0.4)"}}>
              <i className="ti ti-shield-bolt" style={{fontSize:22,color:"#fff"}}/>
            </div>
            <div>
              <div style={{fontWeight:800,fontSize:20,letterSpacing:"-0.3px"}}>ApiGuard</div>
              <div style={{fontSize:10,color:"var(--blue2)",fontFamily:"var(--mono)",letterSpacing:"0.14em"}}>SECURITY PLATFORM</div>
            </div>
          </div>

          <h1 style={{fontSize:42,fontWeight:800,lineHeight:1.1,marginBottom:12,letterSpacing:"-1px"}}>
            Secure your APIs.<br/>
            <span style={{background:"linear-gradient(135deg,var(--blue),var(--cyan))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Ship with confidence.</span>
          </h1>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.7,maxWidth:440,marginBottom:40}}>
            The only API security platform that integrates directly into your dev workflow — from OpenAPI specs to CI/CD pipelines.
          </p>

          {/* Feature pills */}
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {["OWASP Top 10","GitHub Actions","Postman Sync","PDF Reports","Real-time Alerts","CI/CD Guard"].map(f=>(
              <span key={f} style={{fontSize:11,fontWeight:600,color:"var(--blue2)",background:"rgba(66,153,225,0.1)",border:"1px solid rgba(66,153,225,0.2)",padding:"5px 12px",borderRadius:20,fontFamily:"var(--mono)",letterSpacing:"0.04em"}}>✓ {f}</span>
            ))}
          </div>

          {/* Stat row */}
          <div style={{display:"flex",gap:40,marginTop:48,paddingTop:40,borderTop:"1px solid var(--b1)"}}>
            {[{v:"1,284",l:"APIs Protected"},{v:"99.8%",l:"Uptime SLA"},{v:"< 2s",l:"Scan Speed"}].map(s=>(
              <div key={s.l}>
                <div style={{fontSize:26,fontWeight:800,color:"var(--blue2)",fontFamily:"var(--mono)"}}>{s.v}</div>
                <div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{width:480,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 40px",position:"relative",zIndex:1}}>
        <div className="glass" style={{width:"100%",maxWidth:400,padding:"40px 36px",animation:"fadeUp .6s ease .1s both"}}>
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:6}}>Welcome back</h2>
          <p style={{fontSize:13,color:"var(--t2)",marginBottom:32}}>Sign in to your ApiGuard account</p>

          {err&&<div style={{background:"rgba(252,129,129,0.1)",border:"1px solid rgba(252,129,129,0.25)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"var(--red)",marginBottom:18}}>{err}</div>}

          {/* Email */}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:8,letterSpacing:"0.04em"}}>EMAIL ADDRESS</label>
            <div style={{position:"relative"}}>
              <i className="ti ti-mail" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,color:"var(--t3)"}}/>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@company.com"
                style={{width:"100%",paddingLeft:42,paddingRight:14,paddingTop:12,paddingBottom:12,background:"var(--navy3)",border:"1px solid var(--b2)",borderRadius:10,color:"var(--t1)",fontSize:14,transition:"border-color .2s"}}/>
            </div>
          </div>

          {/* Password */}
          <div style={{marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",letterSpacing:"0.04em"}}>PASSWORD</label>
              <a href="#" style={{fontSize:12,color:"var(--blue2)",textDecoration:"none"}}>Forgot password?</a>
            </div>
            <div style={{position:"relative"}}>
              <i className="ti ti-lock" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,color:"var(--t3)"}}/>
              <input value={pass} onChange={e=>setPass(e.target.value)} type={showPass?"text":"password"} placeholder="••••••••"
                onKeyDown={e=>e.key==="Enter"&&handle()}
                style={{width:"100%",paddingLeft:42,paddingRight:44,paddingTop:12,paddingBottom:12,background:"var(--navy3)",border:"1px solid var(--b2)",borderRadius:10,color:"var(--t1)",fontSize:14,transition:"border-color .2s"}}/>
              <button onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--t3)",fontSize:15}}>
                <i className={`ti ${showPass?"ti-eye-off":"ti-eye"}`}/>
              </button>
            </div>
          </div>

          {/* Sign in btn */}
          <button onClick={handle} disabled={loading}
            style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,var(--blue),var(--indigo))",color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:loading?"not-allowed":"pointer",opacity:loading?0.8:1,transition:"opacity .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.03em",boxShadow:"0 8px 24px rgba(66,153,225,0.35)"}}>
            {loading?<><i className="ti ti-loader-2" style={{animation:"spin 1s linear infinite"}}/>Authenticating…</>:<>Sign In <i className="ti ti-arrow-right"/></>}
          </button>

          <div style={{display:"flex",alignItems:"center",gap:12,margin:"24px 0"}}>
            <div style={{flex:1,height:1,background:"var(--b1)"}}/>
            <span style={{fontSize:12,color:"var(--t3)"}}>OR</span>
            <div style={{flex:1,height:1,background:"var(--b1)"}}/>
          </div>

          {/* OAuth */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{icon:"ti-brand-github",label:"GitHub"},{icon:"ti-brand-google",label:"Google"}].map(p=>(
              <button key={p.label} style={{padding:"10px",background:"var(--navy3)",border:"1px solid var(--b2)",borderRadius:10,color:"var(--t1)",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontWeight:600,transition:"border-color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--b3)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b2)"}>
                <i className={`ti ${p.icon}`} style={{fontSize:16}}/>{p.label}
              </button>
            ))}
          </div>

          <p style={{textAlign:"center",fontSize:12,color:"var(--t3)",marginTop:24}}>
            Don't have an account? <a href="#" style={{color:"var(--blue2)",textDecoration:"none",fontWeight:600}}>Start free trial →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════
   SIDEBAR NAV
═══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  {id:"dashboard",icon:"ti-layout-dashboard",label:"Dashboard",section:"MAIN"},
  {id:"scan",icon:"ti-shield-search",label:"Free Scan",section:"MAIN",badge:"FREE"},
  {id:"endpoints",icon:"ti-api",label:"Endpoints",section:"MAIN"},
  {id:"alerts",icon:"ti-bell",label:"Alerts",section:"MAIN",badge:"5"},
  {id:"openapi",icon:"ti-file-code",label:"OpenAPI",section:"INTEGRATIONS"},
  {id:"postman",icon:"ti-brand-postman",label:"Postman",section:"INTEGRATIONS"},
  {id:"github",icon:"ti-brand-github",label:"GitHub",section:"INTEGRATIONS"},
  {id:"cicd",icon:"ti-git-branch",label:"CI/CD",section:"INTEGRATIONS"},
  {id:"pipelines",icon:"ti-topology-star-3",label:"Pipelines",section:"INTEGRATIONS"},
  {id:"reports",icon:"ti-file-analytics",label:"PDF Reports",section:"ANALYTICS"},
  {id:"analytics",icon:"ti-chart-line",label:"Analytics",section:"ANALYTICS"},
  {id:"settings",icon:"ti-settings",label:"Settings",section:"ACCOUNT"},
  {id:"profile",icon:"ti-user-circle",label:"Profile",section:"ACCOUNT"},
  {id:"docs", icon:"ti-book", label:"Documentation", section:"MAIN"},
];

function Sidebar({active,setActive,user,onLogout}){
  const sections=[...new Set(NAV_ITEMS.map(n=>n.section))];
  return(
    <div style={{width:230,background:"rgba(13,18,40,0.95)",borderRight:"1px solid var(--b1)",display:"flex",flexDirection:"column",flexShrink:0,position:"relative",zIndex:10,backdropFilter:"blur(20px)"}}>
      {/* Logo */}
      <div style={{padding:"22px 20px 18px",borderBottom:"1px solid var(--b1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,var(--blue),var(--indigo))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 16px rgba(66,153,225,0.4)"}}>
            <i className="ti ti-shield-bolt" style={{fontSize:20,color:"#fff"}}/>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:15,letterSpacing:"-0.2px"}}>ApiGuard</div>
            <div style={{fontSize:9,color:"var(--blue2)",fontFamily:"var(--mono)",letterSpacing:"0.14em",fontWeight:600}}>SECURITY PLATFORM</div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{padding:"10px 20px",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:8}}>
        <LiveDot color="var(--green2)" size={5}/>
        <span style={{fontSize:9,color:"#00ff94",fontFamily:"var(--mono)",fontWeight:600,letterSpacing:"0.1em"}}>ALL SYSTEMS NOMINAL</span>
      </div>

      {/* Nav */}
      <nav style={{flex:1,overflowY:"auto",padding:"12px 10px"}}>
        {sections.map(sec=>(
          <div key={sec} style={{marginBottom:8}}>
            <div style={{fontSize:9,color:"var(--t3)",fontWeight:700,letterSpacing:"0.14em",padding:"6px 12px 4px",fontFamily:"var(--mono)"}}>{sec}</div>
            {NAV_ITEMS.filter(n=>n.section===sec).map(item=>{
              const isA=active===item.id;
              return(
                <button key={item.id} className="nav-btn" onClick={()=>setActive(item.id)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,marginBottom:1,background:isA?"linear-gradient(135deg,rgba(66,153,225,0.2),rgba(159,122,234,0.1))":"transparent",border:isA?"1px solid rgba(66,153,225,0.2)":"1px solid transparent",transition:"all .15s"}}>
                  <i className={`ti ${item.icon}`} style={{fontSize:16,color:isA?"var(--blue2)":"var(--t3)",flexShrink:0}}/>
                  <span className="nav-label" style={{fontSize:12,fontWeight:isA?700:500,color:isA?"var(--t1)":"var(--t2)",flex:1,letterSpacing:"0.01em"}}>{item.label}</span>
                  {item.badge&&<span style={{fontSize:8,fontWeight:800,background:item.badge==="FREE"?"var(--green2)":isA?"var(--blue)":"var(--navy5)",color:item.badge==="FREE"?"#000":"var(--t1)",padding:"2px 6px",borderRadius:10,fontFamily:"var(--mono)",letterSpacing:"0.05em"}}>{item.badge}</span>}
                  {isA&&<div style={{width:3,height:16,borderRadius:2,background:"var(--blue)",flexShrink:0}}/>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Help card */}
      <div style={{margin:"0 10px 10px",padding:"14px 16px",borderRadius:12,background:"linear-gradient(135deg,rgba(66,153,225,0.15),rgba(159,122,234,0.1))",border:"1px solid rgba(66,153,225,0.2)"}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:4}}>Need help?</div>
        <div style={{fontSize:11,color:"var(--t2)",marginBottom:10}}>Check our docs or reach out to support</div>
        {/* Replace your existing DOCUMENTATION button with this: */}
{/* In your Sidebar component */}
<button 
  onClick={() => setActive('docs')} // This tells the App to switch to DocsView
  style={{
    width: "100%", 
    padding: "7px", 
    background: "linear-gradient(135deg, var(--blue), var(--indigo))", 
    color: "#fff", 
    border: "none", 
    borderRadius: "7px", 
    fontSize: "11px", 
    fontWeight: 700, 
    cursor: "pointer", 
    letterSpacing: "0.04em"
  }}
>
  DOCUMENTATION
</button>
      </div>

      {/* User */}
      <div style={{padding:"14px 16px",borderTop:"1px solid var(--b1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,var(--blue),var(--indigo))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>
            {user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{fontSize:9,color:"var(--blue2)",fontFamily:"var(--mono)",letterSpacing:"0.08em"}}>PRO PLAN</div>
          </div>
          <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",color:"var(--t3)",fontSize:16}} title="Sign out">
            <i className="ti ti-logout"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════════ */
function Topbar({page,user,alerts,setActive}){
  const [time,setTime]=useState(new Date());
  const unread=alerts.filter(a=>!a.read).length;
  useEffect(()=>{const iv=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(iv);},[]);
  return(
    <div style={{height:60,background:"rgba(13,18,40,0.9)",borderBottom:"1px solid var(--b1)",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,backdropFilter:"blur(20px)",zIndex:9,position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--mono)",letterSpacing:"0.14em"}}>APIGUARD /</span>
        <span style={{fontSize:14,fontWeight:800,letterSpacing:"0.02em"}}>{page.toUpperCase()}</span>
      </div>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <code style={{fontSize:11,color:"var(--t2)",fontFamily:"var(--mono)",background:"var(--navy3)",padding:"5px 12px",borderRadius:6,border:"1px solid var(--b1)"}}>{time.toLocaleTimeString("en-US",{hour12:false})}</code>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--navy3)",border:"1px solid var(--b1)",borderRadius:8,padding:"6px 14px",cursor:"text"}}>
          <i className="ti ti-search" style={{fontSize:13,color:"var(--t3)"}}/>
          <span style={{fontSize:12,color:"var(--t3)",fontFamily:"var(--mono)"}}>Search…</span>
        </div>
        <button onClick={()=>setActive("alerts")} style={{position:"relative",background:"none",border:"none",cursor:"pointer",color:"var(--t2)",fontSize:20}}>
          <i className="ti ti-bell"/>
          {unread>0&&<span style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:"var(--red2)",fontSize:8,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",animation:"blink 2s ease-in-out infinite",fontFamily:"var(--mono)"}}>{unread}</span>}
        </button>
        <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,var(--blue),var(--indigo))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",cursor:"pointer"}}>
          {user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD VIEW
═══════════════════════════════════════════════════════════ */
function DashboardView({user}){
  const METRICS=[
    {label:"Total APIs Scanned",value:1284,suffix:"",prefix:"",icon:"ti-api",color:"var(--blue)",glow:"rgba(66,153,225,0.25)",delta:"+12%",up:true},
    {label:"Critical Threats",value:23,suffix:"",prefix:"",icon:"ti-alert-triangle",color:"var(--red)",glow:"rgba(252,129,129,0.2)",delta:"-8%",up:false},
    {label:"Security Score",value:94,suffix:"%",prefix:"",icon:"ti-shield-check",color:"var(--green2)",glow:"rgba(0,255,148,0.2)",delta:"+2.1%",up:true},
    {label:"Live Pipelines",value:17,suffix:"",prefix:"",icon:"ti-git-branch",color:"var(--amber)",glow:"rgba(246,173,85,0.2)",delta:"+3",up:true},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Welcome */}
      <div className="stagger-1" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.3px"}}>Glad to see you again, <span style={{background:"linear-gradient(135deg,var(--blue),var(--cyan))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{user.name.split(" ")[0]}.</span></h2>
          <p style={{fontSize:13,color:"var(--t2)",marginTop:4}}>Here's your API security overview for today, May 24 2026</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button style={{padding:"9px 18px",background:"linear-gradient(135deg,var(--blue),var(--indigo))",color:"#fff",border:"none",borderRadius:9,fontWeight:700,fontSize:12,cursor:"pointer",letterSpacing:"0.04em",boxShadow:"0 4px 16px rgba(66,153,225,0.3)"}}>
            <i className="ti ti-plus" style={{marginRight:6}}/>NEW SCAN
          </button>
          <button style={{padding:"9px 18px",background:"var(--navy3)",color:"var(--t1)",border:"1px solid var(--b2)",borderRadius:9,fontWeight:600,fontSize:12,cursor:"pointer"}}>
            <i className="ti ti-download" style={{marginRight:6}}/>EXPORT
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stagger-2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        {METRICS.map((m,i)=>(
          <div key={i} className="glass card-hover" style={{padding:"22px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:10,background:m.glow,border:`1px solid ${m.color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <i className={`ti ${m.icon}`} style={{fontSize:20,color:m.color}}/>
              </div>
              <span style={{fontSize:10,fontWeight:700,fontFamily:"var(--mono)",color:m.up?"var(--green2)":"var(--red)",background:m.up?"rgba(0,255,148,0.1)":"rgba(252,129,129,0.1)",padding:"2px 8px",borderRadius:20,letterSpacing:"0.05em"}}>{m.delta}</span>
            </div>
            <div style={{fontSize:32,fontWeight:800,color:m.color,letterSpacing:"-1.5px",fontFamily:"var(--mono)",textShadow:`0 0 20px ${m.glow}`}}>
              <AnimNum val={m.value} suffix={m.suffix} prefix={m.prefix}/>
            </div>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:4,letterSpacing:"0.05em",fontWeight:600}}>{m.label}</div>
            <div style={{marginTop:14,height:2,background:"rgba(255,255,255,0.05)",borderRadius:2}}>
              <div style={{height:"100%",width:`${Math.min(100,m.value/13)}%`,background:`linear-gradient(90deg,${m.color}60,${m.color})`,borderRadius:2}}/>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Area Chart + Radial + Quick Stats */}
      <div className="stagger-3" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
        {/* Scan Trend */}
        <div className="glass" style={{padding:"22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>Scan Activity Overview</div>
              <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>+5 more this year vs 2024</div>
            </div>
            <div style={{display:"flex",gap:16,fontSize:11}}>
              {[{c:"var(--blue)",l:"Scans"},{c:"var(--red)",l:"Issues"},{c:"var(--green2)",l:"Resolved"}].map(x=>(
                <span key={x.l} style={{color:"var(--t2)",display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:8,height:3,background:x.c,borderRadius:2,display:"inline-block"}}/>
                  {x.l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SCAN_TREND} margin={{top:5,right:10,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="gScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4299e1" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#4299e1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gIssues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fc8181" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fc8181" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff94" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#00ff94" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{fill:"#4a5568",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#4a5568",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="scans" name="Scans" stroke="#4299e1" strokeWidth={2} fill="url(#gScans)"/>
              <Area type="monotone" dataKey="issues" name="Issues" stroke="#fc8181" strokeWidth={2} fill="url(#gIssues)"/>
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#00ff94" strokeWidth={2} fill="url(#gResolved)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right col: Satisfaction + Score */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Security Score radial */}
          <div className="glass" style={{padding:"22px",textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Security Score</div>
            <div style={{fontSize:11,color:"var(--t3)",marginBottom:16}}>Based on last 30 days</div>
            <ResponsiveContainer width="100%" height={120}>
              <RadialBarChart cx="50%" cy="100%" innerRadius="80%" outerRadius="100%" startAngle={180} endAngle={0} data={SCORE_RADIAL}>
                <RadialBar dataKey="value" cornerRadius={6} fill="#00ff94" background={{fill:"rgba(255,255,255,0.03)"}}/>
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{marginTop:-20,fontSize:36,fontWeight:800,color:"var(--green2)",fontFamily:"var(--mono)",textShadow:"0 0 20px rgba(0,255,148,0.4)"}}>94<span style={{fontSize:18}}>%</span></div>
            <div style={{fontSize:12,color:"var(--t2)",marginTop:4}}>Excellent Protection</div>
          </div>

          {/* Weekly bar */}
          <div className="glass" style={{padding:"20px"}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Weekly Scans</div>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={WEEKLY_SCANS} margin={{top:0,right:0,left:-30,bottom:0}}>
                <XAxis dataKey="d" tick={{fill:"#4a5568",fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="v" name="Scans" radius={[4,4,0,0]}>
                  {WEEKLY_SCANS.map((_,i)=><Cell key={i} fill={i===4?"var(--blue)":"rgba(66,153,225,0.3)"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Scan Feed + Pie + Pipelines */}
      <div className="stagger-4" style={{display:"grid",gridTemplateColumns:"1.8fr 1fr",gap:14}}>
        {/* Recent Scans */}
        <div className="glass">
          <div style={{padding:"18px 22px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--b1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <LiveDot color="var(--cyan)" size={5}/>
              <span style={{fontWeight:700,fontSize:13,letterSpacing:"0.03em"}}>Live Scan Feed</span>
            </div>
            <span style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)"}}>{RECENT_SCANS.length} RESULTS</span>
          </div>
          {RECENT_SCANS.map((s,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto 56px 56px",alignItems:"center",gap:12,padding:"11px 22px",borderBottom:i<RECENT_SCANS.length-1?"1px solid var(--b1)":"none",cursor:"pointer",transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(66,153,225,0.04)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div>
                <div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{s.name}</div>
                <code style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)"}}>{s.method}</code>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <Chip status={s.sev}/>
                <span style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--mono)",background:"var(--navy3)",padding:"2px 6px",borderRadius:3}}>{s.src}</span>
              </div>
              <ScoreArc score={s.score} color={SEV[s.sev]?.color||"var(--blue)"} size={48}/>
              <span style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)",textAlign:"right"}}>{s.time}</span>
            </div>
          ))}
        </div>

        {/* Threat pie */}
        <div className="glass" style={{padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Threat Distribution</div>
          <div style={{fontSize:11,color:"var(--t3)",marginBottom:12}}>By OWASP category</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={THREAT_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {THREAT_PIE.map((e,i)=><Cell key={i} fill={e.color} opacity={0.9}/>)}
              </Pie>
              <Tooltip content={<CustomTooltip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
            {THREAT_PIE.map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:2,background:t.color,flexShrink:0}}/>
                  <span style={{fontSize:11,color:"var(--t2)"}}>{t.name}</span>
                </div>
                <span style={{fontSize:11,fontWeight:700,fontFamily:"var(--mono)",color:t.color}}>{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Pipelines + Active users */}
      <div className="stagger-5" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* Pipeline */}
        <div className="glass">
          <div style={{padding:"18px 22px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--b1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <LiveDot color="var(--amber)" size={5}/>
              <span style={{fontWeight:700,fontSize:13}}>Pipeline Monitor</span>
            </div>
            <Chip status="running" small/>
          </div>
          {PIPELINES.map((p,i)=>{
            const s=SEV[p.status];
            return(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",alignItems:"center",gap:12,padding:"12px 22px",borderBottom:i<PIPELINES.length-1?"1px solid var(--b1)":"none"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                    {p.status==="running"?<LiveDot color="var(--cyan)" size={5}/>:<span style={{width:7,height:7,borderRadius:"50%",background:s.color,display:"block",boxShadow:`0 0 5px ${s.color}`}}/>}
                    <code style={{fontSize:12,fontWeight:700,fontFamily:"var(--mono)"}}>{p.name}</code>
                  </div>
                  <div style={{fontSize:11,color:"var(--t3)"}}>{p.commit}</div>
                </div>
                <code style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--mono)"}}>⎇ {p.branch}</code>
                <code style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)"}}>{p.time}</code>
                <Chip status={p.status} small/>
              </div>
            );
          })}
        </div>

        {/* Active users / integration health */}
        <div className="glass" style={{padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Integration Health</div>
          <div style={{fontSize:11,color:"var(--t3)",marginBottom:18}}>+23 events last week</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
            {[{l:"API Calls",v:"32,984",c:"var(--blue)"},{l:"Scans Run",v:"2.42k",c:"var(--cyan)"},{l:"Issues Found",v:"2,400",c:"var(--red)"},{l:"Resolved",v:"2,380",c:"var(--green2)"}].map(x=>(
              <div key={x.l} style={{background:"var(--navy3)",borderRadius:10,padding:"14px 16px",border:"1px solid var(--b1)"}}>
                <div style={{fontSize:10,color:"var(--t3)",marginBottom:4,letterSpacing:"0.04em"}}>{x.l}</div>
                <div style={{fontSize:20,fontWeight:800,color:x.c,fontFamily:"var(--mono)"}}>{x.v}</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={SCAN_TREND.slice(-7)} margin={{top:0,right:0,left:-30,bottom:0}}>
              <XAxis dataKey="m" hide/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="scans" name="Scans" stroke="var(--blue)" strokeWidth={2} dot={false}/>
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke="var(--green2)" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENDPOINTS VIEW
═══════════════════════════════════════════════════════════ */
function EndpointsView(){
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?ENDPOINTS_DATA:ENDPOINTS_DATA.filter(e=>e.status===filter);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {["all","safe","medium","high","critical"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{padding:"7px 16px",borderRadius:8,border:"1px solid",fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:"0.06em",fontFamily:"var(--mono)",
              borderColor:filter===f?(SEV[f]||{border:"var(--b3)"}).border||"var(--b3)":"var(--b1)",
              background:filter===f?(SEV[f]||{bg:"var(--navy3)"}).bg||"var(--navy3)":"var(--navy3)",
              color:filter===f?(SEV[f]||{color:"var(--t1)"}).color||"var(--t1)":"var(--t2)"}}>
            {f.toUpperCase()}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,background:"var(--navy3)",border:"1px solid var(--b1)",borderRadius:8,padding:"7px 14px"}}>
          <i className="ti ti-search" style={{fontSize:13,color:"var(--t3)"}}/>
          <span style={{fontSize:12,color:"var(--t3)",fontFamily:"var(--mono)"}}>Filter endpoints…</span>
        </div>
      </div>
      <div className="glass">
        <div style={{display:"grid",gridTemplateColumns:"64px 1fr 1fr 80px 80px 56px",gap:12,padding:"12px 22px",borderBottom:"1px solid var(--b1)"}}>
          {["METHOD","PATH","STATUS","LATENCY","CALLS",""].map(h=>(
            <span key={h} style={{fontSize:9,fontWeight:700,color:"var(--t3)",letterSpacing:"0.12em",fontFamily:"var(--mono)"}}>{h}</span>
          ))}
        </div>
        {filtered.map((e,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"64px 1fr 1fr 80px 80px 56px",alignItems:"center",gap:12,padding:"14px 22px",borderBottom:i<filtered.length-1?"1px solid var(--b1)":"none",cursor:"pointer",transition:"background .15s"}}
            onMouseEnter={e2=>e2.currentTarget.style.background="rgba(66,153,225,0.03)"}
            onMouseLeave={e2=>e2.currentTarget.style.background="transparent"}>
            <span style={{fontSize:10,fontWeight:800,fontFamily:"var(--mono)",color:METHOD_CLR[e.method]||"var(--cyan)"}}>{e.method}</span>
            <code style={{fontSize:12,color:"var(--t1)",fontFamily:"var(--mono)"}}>{e.path}</code>
            <Chip status={e.status}/>
            <span style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--t2)"}}>{e.latency}</span>
            <span style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--t2)"}}>{e.calls}</span>
            <i className="ti ti-chevron-right" style={{fontSize:14,color:"var(--t3)"}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ALERTS VIEW
═══════════════════════════════════════════════════════════ */
function AlertsView(){
  const [alerts,setAlerts]=useState(ALERTS);
  const markRead=id=>setAlerts(a=>a.map(x=>x.id===id?{...x,read:true}:x));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:13,color:"var(--t2)"}}>{alerts.filter(a=>!a.read).length} unread alerts</div>
        <button onClick={()=>setAlerts(a=>a.map(x=>({...x,read:true})))} style={{padding:"7px 16px",background:"var(--navy3)",border:"1px solid var(--b2)",borderRadius:8,color:"var(--t2)",fontSize:12,fontWeight:600,cursor:"pointer"}}>Mark all read</button>
      </div>
      <div className="glass">
        {alerts.map((a,i)=>{
          const s=SEV[a.type]||SEV.info;
          return(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:16,padding:"16px 22px",borderBottom:i<alerts.length-1?"1px solid var(--b1)":"none",background:a.read?"transparent":"rgba(66,153,225,0.02)",cursor:"pointer",transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(66,153,225,0.04)"}
              onMouseLeave={e=>e.currentTarget.style.background=a.read?"transparent":"rgba(66,153,225,0.02)"}
              onClick={()=>markRead(a.id)}>
              <div style={{width:36,height:36,borderRadius:9,background:s.bg,border:`1px solid ${s.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <i className={`ti ${a.type==="critical"?"ti-alert-triangle":a.type==="high"?"ti-alert-circle":a.type==="medium"?"ti-info-circle":"ti-circle-check"}`} style={{fontSize:16,color:s.color}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:a.read?500:700,fontSize:13,color:a.read?"var(--t2)":"var(--t1)",marginBottom:2}}>{a.msg}</div>
                <div style={{fontSize:11,color:"var(--t3)",fontFamily:"var(--mono)"}}>{a.time}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Chip status={a.type} small/>
                {!a.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--blue)",flexShrink:0}}/>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FREE SCAN VIEW
═══════════════════════════════════════════════════════════ */
function ScanView(){
  const [url,setUrl]=useState("");
  const [phase,setPhase]=useState("idle");
  const [prog,setProg]=useState(0);
  const [cur,setCur]=useState(0);
  const CHECKS=["Broken Object Level Auth","Broken User Auth","Excessive Data Exposure","Lack of Rate Limiting","Broken Function Level Auth","Mass Assignment","Security Misconfiguration","Injection Flaws","Improper Asset Management","Insufficient Logging"];
  const doScan=()=>{
    if(!url.trim())return;
    setPhase("scanning");setProg(0);setCur(0);
    let p=0,c=0;
    const iv=setInterval(()=>{
      p+=Math.random()*11;c=Math.floor((p/100)*CHECKS.length);
      setProg(Math.min(p,100));setCur(Math.min(c,CHECKS.length-1));
      if(p>=100){clearInterval(iv);setPhase("done");}
    },280);
  };
  const RESULTS=[
    {check:"Broken Authentication",sev:"critical",detail:"JWT not validated on 2 endpoints",fix:"Add validateToken() middleware"},
    {check:"Rate Limiting",sev:"high",detail:"No throttle on /api/login",fix:"Implement token bucket algorithm"},
    {check:"CORS Policy",sev:"medium",detail:"Wildcard origin (*) allowed",fix:"Restrict to known origins list"},
    {check:"TLS Configuration",sev:"low",detail:"TLS 1.1 still enabled",fix:"Enforce TLS 1.3 minimum"},
    {check:"Input Validation",sev:"safe",detail:"All inputs sanitized correctly",fix:null},
    {check:"Security Headers",sev:"safe",detail:"All headers present and correct",fix:null},
  ];
  return(
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <div className="glass" style={{padding:40}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:68,height:68,borderRadius:18,background:"rgba(66,153,225,0.15)",border:"1px solid rgba(66,153,225,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",animation:"float 3s ease-in-out infinite"}}>
            <i className="ti ti-shield-search" style={{fontSize:34,color:"var(--blue)"}}/>
          </div>
          <h2 style={{fontSize:26,fontWeight:800,marginBottom:8,letterSpacing:"-0.5px"}}>Free API Security Scan</h2>
          <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.6}}>Full OWASP API Top 10 analysis — instant results, no account required</p>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:28}}>
          <div style={{flex:1,position:"relative"}}>
            <i className="ti ti-link" style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,color:"var(--t3)"}}/>
            <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doScan()} placeholder="https://api.example.com/openapi.json"
              style={{width:"100%",paddingLeft:42,paddingRight:14,paddingTop:13,paddingBottom:13,background:"var(--navy3)",border:"1px solid var(--b2)",borderRadius:10,color:"var(--t1)",fontSize:14,fontFamily:"var(--mono)",transition:"border-color .2s"}}/>
          </div>
          <button onClick={doScan} disabled={phase==="scanning"}
            style={{padding:"13px 28px",background:phase==="scanning"?"var(--navy4)":"linear-gradient(135deg,var(--blue),var(--indigo))",color:phase==="scanning"?"var(--t3)":"#fff",border:"none",borderRadius:10,fontWeight:800,fontSize:13,cursor:phase==="scanning"?"not-allowed":"pointer",letterSpacing:"0.06em",boxShadow:phase==="scanning"?"none":"0 8px 24px rgba(66,153,225,0.35)",transition:"all .2s"}}>
            {phase==="scanning"?"SCANNING…":"SCAN NOW"}
          </button>
        </div>
        {phase==="scanning"&&(
          <div style={{marginBottom:28}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,color:"var(--blue2)",fontFamily:"var(--mono)",fontWeight:600}}>{CHECKS[cur]}</span>
              <span style={{fontSize:12,color:"var(--t3)",fontFamily:"var(--mono)"}}>{Math.round(prog)}%</span>
            </div>
            <div style={{height:4,background:"var(--navy4)",borderRadius:2,marginBottom:20}}>
              <div style={{height:"100%",width:`${prog}%`,background:"linear-gradient(90deg,var(--blue),var(--cyan))",borderRadius:2,boxShadow:"0 0 10px rgba(0,212,255,0.4)",transition:"width .3s ease"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {CHECKS.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:i<=cur?"var(--t2)":"var(--t3)"}}>
                  <i className={`ti ${i<cur?"ti-circle-check":i===cur?"ti-loader-2":"ti-circle"}`}
                    style={{fontSize:14,color:i<cur?"var(--green2)":i===cur?"var(--blue)":"var(--t3)",animation:i===cur?"spin 1s linear infinite":"none"}}/>
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}
        {phase==="done"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{background:"rgba(0,255,148,0.08)",border:"1px solid rgba(0,255,148,0.2)",borderRadius:12,padding:"16px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:14}}>
              <i className="ti ti-shield-check" style={{fontSize:30,color:"var(--green2)"}}/>
              <div>
                <div style={{fontWeight:800,color:"var(--green2)",fontSize:16}}>Scan Complete — Score: 73 / 100</div>
                <div style={{fontSize:12,color:"rgba(0,255,148,0.6)",marginTop:2}}>3 critical, 4 high-severity issues found across 10 checks</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {RESULTS.map((r,i)=>{
                const s=SEV[r.sev];
                return(
                  <div key={i} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:12,padding:"16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <span style={{fontWeight:700,fontSize:13}}>{r.check}</span>
                      <Chip status={r.sev} small/>
                    </div>
                    <div style={{fontSize:12,color:"var(--t3)",marginBottom:r.fix?8:0}}>{r.detail}</div>
                    {r.fix&&<div style={{fontSize:10,color:s.color,fontFamily:"var(--mono)",background:"rgba(0,0,0,0.2)",padding:"4px 10px",borderRadius:5}}>→ {r.fix}</div>}
                  </div>
                );
              })}
            </div>
            <button style={{width:"100%",marginTop:20,padding:14,background:"linear-gradient(135deg,var(--navy3),var(--navy4))",color:"var(--blue2)",border:"1px solid var(--b3)",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",letterSpacing:"0.05em"}}>
              <i className="ti ti-file-analytics" style={{marginRight:8}}/>EXPORT FULL PDF REPORT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OPENAPI VIEW
═══════════════════════════════════════════════════════════ */
function OpenAPIView(){
  const [loaded,setLoaded]=useState(false);
  const [drag,setDrag]=useState(false);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);setLoaded(true);}} onClick={()=>setLoaded(true)}
        style={{border:`2px dashed ${drag?"var(--blue)":"var(--b2)"}`,borderRadius:14,padding:"52px 36px",textAlign:"center",cursor:"pointer",background:drag?"rgba(66,153,225,0.06)":"var(--navy2)",transition:"all .2s"}}>
        <i className="ti ti-cloud-upload" style={{fontSize:48,color:drag?"var(--blue)":"var(--t3)",display:"block",marginBottom:14}}/>
        <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>Drop OpenAPI Spec here</div>
        <div style={{fontSize:13,color:"var(--t3)"}}>JSON · YAML · Swagger 2.0 · OAS 3.x · Postman Collection</div>
        <div style={{marginTop:18,display:"inline-block",padding:"9px 22px",border:"1px solid var(--b2)",borderRadius:9,fontSize:13,color:"var(--t2)",background:"var(--navy3)"}}>Browse files</div>
      </div>
      {loaded&&(
        <div className="glass" style={{animation:"fadeUp .3s ease"}}>
          <div style={{padding:"16px 22px",borderBottom:"1px solid var(--b1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <span style={{fontWeight:700,fontSize:14}}>petstore.yaml</span>
              <span style={{fontSize:11,color:"var(--t3)",marginLeft:12,fontFamily:"var(--mono)"}}>{OPENAPI_EPS.length} endpoints · 3 schemas</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              {["Scan All","Export Report"].map(t=>(
                <button key={t} style={{padding:"7px 14px",border:"1px solid var(--b2)",borderRadius:7,fontSize:11,cursor:"pointer",background:"var(--navy3)",color:"var(--t2)",fontWeight:600}}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"64px 220px 1fr 90px 40px",gap:12,padding:"10px 22px",borderBottom:"1px solid var(--b1)"}}>
            {["METHOD","PATH","DESCRIPTION","STATUS",""].map(h=><span key={h} style={{fontSize:9,fontWeight:700,color:"var(--t3)",letterSpacing:"0.12em",fontFamily:"var(--mono)"}}>{h}</span>)}
          </div>
          {OPENAPI_EPS.map((ep,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"64px 220px 1fr 90px 40px",alignItems:"center",gap:12,padding:"13px 22px",borderBottom:i<OPENAPI_EPS.length-1?"1px solid var(--b1)":"none",cursor:"pointer",transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(66,153,225,0.03)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{fontSize:10,fontWeight:800,fontFamily:"var(--mono)",color:METHOD_CLR[ep.method]||"var(--cyan)"}}>{ep.method}</span>
              <code style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--t1)"}}>{ep.path}</code>
              <span style={{fontSize:12,color:"var(--t2)"}}>{ep.desc}</span>
              <Chip status={ep.status} small/>
              <i className="ti ti-chevron-right" style={{fontSize:14,color:"var(--t3)"}}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   POSTMAN VIEW
═══════════════════════════════════════════════════════════ */
function PostmanView(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div className="glass" style={{padding:"24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <div style={{width:48,height:48,borderRadius:12,background:"rgba(255,106,0,0.12)",border:"1px solid rgba(255,106,0,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ti ti-brand-postman" style={{fontSize:26,color:"#ff6a00"}}/>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:15}}>Postman Integration</div>
            <div style={{fontSize:12,color:"var(--t3)",fontFamily:"var(--mono)"}}>4 collections synced · auto-scan enabled</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
            <LiveDot color="var(--green2)" size={5}/>
            <span style={{fontSize:11,color:"var(--green2)",fontFamily:"var(--mono)",fontWeight:600}}>CONNECTED</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {POSTMAN_COLS.map((c,i)=>{
            const s=SEV[c.status];
            return(
              <div key={i} style={{background:"var(--navy3)",border:`1px solid ${s.border}`,borderRadius:12,padding:"18px 20px",cursor:"pointer",transition:"transform .2s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <span style={{fontWeight:700,fontSize:13}}>{c.name}</span>
                  <Chip status={c.status} small/>
                </div>
                <div style={{display:"flex",gap:16,fontSize:11,fontFamily:"var(--mono)",color:"var(--t3)"}}>
                  <span>{c.reqs} requests</span>
                  <span style={{color:c.issues>0?s.color:"var(--green2)"}}>{c.issues} issues</span>
                  <span style={{marginLeft:"auto"}}>{c.updated}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GITHUB VIEW
═══════════════════════════════════════════════════════════ */
function GitHubView(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div className="glass" style={{padding:"24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <div style={{width:48,height:48,borderRadius:12,background:"rgba(255,255,255,0.06)",border:"1px solid var(--b2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ti ti-brand-github" style={{fontSize:26,color:"var(--t1)"}}/>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:15}}>GitHub Integration</div>
            <div style={{fontSize:12,color:"var(--t3)",fontFamily:"var(--mono)"}}>@acme-org · 6 repos monitored</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <LiveDot color="var(--green2)" size={5}/>
            <Chip status="safe" small/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {GITHUB_REPOS.map((r,i)=>{
            const s=SEV[r.status];
            return(
              <div key={i} style={{background:"var(--navy3)",border:`1px solid var(--b1)`,borderRadius:12,padding:"18px",cursor:"pointer",transition:"border-color .2s, transform .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=s.border;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <code style={{fontSize:11,fontWeight:700,fontFamily:"var(--mono)",color:"var(--t1)"}}>{r.name}</code>
                  <ScoreArc score={r.score} color={s.color} size={44}/>
                </div>
                <div style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)",marginBottom:10}}>⎇ {r.branch}</div>
                <div style={{display:"flex",gap:12,fontSize:11}}>
                  <span style={{color:"var(--blue)"}}><i className="ti ti-git-pull-request" style={{fontSize:11,marginRight:3}}/>{r.prs} PRs</span>
                  <span style={{color:r.issues>0?s.color:"var(--green2)"}}><i className="ti ti-alert-circle" style={{fontSize:11,marginRight:3}}/>{r.issues} issues</span>
                </div>
                <div style={{marginTop:10,fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)"}}>{r.scan}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CI/CD VIEW
═══════════════════════════════════════════════════════════ */
function CICDView(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {CICD_INTEGRATIONS.map((c,i)=>(
          <div key={i} className="glass card-hover" style={{padding:"20px 22px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:10,background:"var(--navy3)",border:"1px solid var(--b1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <i className={`ti ${c.icon}`} style={{fontSize:20,color:c.on?"var(--blue2)":"var(--t3)"}}/>
                </div>
                <span style={{fontWeight:700,fontSize:13,color:c.on?"var(--t1)":"var(--t3)"}}>{c.name}</span>
              </div>
              {c.on&&<LiveDot color="var(--green2)" size={5}/>}
            </div>
            {c.on?(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:11,color:"var(--t3)"}}>Success rate</span>
                  <span style={{fontSize:11,fontFamily:"var(--mono)",color:"var(--green2)",fontWeight:700}}>{Math.round((c.ok/c.runs)*100)}%</span>
                </div>
                <div style={{height:3,background:"var(--navy4)",borderRadius:2,marginBottom:10}}>
                  <div style={{height:"100%",width:`${(c.ok/c.runs)*100}%`,background:"linear-gradient(90deg,var(--green2)60,var(--green2))",borderRadius:2}}/>
                </div>
                <div style={{fontSize:11,color:"var(--t3)",fontFamily:"var(--mono)"}}>{c.runs} runs scanned</div>
              </div>
            ):(
              <button style={{width:"100%",padding:"9px",background:"linear-gradient(135deg,rgba(66,153,225,0.12),transparent)",color:"var(--blue2)",border:"1px solid rgba(66,153,225,0.25)",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:"0.04em"}}>
                Connect →
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="glass">
        <div style={{padding:"16px 22px",borderBottom:"1px solid var(--b1)",fontWeight:700,fontSize:13}}>Recent Pipeline Runs</div>
        {PIPELINES.map((p,i)=>{
          const s=SEV[p.status];
          return(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",alignItems:"center",gap:16,padding:"13px 22px",borderBottom:i<PIPELINES.length-1?"1px solid var(--b1)":"none"}}>
              <div>
                <code style={{fontSize:13,fontWeight:700,fontFamily:"var(--mono)"}}>{p.name}</code>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{p.commit}</div>
              </div>
              <code style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)"}}>⎇ {p.branch}</code>
              <code style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)"}}>{p.time}</code>
              <Chip status={p.status} small/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PIPELINES VIEW
═══════════════════════════════════════════════════════════ */
function PipelinesView(){ return <CICDView/>; }

/* ═══════════════════════════════════════════════════════════
   REPORTS VIEW
═══════════════════════════════════════════════════════════ */
function ReportsView(){
  return(
    <div className="glass">
      <div style={{padding:"18px 24px",borderBottom:"1px solid var(--b1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:14}}>Generated Reports</span>
        <button style={{padding:"8px 16px",background:"linear-gradient(135deg,var(--blue),var(--indigo))",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:"0.04em"}}>
          <i className="ti ti-plus" style={{marginRight:6}}/>Generate New
        </button>
      </div>
      {REPORTS_LIST.map((r,i)=>{
        const color=r.score>80?"var(--green2)":r.score>60?"var(--amber)":"var(--red)";
        return(
          <div key={i} style={{display:"flex",alignItems:"center",gap:18,padding:"18px 24px",borderBottom:i<REPORTS_LIST.length-1?"1px solid var(--b1)":"none",cursor:"pointer",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(66,153,225,0.03)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:44,height:52,background:"rgba(252,129,129,0.1)",border:"1px solid rgba(252,129,129,0.2)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <i className="ti ti-file-type-pdf" style={{fontSize:22,color:"var(--red)"}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{r.name}</div>
              <div style={{fontSize:11,color:"var(--t3)",fontFamily:"var(--mono)"}}>{r.date} · {r.pages} pages · {r.size}</div>
            </div>
            <div style={{textAlign:"right",marginRight:16}}>
              <div style={{fontSize:22,fontWeight:800,color,fontFamily:"var(--mono)",textShadow:`0 0 10px ${color}50`}}>{r.score}<span style={{fontSize:12}}>/100</span></div>
            </div>
            <button style={{padding:"8px 16px",border:"1px solid var(--b2)",borderRadius:8,background:"var(--navy3)",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:6,color:"var(--t2)",fontWeight:600}}>
              <i className="ti ti-download" style={{fontSize:13}}/>Download
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANALYTICS VIEW
═══════════════════════════════════════════════════════════ */
function AnalyticsView(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="glass" style={{padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>Scan Trends — Full Year</div>
          <div style={{fontSize:11,color:"var(--t3)",marginBottom:18}}>Monthly breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SCAN_TREND} margin={{top:5,right:10,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="ga1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4299e1" stopOpacity={0.4}/><stop offset="95%" stopColor="#4299e1" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{fill:"#4a5568",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#4a5568",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="scans" name="Scans" stroke="#4299e1" strokeWidth={2} fill="url(#ga1)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass" style={{padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>Issues vs Resolved</div>
          <div style={{fontSize:11,color:"var(--t3)",marginBottom:18}}>Monthly comparison</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SCAN_TREND} margin={{top:5,right:10,left:-20,bottom:0}}>
              <XAxis dataKey="m" tick={{fill:"#4a5568",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#4a5568",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="issues" name="Issues" fill="#fc8181" radius={[3,3,0,0]} opacity={0.8}/>
              <Bar dataKey="resolved" name="Resolved" fill="#00ff94" radius={[3,3,0,0]} opacity={0.8}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
        <div className="glass" style={{padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:18}}>API Risk Heatmap — Top Endpoints</div>
          {ENDPOINTS_DATA.map((e,i)=>{
            const s=SEV[e.status];
            const pct=parseFloat(e.calls)*1.5;
            return(
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:9,fontWeight:800,fontFamily:"var(--mono)",color:METHOD_CLR[e.method]}}>{e.method}</span>
                    <code style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--t1)"}}>{e.path}</code>
                  </div>
                  <span style={{fontSize:11,fontFamily:"var(--mono)",color:s.color,fontWeight:700}}>{e.calls} calls</span>
                </div>
                <div style={{height:4,background:"var(--navy4)",borderRadius:2}}>
                  <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:`linear-gradient(90deg,${s.color}60,${s.color})`,borderRadius:2,boxShadow:`0 0 6px ${s.color}40`}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div className="glass" style={{padding:"22px"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:18}}>Threat Pie</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={THREAT_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {THREAT_PIE.map((e,i)=><Cell key={i} fill={e.color} opacity={0.9}/>)}
              </Pie>
              <Tooltip content={<CustomTooltip/>}/>
            </PieChart>
          </ResponsiveContainer>
          {THREAT_PIE.slice(0,4).map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:2,background:t.color,flexShrink:0}}/>
                <span style={{fontSize:11,color:"var(--t2)"}}>{t.name}</span>
              </div>
              <span style={{fontSize:11,fontWeight:700,fontFamily:"var(--mono)",color:t.color}}>{t.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS VIEW
═══════════════════════════════════════════════════════════ */
function SettingsView(){
  const [notif,setNotif]=useState({email:true,slack:false,pagerduty:false,webhook:true});
  const [thresh,setThresh]=useState("high");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:720}}>
      {[
        {title:"Notifications",icon:"ti-bell",content:(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {Object.entries(notif).map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,textTransform:"capitalize"}}>{k} Notifications</div>
                  <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>Receive alerts via {k}</div>
                </div>
                <button onClick={()=>setNotif(n=>({...n,[k]:!v}))}
                  style={{width:44,height:24,borderRadius:12,background:v?"linear-gradient(135deg,var(--blue),var(--indigo))":"var(--navy4)",border:"none",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                  <span style={{position:"absolute",top:2,left:v?22:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
                </button>
              </div>
            ))}
          </div>
        )},
        {title:"Alert Threshold",icon:"ti-adjustments",content:(
          <div>
            <p style={{fontSize:12,color:"var(--t2)",marginBottom:14}}>Minimum severity to trigger alerts</p>
            <div style={{display:"flex",gap:8}}>
              {["critical","high","medium","low"].map(t=>{
                const s=SEV[t];
                return(
                  <button key={t} onClick={()=>setThresh(t)}
                    style={{flex:1,padding:"10px",border:`1px solid ${thresh===t?s.border:"var(--b1)"}`,borderRadius:9,background:thresh===t?s.bg:"var(--navy3)",color:thresh===t?s.color:"var(--t3)",fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:"0.06em",fontFamily:"var(--mono)",transition:"all .15s"}}>
                    {t.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        )},
        {title:"API Key",icon:"ti-key",content:(
          <div style={{display:"flex",gap:10}}>
            <input readOnly value="ag_sk_••••••••••••••••••••••••••••••••"
              style={{flex:1,padding:"10px 14px",background:"var(--navy3)",border:"1px solid var(--b2)",borderRadius:9,color:"var(--t2)",fontSize:13,fontFamily:"var(--mono)"}}/>
            <button style={{padding:"10px 18px",background:"var(--navy3)",border:"1px solid var(--b2)",borderRadius:9,color:"var(--t2)",fontSize:12,fontWeight:600,cursor:"pointer"}}>
              <i className="ti ti-copy"/>
            </button>
            <button style={{padding:"10px 18px",background:"rgba(252,129,129,0.1)",border:"1px solid rgba(252,129,129,0.25)",borderRadius:9,color:"var(--red)",fontSize:12,fontWeight:600,cursor:"pointer"}}>Regenerate</button>
          </div>
        )},
      ].map((s,i)=>(
        <div key={i} className="glass" style={{padding:"22px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,paddingBottom:16,borderBottom:"1px solid var(--b1)"}}>
            <i className={`ti ${s.icon}`} style={{fontSize:18,color:"var(--blue2)"}}/>
            <span style={{fontWeight:700,fontSize:14}}>{s.title}</span>
          </div>
          {s.content}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROFILE VIEW
═══════════════════════════════════════════════════════════ */
function ProfileView({user}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:720}}>
      <div className="glass" style={{padding:"28px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:28,paddingBottom:24,borderBottom:"1px solid var(--b1)"}}>
          <div style={{width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,var(--blue),var(--indigo))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"#fff",flexShrink:0}}>
            {user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
          </div>
          <div>
            <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.3px"}}>{user.name}</div>
            <div style={{fontSize:13,color:"var(--t2)",marginTop:2}}>{user.email}</div>
            <div style={{marginTop:8}}><Chip status="safe"/></div>
          </div>
          <button style={{marginLeft:"auto",padding:"9px 18px",background:"linear-gradient(135deg,var(--blue),var(--indigo))",color:"#fff",border:"none",borderRadius:9,fontWeight:700,fontSize:12,cursor:"pointer",letterSpacing:"0.04em"}}>Edit Profile</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[{l:"Full Name",v:user.name},{l:"Email",v:user.email},{l:"Role",v:user.role||"Platform Lead"},{l:"Plan",v:"Pro — $49/mo"},{l:"Member Since",v:"Jan 2024"},{l:"APIs Monitored",v:"1,284"}].map(f=>(
            <div key={f.l} style={{background:"var(--navy3)",borderRadius:10,padding:"14px 16px",border:"1px solid var(--b1)"}}>
              <div style={{fontSize:10,color:"var(--t3)",fontWeight:600,letterSpacing:"0.06em",marginBottom:4}}>{f.l}</div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--t1)"}}>{f.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
//docs view
function DocsView() {
  return (
    <div className="glass" style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>ApiGuard Documentation</h2>
      <div style={{ color: "var(--t2)", lineHeight: "1.8", fontSize: "15px" }}>
        <h3 style={{ color: "var(--blue2)", marginTop: "20px" }}>1. Getting Started</h3>
        <p>ApiGuard is an API security platform. Integrate it into your CI/CD pipelines to catch vulnerabilities before deployment.</p>
        
        <h3 style={{ color: "var(--blue2)", marginTop: "20px" }}>2. Security Rules</h3>
        <ul style={{ paddingLeft: "20px" }}>
          <li><strong>Auth:</strong> Always validate JWT tokens on the server.</li>
          <li><strong>Input:</strong> Sanitize all incoming user data to prevent Injection.</li>
          <li><strong>Rate Limiting:</strong> Enforce 1000 requests per minute per IP.</li>
        </ul>

        <h3 style={{ color: "var(--blue2)", marginTop: "20px" }}>3. Integration</h3>
        <p>Add our middleware to your backend: <code>npm install apiguard-sdk</code></p>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════ */
const VIEW_MAP = {
  dashboard:DashboardView, scan:ScanView, openapi:OpenAPIView,
  postman:PostmanView, github:GitHubView, cicd:CICDView,
  pipelines:PipelinesView, reports:ReportsView, analytics:AnalyticsView,
  endpoints:EndpointsView, alerts:AlertsView, settings:SettingsView, profile:ProfileView,
  docs: DocsView,
};

export default function App(){
  const [user,setUser]=useState(null);
  const [active,setActive]=useState("dashboard");
  const activeNav=NAV_ITEMS.find(n=>n.id===active);
  const View=VIEW_MAP[active]||DashboardView;

  if(!user) return(
    <>
      <style>{GLOBAL_CSS}</style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"/>
      <LoginPage onLogin={setUser}/>
    </>
  );

  return(
    <>
      <style>{GLOBAL_CSS}</style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"/>
      <div style={{display:"flex",minHeight:"100vh",position:"relative"}}>
        <BgBlobs/>
        <Sidebar active={active} setActive={setActive} user={user} onLogout={()=>setUser(null)}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"auto",position:"relative",zIndex:1}}>
          <Topbar page={activeNav?.label||"Dashboard"} user={user} alerts={ALERTS} setActive={setActive}/>
          <div style={{flex:1,padding:24,overflowY:"auto"}}>
            <View key={active} user={user}/>
          </div>
        </div>
      </div>
    </>
  );
}