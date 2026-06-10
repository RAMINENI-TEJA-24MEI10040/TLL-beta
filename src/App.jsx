import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";
import ww from './assets/ww.png';
import dashboardImg from './assets/dashboard.png'
import alertsImg from './assets/alert.png'

/* ============================================================
   THEME ENGINE
============================================================ */
const buildCSS = (mode, hue) => {
  const d = mode === "dark";
  return `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
    :root {
      --hue:${hue};
      --bg:       ${d?"hsl(224,16%,6%)":"hsl(220,25%,97%)"};
      --surface:  ${d?"hsl(224,14%,10%)" :"hsl(0,0%,100%)"};
      --surface2: ${d?"hsl(224,13%,14%)" :"hsl(220,20%,94%)"};
      --surface3: ${d?"hsl(224,12%,19%)" :"hsl(220,18%,89%)"};
      --border:   ${d?"hsl(224,12%,21%)" :"hsl(220,18%,87%)"};
      --border2:  ${d?"hsl(224,12%,28%)" :"hsl(220,18%,80%)"};
      --t1:${d?"hsl(0,0%,97%)":"hsl(224,20%,10%)"};
      --t2:${d?"hsl(220,10%,58%)":"hsl(224,12%,40%)"};
      --t3:${d?"hsl(220,8%,36%)":"hsl(224,12%,60%)"};
      --p:       hsl(${hue},78%,56%);
      --p-lite:  hsl(${hue},78%,${d?"66":"44"}%);
      --p-dim:   hsla(${hue},78%,56%,0.14);
      --p-dim2:  hsla(${hue},78%,56%,0.07);
      --p-glow:  0 0 28px hsla(${hue},78%,56%,0.38);
      --red:#ef4469; --orange:#f5803f; --blue:#3b98f5; --green:#34d484; --purple:#9f7aea; --yellow:#f0c940;
      --font:'Inter',sans-serif; --display:'Syne',sans-serif; --mono:'JetBrains Mono',monospace;
      --r-xl:26px; --r-lg:18px; --r-md:13px; --r-sm:9px; --r-pill:999px;
      --shadow:${d?"0 8px 40px rgba(0,0,0,0.55)":"0 8px 40px rgba(0,0,0,0.07)"};
      --glow-red:   0 0 20px hsla(348,88%,60%,0.35);
      --glow-green: 0 0 20px hsla(148,72%,54%,0.35);
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:var(--font);background:var(--bg);color:var(--t1);overflow-x:hidden;transition:background .3s,color .3s}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:var(--r-pill)}
    button{cursor:pointer;border:none;background:none;font-family:var(--font);transition:all .18s ease}
    input,textarea,select{font-family:var(--font)}
    a{text-decoration:none;color:inherit}

    /* Cards */
    .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);padding:24px;box-shadow:var(--shadow);position:relative;overflow:hidden;transition:border-color .2s,transform .2s,box-shadow .2s}
    .card:hover{border-color:var(--border2)}
    .card-sm{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px}
    .card-xs{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:12px}

    /* Buttons */
    .btn-primary{background:var(--p);color:${hue>40&&hue<200?"#000":"#fff"};font-weight:700;font-size:13px;border-radius:var(--r-pill);padding:0 22px;height:40px;display:inline-flex;align-items:center;gap:8px;box-shadow:var(--p-glow);letter-spacing:.02em;font-family:var(--font)}
    .btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px)}
    .btn-primary:active{transform:translateY(0)}
    .btn-ghost{color:var(--t2);font-size:13px;font-weight:600;border-radius:var(--r-pill);padding:0 18px;height:38px;display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);background:var(--surface2)}
    .btn-ghost:hover{color:var(--t1);border-color:var(--border2);background:var(--surface3)}
    .btn-icon{width:38px;height:38px;border-radius:var(--r-pill);background:var(--surface2);border:1px solid var(--border);color:var(--t2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .btn-icon:hover{color:var(--t1);border-color:var(--border2)}
    .btn-danger{background:hsla(348,88%,60%,0.14);color:var(--red);border:1px solid hsla(348,88%,60%,0.28);font-size:12px;font-weight:700;border-radius:var(--r-pill);padding:0 16px;height:34px;display:inline-flex;align-items:center;gap:6px}
    .btn-danger:hover{background:hsla(348,88%,60%,0.25)}
    .btn-success{background:hsla(148,72%,54%,0.14);color:var(--green);border:1px solid hsla(148,72%,54%,0.28);font-size:12px;font-weight:700;border-radius:var(--r-pill);padding:0 16px;height:34px;display:inline-flex;align-items:center;gap:6px}
    .btn-success:hover{background:hsla(148,72%,54%,0.25)}

    /* Tags */
    .tag{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:7px;font-size:11px;font-weight:700;font-family:var(--mono);text-transform:uppercase;letter-spacing:.04em}
    .tag-crit{background:hsla(348,88%,60%,0.14);color:var(--red);border:1px solid hsla(348,88%,60%,0.28)}
    .tag-high{background:hsla(28,88%,58%,0.14);color:var(--orange);border:1px solid hsla(28,88%,58%,0.28)}
    .tag-med{background:hsla(213,88%,62%,0.14);color:var(--blue);border:1px solid hsla(213,88%,62%,0.28)}
    .tag-safe{background:hsla(148,72%,54%,0.14);color:var(--green);border:1px solid hsla(148,72%,54%,0.28)}
    .tag-warn{background:hsla(45,90%,55%,0.14);color:var(--yellow);border:1px solid hsla(45,90%,55%,0.28)}

    /* Nav */
    .nav-item{display:flex;align-items:center;gap:11px;padding:9px 13px;border-radius:var(--r-md);font-size:13px;font-weight:600;color:var(--t2);border:1px solid transparent;cursor:pointer;transition:all .18s;width:100%;text-align:left}
    .nav-item:hover{color:var(--t1);background:var(--surface2)}
    .nav-item.active{background:var(--p-dim);color:var(--p-lite);border-color:hsla(${hue},78%,56%,.22)}
    .nav-item .badge{margin-left:auto;background:var(--red);color:#fff;font-size:10px;font-weight:800;padding:2px 7px;border-radius:var(--r-pill)}
    .nav-item .chip{margin-left:auto;background:var(--surface3);color:var(--t3);font-size:10px;font-weight:700;padding:2px 7px;border-radius:var(--r-pill);font-family:var(--mono)}
    .nav-sub{padding-left:38px;font-size:12px;font-weight:500}

    /* Animations */
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideLeft{from{transform:translateX(110%)}to{transform:none}}
    @keyframes slideRight{from{transform:translateX(-110%)}to{transform:none}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes termLine{from{width:0}to{width:100%}}
    @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes ripple{0%{transform:scale(0);opacity:.6}100%{transform:scale(2.5);opacity:0}}
    @keyframes ping{0%{transform:scale(1);opacity:.8}100%{transform:scale(2);opacity:0}}

    .au   {animation:fadeUp .38s cubic-bezier(.22,.68,0,1.2) both}
    .au1  {animation:fadeUp .38s cubic-bezier(.22,.68,0,1.2) .07s both}
    .au2  {animation:fadeUp .38s cubic-bezier(.22,.68,0,1.2) .14s both}
    .au3  {animation:fadeUp .38s cubic-bezier(.22,.68,0,1.2) .21s both}
    .au4  {animation:fadeUp .38s cubic-bezier(.22,.68,0,1.2) .28s both}
    .au5  {animation:fadeUp .38s cubic-bezier(.22,.68,0,1.2) .35s both}
    .si   {animation:scaleIn .3s cubic-bezier(.22,.68,0,1.2) both}
    .term-line{overflow:hidden;white-space:nowrap;animation:termLine .42s steps(44,end)}

    /* Search */
    .search-bar{display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-pill);padding:0 18px;height:40px;transition:border-color .2s}
    .search-bar:focus-within{border-color:var(--p)}
    .search-bar input{background:none;border:none;outline:none;color:var(--t1);font-size:13px;min-width:0}

    /* Table */
    .tr{transition:background .15s}
    .tr:hover{background:var(--surface2)!important}

    /* Misc */
    .orb{position:absolute;border-radius:50%;filter:blur(45px);pointer-events:none}
    .sec-label{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-bottom:9px;padding-left:3px}
    .progress-track{height:5px;background:var(--surface3);border-radius:var(--r-pill);overflow:hidden}
    .progress-fill{height:100%;border-radius:var(--r-pill);transition:width 1.2s cubic-bezier(.22,.68,0,1.1)}
    .method{font-family:var(--mono);font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px}
    .method-GET{background:hsla(148,72%,54%,0.14);color:var(--green)}
    .method-POST{background:hsla(213,88%,62%,0.14);color:var(--blue)}
    .method-PUT{background:hsla(45,88%,55%,0.14);color:var(--yellow)}
    .method-DELETE{background:hsla(348,88%,60%,0.14);color:var(--red)}
    .method-PATCH{background:hsla(280,78%,63%,0.14);color:var(--purple)}
    .dot{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0}
    .shimmer{background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}

    /* Drawer */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);z-index:200;animation:fadeIn .2s}
    .drawer{position:fixed;right:0;top:0;height:100%;width:360px;background:var(--surface);border-left:1px solid var(--border);padding:32px 26px;z-index:201;animation:slideLeft .26s cubic-bezier(.22,.68,0,1.1);overflow-y:auto}

    /* Modal */
    .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);z-index:300;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s;padding:20px}
    .modal{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-xl);box-shadow:var(--shadow);width:100%;animation:scaleIn .28s cubic-bezier(.22,.68,0,1.2)}

    /* Login */
    .login-gradient{background:linear-gradient(135deg,hsl(${hue},78%,12%) 0%,hsl(224,16%,6%) 50%,hsl(${(hue+60)%360},60%,10%) 100%);background-size:400% 400%;animation:gradShift 8s ease infinite}
    .login-card{background:hsla(224,14%,10%,.92);backdrop-filter:blur(24px);border:1px solid hsla(${hue},78%,56%,.2);border-radius:28px}
    .login-input{background:hsla(224,12%,14%,.8);border:1px solid var(--border);border-radius:var(--r-lg);padding:12px 18px;color:var(--t1);font-size:14px;width:100%;outline:none;transition:border-color .2s,box-shadow .2s;font-family:var(--font)}
    .login-input:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--p-dim)}
    .login-input::placeholder{color:var(--t3)}
    .grid-lines{position:absolute;inset:0;background-image:linear-gradient(hsla(${hue},50%,50%,.05) 1px,transparent 1px),linear-gradient(90deg,hsla(${hue},50%,50%,.05) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}

    /* Toggle */
    .toggle-wrap{display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-pill);padding:4px;gap:4px}
    .toggle-opt{padding:7px 18px;border-radius:var(--r-pill);font-size:12px;font-weight:700;color:var(--t3);border:1px solid transparent;transition:all .2s}
    .toggle-opt.on{background:var(--surface);color:var(--t1);border-color:var(--border2)}

    /* Calendar */
    .cal-day{width:30px;height:30px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--t2);cursor:pointer;transition:all .15s}
    .cal-day:hover{background:var(--surface3);color:var(--t1)}
    .cal-day.today{background:var(--p);color:${hue>40&&hue<200?"#000":"#fff"};font-weight:800}
    .cal-day.event::after{content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--p)}
    .cal-day.event{position:relative}

    /* AI streaming */
    .ai-cursor::after{content:'▋';animation:pulse .8s infinite;color:var(--p)}

    /* Hue swatch */
    .hue-dot{width:36px;height:36px;border-radius:50%;cursor:pointer;transition:transform .15s,box-shadow .15s;flex-shrink:0}
    .hue-dot:hover{transform:scale(1.15)}

    /* Toast */
    .toast{position:fixed;bottom:28px;right:28px;background:var(--surface);border:1px solid var(--border2);padding:14px 20px;border-radius:var(--r-pill);display:flex;align-items:center;gap:12px;box-shadow:var(--shadow);z-index:600;animation:fadeUp .3s cubic-bezier(.22,.68,0,1.2);font-size:13px;font-weight:600}
    .toast-err{border-color:hsla(348,88%,60%,.35)}

    /* Upload zone */
    .drop-zone{border:2px dashed var(--border2);border-radius:var(--r-xl);padding:48px;text-align:center;transition:border-color .2s,background .2s;cursor:pointer}
    .drop-zone:hover,.drop-zone.drag-over{border-color:var(--p);background:var(--p-dim2)}

    /* Tabs */
    .tab-bar{display:flex;gap:4px;border-bottom:1px solid var(--border);margin-bottom:24px}
    .tab{padding:10px 18px;font-size:13px;font-weight:600;color:var(--t3);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .2s;cursor:pointer}
    .tab.active{color:var(--p-lite);border-bottom-color:var(--p)}
    .tab:hover{color:var(--t1)}

    /* Phase badge */
    .phase-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:var(--r-pill);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    .phase-1{background:hsla(148,72%,54%,.14);color:var(--green);border:1px solid hsla(148,72%,54%,.28)}
    .phase-2{background:hsla(213,88%,62%,.14);color:var(--blue);border:1px solid hsla(213,88%,62%,.28)}
    .phase-3{background:hsla(280,78%,63%,.14);color:var(--purple);border:1px solid hsla(280,78%,63%,.28)}
    .phase-ai{background:linear-gradient(135deg,hsla(280,78%,63%,.2),hsla(213,88%,62%,.2));color:var(--p-lite);border:1px solid var(--p-dim)}
  `;
};

/* ============================================================
   ICONS
============================================================ */
const Ic = (paths, vb="0 0 24 24") => ({ s=16, c="currentColor", sw=1.8 }={}) => (
  <svg width={s} height={s} viewBox={vb} fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);
const IcShield     = Ic(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>);
const IcLayout     = Ic(<><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>);
const IcGlobe      = Ic(<><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>);
const IcAlert      = Ic(<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>);
const IcGitHub     = Ic(<><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></>);
const IcBar        = Ic(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>);
const IcSettings   = Ic(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>);
const IcBell       = Ic(<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>);
const IcSearch     = Ic(<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>);
const IcTerminal   = Ic(<><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>);
const IcPlay       = Ic(<><polygon points="5 3 19 12 5 21 5 3"/></>);
const IcDownload   = Ic(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>);
const IcMoon       = Ic(<><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>);
const IcSun        = Ic(<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>);
const IcX          = Ic(<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>);
const IcCheck      = Ic(<><polyline points="20 6 9 17 4 12"/></>);
const IcArrowUp    = Ic(<><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>);
const IcArrowDown  = Ic(<><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>);
const IcEye        = Ic(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>);
const IcCopy       = Ic(<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>);
const IcRefresh    = Ic(<><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>);
const IcZap        = Ic(<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>);
const IcPlus       = Ic(<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>);
const IcCPU        = Ic(<><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>);
const IcPackage    = Ic(<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>);
const IcFileText   = Ic(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>);
const IcPipeline   = Ic(<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>);
const IcUsers      = Ic(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>);
const IcStar       = Ic(<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>);
const IcLock       = Ic(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>);
const IcMail       = Ic(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>);
const IcSparkles   = Ic(<><path d="M12 3L13.5 8.5H19L14.5 12L16 17.5L12 14L8 17.5L9.5 12L5 8.5H10.5L12 3Z"/><path d="M5 3L5.75 5.5H8L6 7L6.75 9.5L5 8L3.25 9.5L4 7L2 5.5H4.25L5 3Z" strokeWidth="1.4"/><path d="M19 14L19.75 16.5H22L20 18L20.75 20.5L19 19L17.25 20.5L18 18L16 16.5H18.25L19 14Z" strokeWidth="1.4"/></>);
const IcActivity   = Ic(<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>);
const IcServer     = Ic(<><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>);
const IcDiff       = Ic(<><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/><line x1="5" y1="5" x2="19" y2="5"/></>);
const IcCode       = Ic(<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>);
const IcPostman    = Ic(<><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>);
const IcCI         = Ic(<><path d="M21 3H3v7h18V3z"/><path d="M21 14H3v7h18v-7z"/><line x1="7" y1="7" x2="7.01" y2="7"/><line x1="7" y1="18" x2="7.01" y2="18"/></>);

/* ============================================================
   MOCK DATA
============================================================ */
const SCAN_DATA = [
  {m:'Jan',scans:120,issues:28,resolved:20,score:78},
  {m:'Feb',scans:180,issues:45,resolved:38,score:74},
  {m:'Mar',scans:240,issues:61,resolved:58,score:80},
  {m:'Apr',scans:310,issues:72,resolved:65,score:76},
  {m:'May',scans:480,issues:54,resolved:50,score:84},
  {m:'Jun',scans:520,issues:49,resolved:47,score:87},
  {m:'Jul',scans:610,issues:38,resolved:36,score:89},
  {m:'Aug',scans:720,issues:33,resolved:32,score:91},
  {m:'Sep',scans:820,issues:28,resolved:28,score:92},
  {m:'Oct',scans:890,issues:22,resolved:22,score:93},
  {m:'Nov',scans:960,issues:18,resolved:18,score:93},
  {m:'Dec',scans:1050,issues:14,resolved:14,score:94},
];

const UPTIME_DATA = Array.from({length:24},(_,i)=>({h:`${String(i).padStart(2,'0')}:00`,uptime:Math.random()>.05?100:Math.floor(Math.random()*80+10),latency:Math.floor(Math.random()*40+12),errors:Math.floor(Math.random()*8)}));

const LOAD_DATA = {
  100: Array.from({length:10},(_,i)=>({t:`${i*10}s`,rps:Math.floor(Math.random()*40+80),latency:Math.floor(Math.random()*20+30),errors:Math.floor(Math.random()*3)})),
  1000:Array.from({length:10},(_,i)=>({t:`${i*10}s`,rps:Math.floor(Math.random()*200+600),latency:Math.floor(Math.random()*80+120),errors:Math.floor(Math.random()*15)})),
};

const RADAR_DATA = [
  {subject:'Auth',A:90,B:65,fullMark:100},
  {subject:'Injection',A:85,B:78,fullMark:100},
  {subject:'BOLA',A:72,B:55,fullMark:100},
  {subject:'Exposure',A:88,B:70,fullMark:100},
  {subject:'Misconfig',A:95,B:80,fullMark:100},
  {subject:'Rate Limit',A:68,B:60,fullMark:100},
];

const ENDPOINTS = [
  {m:'GET',    p:'/api/v1/health',          s:'safe', l:'12ms',  c:'124.5k', r:'pawsitive-api',  auth:'JWT',     changed:false},
  {m:'POST',   p:'/api/v1/auth/login',      s:'high', l:'180ms', c:'45.2k',  r:'med-bot-gw',     auth:'None',    changed:true},
  {m:'PUT',    p:'/api/v1/users/profile',   s:'med',  l:'85ms',  c:'12.1k',  r:'gfg-vit-api',    auth:'JWT',     changed:false},
  {m:'DELETE', p:'/api/v1/admin/purge',     s:'crit', l:'400ms', c:'8',      r:'skitech-backend', auth:'None',   changed:true},
  {m:'GET',    p:'/api/v1/predict/sleep',   s:'safe', l:'450ms', c:'8.4k',   r:'sleep-predictor', auth:'JWT',   changed:false},
  {m:'POST',   p:'/api/v1/input/numerical', s:'safe', l:'22ms',  c:'9.1k',   r:'alice-os-core',  auth:'API Key', changed:false},
  {m:'GET',    p:'/api/v1/sensors/mpu6050', s:'med',  l:'15ms',  c:'2M+',    r:'pawsitive-api',  auth:'JWT',     changed:false},
  {m:'PATCH',  p:'/api/v1/bot/navigate',    s:'crit', l:'55ms',  c:'450',    r:'med-bot-gw',     auth:'None',    changed:true},
  {m:'GET',    p:'/api/v1/bot/status',      s:'safe', l:'8ms',   c:'1.2M',   r:'med-bot-gw',     auth:'JWT',     changed:false},
  {m:'DELETE', p:'/api/v1/users/{id}',      s:'high', l:'110ms', c:'12',     r:'gfg-vit-api',    auth:'JWT',     changed:false},
];

const ALERTS = [
  {id:1,type:'crit', msg:'BOLA on /api/v1/bot/navigate',                   t:'2m ago',  repo:'med-bot-gw',     fix:'Add object-level auth checks',        cve:'CVE-2024-1234'},
  {id:2,type:'high', msg:'Rate limit missing on /api/v1/auth/login',       t:'15m ago', repo:'med-bot-gw',     fix:'Sliding window rate limiter',          cve:'CVE-2024-5678'},
  {id:3,type:'med',  msg:'Unencrypted MPU6050 sensor payload',             t:'1h ago',  repo:'pawsitive-api',  fix:'Enable TLS 1.3 for sensor stream',     cve:null},
  {id:4,type:'crit', msg:'Admin purge exposed without JWT',                t:'3h ago',  repo:'skitech-backend',fix:'Add jwt.verify() middleware',           cve:'CVE-2024-9012'},
  {id:5,type:'safe', msg:'Alice OS numeric input validation patched',      t:'1d ago',  repo:'alice-os-core',  fix:'N/A — resolved',                       cve:null},
  {id:6,type:'med',  msg:'Acoustic fingerprinting pitch variance failure', t:'2d ago',  repo:'pawsitive-api',  fix:'Revisit FFT window sizing',            cve:null},
  {id:7,type:'high', msg:'Swap cost loop in worker node',                  t:'2d ago',  repo:'skitech-backend',fix:'Add loop termination guard',            cve:'CVE-2024-3456'},
  {id:8,type:'safe', msg:'Sleep predictor model synced',                   t:'3d ago',  repo:'sleep-predictor',fix:'N/A — resolved',                       cve:null},
];

const REPOS = [
  {n:'pawsitive-diagnosis-api',  b:'main',              s:'safe', t:'10m ago', u:12, lang:'Python',  stars:34, prs:2},
  {n:'alice-os-core',            b:'feature/num-input', s:'med',  t:'1h ago',  u:4,  lang:'C++',     stars:21, prs:1},
  {n:'sleep-predictor-svc',      b:'main',              s:'safe', t:'3h ago',  u:8,  lang:'Python',  stars:18, prs:0},
  {n:'skitech-innothon-backend', b:'develop',           s:'high', t:'1d ago',  u:22, lang:'Node.js', stars:9,  prs:4},
  {n:'med-bot-gateway',          b:'main',              s:'crit', t:'2d ago',  u:45, lang:'Go',      stars:55, prs:7},
  {n:'gfg-vit-chapter-api',      b:'main',              s:'safe', t:'4d ago',  u:2,  lang:'Node.js', stars:7,  prs:0},
];

const SCAN_HISTORY = [
  {id:'SCN-001',target:'pawsitive-diagnosis-api',date:'2026-05-31 20:13',score:94,issues:3,status:'completed',duration:'2m 14s'},
  {id:'SCN-002',target:'med-bot-gateway',         date:'2026-05-31 18:00',score:61,issues:12,status:'completed',duration:'4m 08s'},
  {id:'SCN-003',target:'alice-os-core',           date:'2026-05-30 14:22',score:82,issues:5,status:'completed',duration:'1m 55s'},
  {id:'SCN-004',target:'skitech-innothon-backend',date:'2026-05-29 09:10',score:57,issues:18,status:'failed',   duration:'0m 44s'},
  {id:'SCN-005',target:'sleep-predictor-svc',     date:'2026-05-28 16:45',score:96,issues:1,status:'completed',duration:'1m 32s'},
];

const CHANGES = [
  {type:'added',   endpoint:'/api/v2/predict/sleep',  repo:'sleep-predictor-svc',  time:'2h ago', auth:'JWT'},
  {type:'removed', endpoint:'/api/v1/legacy/auth',    repo:'med-bot-gw',           time:'1d ago', auth:'None'},
  {type:'auth',    endpoint:'/api/v1/auth/login',     repo:'med-bot-gw',           time:'2d ago', auth:'None→JWT'},
  {type:'added',   endpoint:'/api/v1/sensors/dht22',  repo:'pawsitive-api',        time:'3d ago', auth:'API Key'},
];

const PIE_THREATS = [
  {name:'Broken Auth',value:35,color:'#ef4469'},
  {name:'BOLA',       value:25,color:'#f5803f'},
  {name:'Injection',  value:20,color:'#3b98f5'},
  {name:'Misconfig',  value:12,color:'#9f7aea'},
  {name:'Other',      value:8, color:'#34d484'},
];

const MOCK_ENDPOINTS_SPEC = [
  {m:'GET',  p:'/users',       desc:'List all users',            params:['page','limit'],auth:'Bearer'},
  {m:'POST', p:'/users',       desc:'Create a new user',         params:['body'],        auth:'Bearer'},
  {m:'GET',  p:'/users/{id}',  desc:'Get user by ID',            params:['id'],          auth:'Bearer'},
  {m:'PUT',  p:'/users/{id}',  desc:'Update user',               params:['id','body'],   auth:'Bearer'},
  {m:'DELETE',p:'/users/{id}', desc:'Delete user',               params:['id'],          auth:'Admin'},
  {m:'POST', p:'/auth/login',  desc:'Authenticate & get token',  params:['body'],        auth:'None'},
  {m:'POST', p:'/auth/refresh',desc:'Refresh access token',      params:['body'],        auth:'Bearer'},
];

/* ============================================================
   HELPERS
============================================================ */
const sc = s => ({crit:'var(--red)',high:'var(--orange)',med:'var(--blue)',safe:'var(--green)'}[s]||'var(--t3)');
const Tag = ({s}) => <span className={`tag tag-${s}`}>{s}</span>;
const Spinner = ({s=18}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin .8s linear infinite'}}>
    <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);
const ChartTip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div className="card-xs" style={{minWidth:130}}>
      <div style={{fontSize:11,color:'var(--t3)',marginBottom:6,fontFamily:'var(--mono)'}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:3,fontSize:12}}>
          <span style={{width:8,height:8,borderRadius:'50%',background:p.color,display:'inline-block',flexShrink:0}}/>
          <span style={{color:'var(--t2)'}}>{p.name}:</span>
          <strong style={{color:'var(--t1)'}}>{typeof p.value==='number'?p.value.toLocaleString():p.value}</strong>
        </div>
      ))}
    </div>
  );
};
const SectionHeader = ({title,subtitle,action,className=''}) => (
  <div className={className} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
    <div>
      <div style={{fontSize:15,fontWeight:700,color:'var(--t1)',fontFamily:'var(--display)'}}>{title}</div>
      {subtitle&&<div style={{fontSize:12,color:'var(--t3)',marginTop:3}}>{subtitle}</div>}
    </div>
    {action}
  </div>
);
const ProgressBar = ({val,color='var(--p)',label,sub}) => (
  <div>
    {(label||sub!==undefined)&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
      {label&&<span style={{fontSize:12,color:'var(--t2)'}}>{label}</span>}
      {sub!==undefined&&<span style={{fontSize:12,fontWeight:700,fontFamily:'var(--mono)',color}}>{sub}</span>}
    </div>}
    <div className="progress-track">
      <div className="progress-fill" style={{width:`${val}%`,background:color}}/>
    </div>
  </div>
);

/* ============================================================
   CALENDAR
============================================================ */
const CalWidget = () => {
  const now = new Date();
  const [mo,setMo]=useState(now.getMonth());
  const [yr,setYr]=useState(now.getFullYear());
  const dim=new Date(yr,mo+1,0).getDate();
  const fd =new Date(yr,mo,1).getDay();
  const evts=useMemo(()=>{const s=new Set();for(let i=0;i<12;i++)s.add(Math.floor(Math.random()*dim)+1);return s;},[mo,yr]);
  const MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <button className="btn-icon" style={{width:28,height:28}} onClick={()=>mo===0?(setMo(11),setYr(y=>y-1)):setMo(m=>m-1)}><IcArrowDown s={13}/></button>
        <span style={{fontSize:13,fontWeight:700,color:'var(--t1)'}}>{MN[mo]} {yr}</span>
        <button className="btn-icon" style={{width:28,height:28}} onClick={()=>mo===11?(setMo(0),setYr(y=>y+1)):setMo(m=>m+1)}><IcArrowUp s={13}/></button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:6}}>
        {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{textAlign:'center',fontSize:10,fontWeight:700,color:'var(--t3)',padding:'3px 0'}}>{d}</div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2}}>
        {Array(fd).fill(null).map((_,i)=><div key={`e${i}`}/>)}
        {Array(dim).fill(null).map((_,i)=>{
          const day=i+1,isT=day===now.getDate()&&mo===now.getMonth()&&yr===now.getFullYear(),hasE=evts.has(day);
          return <div key={day} className={`cal-day${isT?' today':''}${hasE&&!isT?' event':''}`}>{day}</div>;
        })}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10}}>
        <span className="dot" style={{background:'var(--p)'}}/>
        <span style={{fontSize:11,color:'var(--t3)'}}>Scan scheduled</span>
      </div>
    </div>
  );
};

/* ============================================================
   AI MODAL (Calls Anthropic API)
============================================================ */
const AIModal = ({title,icon,prompt,close}) => {
  const [output,setOutput]=useState('');
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [copied,setCopied]=useState(false);

  const run = useCallback(async () => {
    setLoading(true);setOutput('');setDone(false);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{role:'user',content:prompt}]
        })
      });
      const data = await res.json();
      const text = data?.content?.filter(b=>b.type==='text').map(b=>b.text).join('') || 'No response received.';
      let i=0;
      const interval=setInterval(()=>{
        if(i<=text.length){setOutput(text.slice(0,i));i++;}
        else{clearInterval(interval);setDone(true);}
      },8);
    } catch(e) {
      setOutput('Error: Could not reach AI service. Please check your API key configuration.\n\n'+e.message);
      setDone(true);
    }
    setLoading(false);
  },[prompt]);

  useEffect(()=>{run();},[]);

  const copy = ()=>{navigator.clipboard?.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),2000);};

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:720}}>
        <div style={{padding:'24px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:42,height:42,borderRadius:14,background:'var(--p-dim)',color:'var(--p)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {icon}
            </div>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:'var(--t1)',fontFamily:'var(--display)'}}>{title}</div>
              <div style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Powered by Claude AI</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            {done&&<button className="btn-ghost" style={{fontSize:12,height:34}} onClick={run}><IcRefresh s={13}/>Regenerate</button>}
            {done&&<button className="btn-ghost" style={{fontSize:12,height:34}} onClick={copy}>{copied?<IcCheck s={13}/>:<IcCopy s={13}/>}{copied?'Copied!':'Copy'}</button>}
            <button className="btn-icon" onClick={close}><IcX s={15}/></button>
          </div>
        </div>
        <div style={{padding:28}}>
          {loading&&!output&&(
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[1,2,3,4].map(i=><div key={i} className="shimmer" style={{height:14,borderRadius:6,width:['100%','85%','92%','70%'][i-1]}}/>)}
              <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8,color:'var(--p)',fontSize:13}}>
                <Spinner s={16}/>Generating with Claude AI…
              </div>
            </div>
          )}
          {output&&(
            <pre style={{fontFamily:'var(--mono)',fontSize:12.5,lineHeight:1.85,color:'var(--t1)',whiteSpace:'pre-wrap',wordBreak:'break-word',maxHeight:400,overflowY:'auto',background:'hsla(220,14%,6%,.6)',padding:20,borderRadius:16,border:'1px solid var(--border)'}}>
              {output}{!done&&<span className="ai-cursor"/>}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SCAN MODAL
============================================================ */
const ScanModal = ({close,setToast}) => {
  const [target,setTarget]=useState('pawsitive-diagnosis-api');
  const [step,setStep]=useState(0);
  const [logs,setLogs]=useState([]);
  const [started,setStarted]=useState(false);
  const logRef=useRef(null);
  const steps=['Initializing Nuclei engine…','Fetching OpenAPI 3.0 schema…','Running OWASP Top 10 heuristics…','Testing BOLA / IDOR boundaries…','Simulating payload injection…','Checking JWT leaks & misconfigs…','Compiling threat report…'];
  const done=step===steps.length;

  const start=()=>{setStarted(true);setLogs([]);setStep(0);};
  useEffect(()=>{
    if(!started)return;
    let i=0;
    const t=setInterval(()=>{
      if(i<steps.length){
        const ts=new Date().toISOString().split('T')[1].slice(0,12);
        setLogs(p=>[...p,`[${ts}] ${steps[i]}`]);setStep(i+1);i++;
      } else {clearInterval(t);setLogs(p=>[...p,'[SUCCESS] Scan complete — 3 vulnerabilities found.']);setToast('Scan completed!');}
    },780);
    return()=>clearInterval(t);
  },[started]);
  useEffect(()=>{if(logRef.current)logRef.current.scrollTop=logRef.current.scrollHeight;},[logs]);

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:640}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:13}}>
            <div style={{width:42,height:42,borderRadius:14,background:'var(--p-dim)',color:'var(--p)',display:'flex',alignItems:'center',justifyContent:'center'}}><IcTerminal s={20}/></div>
            <div>
              <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>Security Scan</div>
              <div style={{fontSize:12,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:2}}>Target: {target}</div>
            </div>
          </div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          {!started&&(
            <div style={{marginBottom:22}}>
              <div className="sec-label">Select Target</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {REPOS.map(r=>(
                  <button key={r.n} onClick={()=>setTarget(r.n)} style={{padding:'6px 14px',borderRadius:'var(--r-pill)',fontSize:12,fontWeight:600,background:target===r.n?'var(--p-dim)':'var(--surface2)',color:target===r.n?'var(--p-lite)':'var(--t2)',border:`1px solid ${target===r.n?'var(--p)':'var(--border)'}`}}>
                    {r.n}
                  </button>
                ))}
              </div>
            </div>
          )}
          {started&&(
            <div style={{marginBottom:18}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7,fontSize:12,fontWeight:700,fontFamily:'var(--mono)'}}>
                <span style={{color:'var(--p)'}}>PROGRESS</span>
                <span>{Math.round((step/steps.length)*100)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{width:`${(step/steps.length)*100}%`,background:'var(--p)',boxShadow:'var(--p-glow)'}}/>
              </div>
            </div>
          )}
          {started&&(
            <div ref={logRef} style={{background:'#080c12',borderRadius:16,padding:18,height:210,overflowY:'auto',border:'1px solid var(--border)',fontFamily:'var(--mono)',fontSize:12,lineHeight:1.9,display:'flex',flexDirection:'column',gap:3}}>
              {logs.map((l,i)=><div key={i} className="term-line" style={{color:l.includes('SUCCESS')?'var(--green)':'#8899aa'}}>{l}</div>)}
              {started&&!done&&<div style={{color:'var(--p)',display:'flex',alignItems:'center',gap:8}}><span style={{animation:'pulse .9s infinite'}}>█</span>Scanning…</div>}
            </div>
          )}
          <div style={{display:'flex',gap:12,marginTop:20}}>
            {!started&&<button className="btn-primary" onClick={start} style={{flex:1,justifyContent:'center',height:44}}><IcPlay s={14}/>Start Scan</button>}
            {done&&<button className="btn-primary" onClick={close} style={{flex:1,justifyContent:'center',height:44}}><IcEye s={14}/>View Full Report</button>}
            <button className="btn-ghost" onClick={close} style={{height:44,padding:'0 24px'}}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PDF REPORT MODAL
============================================================ */
const PDFModal = ({close,setToast}) => {
  const [selected,setSelected]=useState('full');
  const [gen,setGen]=useState(false);
  const [done,setDone]=useState(false);
  const opts=[
    {id:'full',label:'Full Security Report',desc:'All vulnerabilities, endpoints, recommendations'},
    {id:'exec',label:'Executive Summary',desc:'High-level metrics & risk overview (2 pages)'},
    {id:'vuln',label:'Vulnerability Report',desc:'CVEs, OWASP categories, fix suggestions'},
    {id:'comp',label:'Compliance Report',desc:'OWASP API Top 10, ISO 27001 alignment'},
  ];
  const generate=()=>{
    setGen(true);
    setTimeout(()=>{setGen(false);setDone(true);setToast('PDF report downloaded!');},2200);
  };
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:560}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>Generate PDF Report</div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          <div className="sec-label">Report Type</div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
            {opts.map(o=>(
              <div key={o.id} onClick={()=>setSelected(o.id)} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',borderRadius:'var(--r-lg)',border:`1px solid ${selected===o.id?'var(--p)':'var(--border)'}`,background:selected===o.id?'var(--p-dim2)':'var(--surface2)',cursor:'pointer',transition:'all .2s'}}>
                <div style={{width:18,height:18,borderRadius:'50%',border:`2px solid ${selected===o.id?'var(--p)':'var(--border2)'}`,background:selected===o.id?'var(--p)':'none',flexShrink:0}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--t1)'}}>{o.label}</div>
                  <div style={{fontSize:12,color:'var(--t3)',marginTop:2}}>{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {done?(
            <div style={{textAlign:'center',padding:'20px 0'}}>
              <div style={{fontSize:40,marginBottom:12}}>📄</div>
              <div style={{fontSize:15,fontWeight:700,color:'var(--green)'}}>Report Ready!</div>
              <div style={{fontSize:12,color:'var(--t3)',marginTop:4}}>Your PDF has been downloaded.</div>
            </div>
          ):(
            <button className="btn-primary" onClick={generate} style={{width:'100%',justifyContent:'center',height:46}} disabled={gen}>
              {gen?<><Spinner s={15}/>Generating…</>:<><IcDownload s={14}/>Generate & Download</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   OPENAPI IMPORTER MODAL
============================================================ */
const OpenAPIModal = ({close,setToast}) => {
  const [tab,setTab]=useState('upload');
  const [url,setUrl]=useState('');
  const [dragging,setDragging]=useState(false);
  const [file,setFile]=useState(null);
  const [parsing,setParsing]=useState(false);
  const [parsed,setParsed]=useState(false);

  const doImport=()=>{
    setParsing(true);
    setTimeout(()=>{setParsing(false);setParsed(true);setToast('OpenAPI spec imported — 7 endpoints discovered!');},1800);
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:640}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>Import OpenAPI / Swagger</div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          <div className="tab-bar">
            {['upload','url','paste'].map(t=><div key={t} className={`tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</div>)}
          </div>
          {tab==='upload'&&(
            <div className={`drop-zone${dragging?' drag-over':''}`}
              onDragOver={e=>{e.preventDefault();setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files[0];if(f)setFile(f);}}>
              {file?(
                <div>
                  <div style={{fontSize:32,marginBottom:8}}>📋</div>
                  <div style={{fontWeight:700,color:'var(--t1)',fontSize:14}}>{file.name}</div>
                  <div style={{fontSize:12,color:'var(--t3)',marginTop:4}}>{(file.size/1024).toFixed(1)} KB</div>
                </div>
              ):(
                <div>
                  <div style={{fontSize:40,marginBottom:12}}>☁️</div>
                  <div style={{fontWeight:700,color:'var(--t1)',fontSize:14}}>Drop your OpenAPI file here</div>
                  <div style={{fontSize:12,color:'var(--t3)',marginTop:4}}>Supports .json, .yaml, .yml — Swagger 2.0 & OpenAPI 3.x</div>
                </div>
              )}
            </div>
          )}
          {tab==='url'&&(
            <div>
              <div className="sec-label">Spec URL</div>
              <input className="login-input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://api.example.com/openapi.json" style={{marginBottom:16}}/>
              <div style={{fontSize:12,color:'var(--t3)'}}>We'll fetch and parse the spec from this URL directly.</div>
            </div>
          )}
          {tab==='paste'&&(
            <textarea className="login-input" rows={8} placeholder="Paste your OpenAPI JSON or YAML here…" style={{resize:'vertical'}}/>
          )}
          {parsed?(
            <div>
              <div style={{fontWeight:700,color:'var(--green)',marginBottom:14,marginTop:20,fontSize:14}}>✓ Spec imported successfully</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {MOCK_ENDPOINTS_SPEC.map((e,i)=>(
                  <div key={i} className="card-sm" style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px'}}>
                    <span className={`method method-${e.m}`}>{e.m}</span>
                    <code style={{fontFamily:'var(--mono)',fontSize:13,color:'var(--t1)',flex:1}}>{e.p}</code>
                    <span style={{fontSize:12,color:'var(--t3)'}}>{e.desc}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={close} style={{marginTop:20,width:'100%',justifyContent:'center',height:44}}>
                <IcCheck s={14}/>Done — Start Scanning
              </button>
            </div>
          ):(
            <button className="btn-primary" onClick={doImport} style={{width:'100%',justifyContent:'center',height:44,marginTop:20}} disabled={parsing}>
              {parsing?<><Spinner s={15}/>Parsing spec…</>:<><IcPackage s={14}/>Import & Discover Endpoints</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   LOAD TESTING MODAL
============================================================ */
const LoadTestModal = ({close,setToast}) => {
  const [users,setUsers]=useState(100);
  const [target,setTarget]=useState('/api/v1/health');
  const [running,setRunning]=useState(false);
  const [done,setDone]=useState(false);
  const [progress,setProgress]=useState(0);

  const run=()=>{
    setRunning(true);setProgress(0);setDone(false);
    let p=0;
    const t=setInterval(()=>{
      p+=10;setProgress(p);
      if(p>=100){clearInterval(t);setRunning(false);setDone(true);setToast(`Load test (${users} users) complete!`);}
    },300);
  };

  const data=LOAD_DATA[users===100?100:1000];

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:680}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>Load Testing</div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:22}}>
            <div>
              <div className="sec-label">Target Endpoint</div>
              <input className="login-input" value={target} onChange={e=>setTarget(e.target.value)} style={{width:'100%'}}/>
            </div>
            <div>
              <div className="sec-label">Virtual Users</div>
              <div style={{display:'flex',gap:8}}>
                {[100,1000].map(u=>(
                  <button key={u} onClick={()=>setUsers(u)} style={{flex:1,height:44,borderRadius:'var(--r-lg)',fontSize:13,fontWeight:700,background:users===u?'var(--p-dim)':'var(--surface2)',color:users===u?'var(--p-lite)':'var(--t2)',border:`1px solid ${users===u?'var(--p)':'var(--border)'}`}}>
                    {u.toLocaleString()} users
                  </button>
                ))}
              </div>
            </div>
          </div>
          {(running||done)&&(
            <>
              <div style={{marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:12,fontWeight:700,fontFamily:'var(--mono)'}}>
                  <span style={{color:'var(--p)'}}>RUNNING {users} VIRTUAL USERS</span>
                  <span>{progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width:`${progress}%`,background:'var(--p)'}}/>
                </div>
              </div>
              {done&&(
                <>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
                    {[{l:'Avg RPS',v:data.reduce((a,b)=>a+b.rps,0)/data.length|0,c:'var(--green)'},{l:'Avg Latency',v:(data.reduce((a,b)=>a+b.latency,0)/data.length|0)+'ms',c:'var(--blue)'},{l:'Total Errors',v:data.reduce((a,b)=>a+b.errors,0),c:'var(--red)'}].map(x=>(
                      <div key={x.l} className="card-sm" style={{textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:800,fontFamily:'var(--mono)',color:x.c}}>{x.v}</div>
                        <div style={{fontSize:11,color:'var(--t3)',marginTop:3}}>{x.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{height:160}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data} margin={{top:0,right:0,left:-20,bottom:0}}>
                        <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}}/>
                        <Tooltip content={<ChartTip/>}/>
                        <Bar dataKey="rps" fill="var(--p)" opacity={.7} radius={[3,3,0,0]} barSize={12} name="RPS"/>
                        <Line type="monotone" dataKey="latency" stroke="var(--orange)" strokeWidth={2} dot={false} name="Latency(ms)"/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </>
          )}
          <div style={{display:'flex',gap:12,marginTop:20}}>
            <button className="btn-primary" onClick={run} disabled={running} style={{flex:1,justifyContent:'center',height:44}}>
              {running?<><Spinner s={15}/>Running…</>:<><IcZap s={14}/>Start Load Test</>}
            </button>
            <button className="btn-ghost" onClick={close} style={{height:44,padding:'0 24px'}}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MOCK SERVER MODAL
============================================================ */
const MockServerModal = ({close,setToast}) => {
  const [gen,setGen]=useState(false);
  const [ready,setReady]=useState(false);
  const [port,setPort]=useState('3001');
  const PORT_URL=`http://localhost:${port}`;

  const generate=()=>{
    setGen(true);
    setTimeout(()=>{setGen(false);setReady(true);setToast('Mock server is live on port '+port+'!');},2000);
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:560}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>API Mock Server</div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          <div style={{marginBottom:20,padding:16,borderRadius:'var(--r-lg)',background:'var(--p-dim2)',border:'1px solid var(--p-dim)',fontSize:13,color:'var(--t2)',lineHeight:1.6}}>
            Generate a fully working mock server from your imported OpenAPI spec. Perfect for frontend dev & integration testing.
          </div>
          <div style={{marginBottom:20}}>
            <div className="sec-label">Port</div>
            <input className="login-input" value={port} onChange={e=>setPort(e.target.value)} style={{width:120}}/>
          </div>
          {ready&&(
            <div style={{marginBottom:20}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <span className="dot" style={{background:'var(--green)',boxShadow:'0 0 8px var(--green)'}}/>
                <span style={{fontSize:13,fontWeight:700,color:'var(--green)'}}>Mock server running at {PORT_URL}</span>
              </div>
              {MOCK_ENDPOINTS_SPEC.slice(0,5).map((e,i)=>(
                <div key={i} className="card-sm" style={{display:'flex',gap:10,alignItems:'center',marginBottom:8,padding:'10px 14px'}}>
                  <span className={`method method-${e.m}`}>{e.m}</span>
                  <code style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--t1)',flex:1}}>{PORT_URL}{e.p}</code>
                  <button className="btn-icon" style={{width:26,height:26}} onClick={()=>{navigator.clipboard?.writeText(PORT_URL+e.p);setToast('Copied!');}}>
                    <IcCopy s={11}/>
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{display:'flex',gap:12}}>
            <button className="btn-primary" onClick={generate} disabled={gen} style={{flex:1,justifyContent:'center',height:44}}>
              {gen?<><Spinner s={15}/>Generating…</>:<><IcServer s={14}/>{ready?'Restart Server':'Generate Mock Server'}</>}
            </button>
            <button className="btn-ghost" onClick={close} style={{height:44,padding:'0 24px'}}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   VIEW: DASHBOARD
============================================================ */
const ViewDashboard = ({setToast,openModal}) => (
  <div style={{display:'flex',flexDirection:'column',gap:22}}>
    {/* Greeting */}
    <div className="au" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
      <div>
        <div style={{fontSize:28,fontWeight:800,fontFamily:'var(--display)',letterSpacing:'-0.5px',color:'var(--t1)',lineHeight:1.2}}>
          Glad to see you again, <span style={{color:'var(--p)'}}>Kartikeya.</span>
        </div>
        <div style={{fontSize:13,color:'var(--t2)',marginTop:7}}>
          Here's your API security overview · {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
        </div>
      </div>
      <div style={{display:'flex',gap:10}}>
        <button className="btn-ghost" onClick={()=>openModal('pdf')}><IcDownload s={14}/>Export Report</button>
        <button className="btn-primary" onClick={()=>openModal('scan')}><IcPlay s={14}/>New Scan</button>
      </div>
    </div>

    {/* Stat cards */}
    <div className="au1" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
      {[
        {label:'APIs Scanned',  val:'1,284', delta:'+12%', deltaGood:true,  color:'var(--p)',    icon:<IcGlobe s={16}/>,   prog:78},
        {label:'Critical Threats',val:'23',  delta:'-8%',  deltaGood:true,  color:'var(--red)',  icon:<IcAlert s={16}/>,   prog:23},
        {label:'Security Score',val:'94%',   delta:'+2.1%',deltaGood:true,  color:'var(--green)',icon:<IcShield s={16}/>,  prog:94},
        {label:'Live Pipelines',val:'17',    delta:'+3',   deltaGood:true,  color:'var(--purple)',icon:<IcPipeline s={16}/>,prog:65},
      ].map((c,i)=>(
        <div key={i} className="card">
          <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,background:c.color,borderRadius:'50%',filter:'blur(40px)',opacity:.14,pointerEvents:'none'}}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
            <span style={{fontSize:12,fontWeight:600,color:'var(--t2)'}}>{c.label}</span>
            <div style={{padding:6,borderRadius:9,background:`hsla(0,0%,50%,0.08)`,color:'var(--t2)'}}>{c.icon}</div>
          </div>
          <div style={{fontSize:36,fontWeight:800,fontFamily:'var(--display)',letterSpacing:'-1.5px',color:c.color,marginBottom:10}}>{c.val}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
            <span style={{background:`${c.color}22`,color:c.color,padding:'2px 8px',borderRadius:5,fontSize:11,fontWeight:700}}>{c.delta}</span>
            <span style={{fontSize:11,color:'var(--t3)'}}>vs last month</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{width:`${c.prog}%`,background:c.color}}/></div>
        </div>
      ))}
    </div>

    {/* Charts row */}
    <div className="au2" style={{display:'grid',gridTemplateColumns:'1.7fr 1fr',gap:16}}>
      <div className="card">
        <SectionHeader title="Scan Activity Overview" subtitle="+5 more this year vs 2024"
          action={<div style={{display:'flex',gap:14}}>{[{c:'var(--p)',l:'Scans'},{c:'var(--red)',l:'Issues'},{c:'var(--green)',l:'Resolved'}].map(x=>(
            <div key={x.l} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:600,color:'var(--t2)'}}>
              <span style={{width:8,height:8,borderRadius:2,background:x.c,display:'inline-block'}}/>{x.l}
            </div>))}</div>}/>
        <div style={{height:230}}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={SCAN_DATA} margin={{top:5,right:0,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="gScan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--p)" stopOpacity={0.3}/><stop offset="100%" stopColor="var(--p)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:11,fontFamily:'var(--mono)'}} dy={8}/>
              <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:11,fontFamily:'var(--mono)'}}/>
              <Tooltip content={<ChartTip/>} cursor={{fill:'var(--surface2)',opacity:.5}}/>
              <Bar dataKey="issues" fill="var(--red)" opacity={.45} radius={[3,3,0,0]} barSize={12} name="Issues"/>
              <Area type="monotone" dataKey="scans" stroke="var(--p)" strokeWidth={2.5} fill="url(#gScan)" name="Scans"/>
              <Line type="monotone" dataKey="resolved" stroke="var(--green)" strokeWidth={2} dot={false} name="Resolved"/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card" style={{display:'flex',flexDirection:'column'}}>
        <SectionHeader title="Security Score" subtitle="Last 30 days"/>
        <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
          <div style={{width:160,height:160,position:'relative'}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{v:94},{v:6}]} cx="50%" cy="50%" innerRadius={56} outerRadius={72} dataKey="v" stroke="none" startAngle={90} endAngle={-270}>
                  <Cell fill="var(--green)" style={{filter:'drop-shadow(0 0 8px var(--green))'}}/>
                  <Cell fill="var(--surface3)"/>
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:30,fontWeight:800,fontFamily:'var(--display)',color:'var(--t1)'}}>94<span style={{fontSize:16}}>%</span></span>
              <span style={{fontSize:11,color:'var(--green)',fontWeight:700}}>Excellent</span>
            </div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10,flex:1}}>
          {[{label:'Authentication',val:96,c:'var(--green)'},{label:'Injection Guards',val:91,c:'var(--p)'},{label:'Data Exposure',val:88,c:'var(--orange)'},{label:'Rate Limiting',val:74,c:'var(--blue)'}].map(x=>(
            <ProgressBar key={x.label} val={x.val} color={x.c} label={x.label} sub={`${x.val}%`}/>
          ))}
        </div>
      </div>
    </div>

    {/* Threat breakdown + Radar + Calendar */}
    <div className="au3" style={{display:'grid',gridTemplateColumns:'1fr 1fr 0.8fr',gap:16}}>
      <div className="card">
        <SectionHeader title="Threat Breakdown"/>
        <div style={{height:160,marginBottom:12}}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={PIE_THREATS} cx="50%" cy="50%" outerRadius={68} dataKey="value" stroke="none">
                {PIE_THREATS.map((e,i)=><Cell key={i} fill={e.color} opacity={.85}/>)}
              </Pie>
              <Tooltip content={<ChartTip/>}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {PIE_THREATS.map(t=>(
            <div key={t.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span className="dot" style={{background:t.color}}/><span style={{fontSize:12,color:'var(--t2)'}}>{t.name}</span>
              </div>
              <span style={{fontSize:12,fontWeight:700,fontFamily:'var(--mono)',color:'var(--t1)'}}>{t.value}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionHeader title="Security Radar"/>
        <div style={{height:220}}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_DATA} margin={{top:10,right:20,left:20,bottom:10}}>
              <PolarGrid stroke="var(--border)"/>
              <PolarAngleAxis dataKey="subject" tick={{fill:'var(--t3)',fontSize:11,fontFamily:'var(--mono)'}}/>
              <Radar name="Current" dataKey="A" stroke="var(--p)" fill="var(--p)" fillOpacity={0.2} strokeWidth={2}/>
              <Radar name="Baseline" dataKey="B" stroke="var(--t3)" fill="var(--t3)" fillOpacity={0.08} strokeWidth={1.5}/>
              <Tooltip content={<ChartTip/>}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <SectionHeader title="Scan Schedule"/>
        <CalWidget/>
      </div>
    </div>

    {/* Quick actions */}
    <div className="au4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
      {[
        {label:'Import OpenAPI',  icon:<IcPackage s={20}/>, color:'var(--blue)',   desc:'Upload Swagger/YAML',       action:()=>openModal('openapi')},
        {label:'Run Load Test',   icon:<IcZap s={20}/>,     color:'var(--orange)', desc:'100 or 1000 virtual users', action:()=>openModal('loadtest')},
        {label:'Mock Server',     icon:<IcServer s={20}/>,  color:'var(--purple)', desc:'Generate fake APIs',        action:()=>openModal('mockserver')},
        {label:'Export PDF',      icon:<IcFileText s={20}/>,color:'var(--green)',  desc:'Download security report',  action:()=>openModal('pdf')},
      ].map((a,i)=>(
        <button key={i} className="card" onClick={a.action} style={{textAlign:'left',cursor:'pointer',border:'1px solid var(--border)',padding:20}}>
          <div style={{width:44,height:44,borderRadius:14,background:`${a.color}18`,color:a.color,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>{a.icon}</div>
          <div style={{fontSize:13,fontWeight:700,color:'var(--t1)',marginBottom:4}}>{a.label}</div>
          <div style={{fontSize:11,color:'var(--t3)'}}>{a.desc}</div>
        </button>
      ))}
    </div>

    {/* Alerts + Repos */}
    <div className="au5" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <div className="card">
        <SectionHeader title="Live Alert Feed" action={<button className="btn-ghost" style={{fontSize:11,height:30,padding:'0 12px'}} onClick={()=>setToast('All marked as read')}><IcCheck s={12}/>Mark Read</button>}/>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {ALERTS.slice(0,6).map((a,i)=>(
            <div key={a.id} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'11px 0',borderBottom:i<5?'1px solid var(--border)':'none'}}>
              <span className="dot" style={{background:sc(a.type),marginTop:5,boxShadow:`0 0 8px ${sc(a.type)}`}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:'var(--t1)',lineHeight:1.4}}>{a.msg}</div>
                <div style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:3}}>{a.repo} · {a.t}</div>
              </div>
              <Tag s={a.type}/>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <SectionHeader title="Monitored Repos" action={<button className="btn-ghost" style={{fontSize:11,height:30,padding:'0 12px'}}>View All</button>}/>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {REPOS.slice(0,5).map((r,i)=>(
            <div key={i} className="card-sm" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:11}}>
                <div style={{width:34,height:34,borderRadius:9,background:'var(--surface)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--t2)'}}>
                  <IcGitHub s={15}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--t1)'}}>{r.n}</div>
                  <div style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:1}}>{r.lang} · {r.b}</div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                <Tag s={r.s}/>
                <span style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)'}}>{r.t}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ============================================================
   VIEW: SCAN HISTORY
============================================================ */
const ViewScanHistory = ({openModal}) => {
  const [sel,setSel]=useState(null);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div className="au card" style={{padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:16}}>
          {[{l:'Total Scans',v:SCAN_HISTORY.length,c:'var(--p)'},{l:'Issues Found',v:SCAN_HISTORY.reduce((a,b)=>a+b.issues,0),c:'var(--red)'},{l:'Avg Score',v:Math.round(SCAN_HISTORY.reduce((a,b)=>a+b.score,0)/SCAN_HISTORY.length)+'%',c:'var(--green)'}].map(s=>(
            <div key={s.l} style={{display:'flex',alignItems:'center',gap:10,padding:'0 18px',borderRight:'1px solid var(--border)'}}>
              <div style={{fontSize:20,fontWeight:800,fontFamily:'var(--display)',color:s.c}}>{s.v}</div>
              <div style={{fontSize:12,color:'var(--t2)',fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={()=>openModal('scan')}><IcPlay s={14}/>New Scan</button>
      </div>
      <div className="card au1" style={{padding:0}}>
        <div style={{display:'grid',gridTemplateColumns:'110px 1.5fr 100px 80px 80px 100px',padding:'11px 22px',borderBottom:'1px solid var(--border)',fontSize:10,fontWeight:700,color:'var(--t3)',letterSpacing:'.09em',fontFamily:'var(--mono)'}}>
          <div>SCAN ID</div><div>TARGET</div><div>DATE</div><div>SCORE</div><div>ISSUES</div><div>STATUS</div>
        </div>
        {SCAN_HISTORY.map((s,i)=>(
          <div key={i} className="tr" onClick={()=>setSel(sel===i?null:i)} style={{display:'grid',gridTemplateColumns:'110px 1.5fr 100px 80px 80px 100px',padding:'14px 22px',borderBottom:i<SCAN_HISTORY.length-1?'1px solid var(--border)':'none',alignItems:'center',cursor:'pointer',background:sel===i?'var(--p-dim2)':'var(--surface)'}}>
            <div style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--p-lite)'}}>{s.id}</div>
            <div style={{fontSize:13,fontWeight:600,color:'var(--t1)'}}>{s.target}</div>
            <div style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)'}}>{s.date.split(' ')[0]}</div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:s.score>=90?'var(--green)':s.score>=70?'var(--orange)':'var(--red)'}}>{s.score}%</div>
            <div style={{fontSize:13,fontFamily:'var(--mono)',color:s.issues>0?'var(--red)':'var(--green)'}}>{s.issues}</div>
            <span style={{padding:'3px 10px',borderRadius:6,fontSize:11,fontWeight:700,fontFamily:'var(--mono)',background:s.status==='completed'?'hsla(148,72%,54%,.14)':'hsla(348,88%,60%,.14)',color:s.status==='completed'?'var(--green)':'var(--red)',display:'inline-block',width:'fit-content'}}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
      {sel!==null&&SCAN_HISTORY[sel]&&(
        <div className="card au" style={{borderColor:'var(--p)'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--display)'}}>Scan Detail — {SCAN_HISTORY[sel].id}</div>
            <button className="btn-icon" onClick={()=>setSel(null)}><IcX s={14}/></button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            {[{l:'Target',v:SCAN_HISTORY[sel].target},{l:'Score',v:SCAN_HISTORY[sel].score+'%'},{l:'Issues',v:SCAN_HISTORY[sel].issues},{l:'Duration',v:SCAN_HISTORY[sel].duration}].map(x=>(
              <div key={x.l} className="card-sm">
                <div style={{fontSize:11,color:'var(--t3)',marginBottom:4}}>{x.l}</div>
                <div style={{fontSize:14,fontWeight:700,fontFamily:'var(--mono)',color:'var(--t1)'}}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   VIEW: ENDPOINTS
============================================================ */
const ViewEndpoints = ({openModal}) => {
  const [filter,setFilter]=useState('all');
  const [search,setSearch]=useState('');
  const [sel,setSel]=useState(null);
  const filtered=useMemo(()=>{
    let d=filter==='all'?ENDPOINTS:ENDPOINTS.filter(x=>x.s===filter);
    if(search)d=d.filter(x=>x.p.includes(search)||x.r.includes(search)||x.m.includes(search.toUpperCase()));
    return d;
  },[filter,search]);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="card au" style={{padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:14}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {['all','safe','med','high','crit'].map(k=>(
            <button key={k} onClick={()=>setFilter(k)} style={{padding:'6px 14px',borderRadius:'var(--r-pill)',fontSize:11,fontWeight:700,fontFamily:'var(--mono)',textTransform:'uppercase',background:filter===k?'var(--t1)':'var(--surface2)',color:filter===k?'var(--bg)':'var(--t2)',border:`1px solid ${filter===k?'transparent':'var(--border)'}`}}>
              {k}{k!=='all'&&` (${ENDPOINTS.filter(x=>x.s===k).length})`}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:10}}>
          <div className="search-bar" style={{height:38}}>
            <IcSearch s={14} c="var(--t3)"/>
            <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {search&&<button onClick={()=>setSearch('')} style={{color:'var(--t3)'}}><IcX s={13}/></button>}
          </div>
          <button className="btn-ghost" onClick={()=>openModal('openapi')} style={{height:38,fontSize:12}}><IcPackage s={13}/>Import</button>
        </div>
      </div>
      <div className="card au1" style={{padding:0}}>
        <div style={{display:'grid',gridTemplateColumns:'80px 1.5fr 1.1fr 80px 80px 80px 70px',padding:'11px 22px',borderBottom:'1px solid var(--border)',fontSize:10,fontWeight:700,color:'var(--t3)',letterSpacing:'.09em',fontFamily:'var(--mono)'}}>
          <div>METHOD</div><div>PATH</div><div>REPOSITORY</div><div>AUTH</div><div>LATENCY</div><div>CALLS</div><div>STATUS</div>
        </div>
        {filtered.map((e,i)=>(
          <div key={i} className="tr" onClick={()=>setSel(sel===i?null:i)} style={{display:'grid',gridTemplateColumns:'80px 1.5fr 1.1fr 80px 80px 80px 70px',padding:'13px 22px',borderBottom:i<filtered.length-1?'1px solid var(--border)':'none',alignItems:'center',cursor:'pointer',background:sel===i?'var(--p-dim2)':'var(--surface)'}}>
            <div><span className={`method method-${e.m}`}>{e.m}</span></div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <code style={{fontFamily:'var(--mono)',fontSize:12.5,color:'var(--t1)'}}>{e.p}</code>
              {e.changed&&<span className="tag tag-warn" style={{fontSize:10}}>changed</span>}
            </div>
            <div style={{fontSize:12,color:'var(--t2)'}}>{e.r}</div>
            <div style={{fontSize:12,fontFamily:'var(--mono)',color:e.auth==='None'?'var(--red)':'var(--t2)'}}>{e.auth}</div>
            <div style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--t2)'}}>{e.l}</div>
            <div style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--t2)'}}>{e.c}</div>
            <Tag s={e.s}/>
          </div>
        ))}
        {filtered.length===0&&<div style={{padding:'60px',textAlign:'center',color:'var(--t3)',fontFamily:'var(--mono)',fontSize:13}}>No endpoints match.</div>}
      </div>
      {sel!==null&&filtered[sel]&&(
        <div className="card au" style={{borderColor:'var(--p)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span className={`method method-${filtered[sel].m}`} style={{fontSize:13,padding:'4px 12px'}}>{filtered[sel].m}</span>
              <code style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:700,color:'var(--t1)'}}>{filtered[sel].p}</code>
            </div>
            <button className="btn-icon" onClick={()=>setSel(null)}><IcX s={14}/></button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            {[{l:'Status',v:<Tag s={filtered[sel].s}/>},{l:'Auth',v:filtered[sel].auth},{l:'Latency',v:filtered[sel].l},{l:'Calls',v:filtered[sel].c}].map(x=>(
              <div key={x.l} className="card-sm">
                <div style={{fontSize:11,color:'var(--t3)',marginBottom:5}}>{x.l}</div>
                <div style={{fontSize:14,fontWeight:700,fontFamily:'var(--mono)',color:'var(--t1)'}}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   VIEW: ALERTS
============================================================ */
const ViewAlerts = ({setToast}) => {
  const [filter,setFilter]=useState('all');
  const [dismissed,setDismissed]=useState(new Set());
  const visible=useMemo(()=>ALERTS.filter(a=>!dismissed.has(a.id)&&(filter==='all'||a.type===filter)),[filter,dismissed]);
  const counts=useMemo(()=>({crit:ALERTS.filter(a=>a.type==='crit'&&!dismissed.has(a.id)).length,high:ALERTS.filter(a=>a.type==='high'&&!dismissed.has(a.id)).length,med:ALERTS.filter(a=>a.type==='med'&&!dismissed.has(a.id)).length,safe:ALERTS.filter(a=>a.type==='safe'&&!dismissed.has(a.id)).length}),[dismissed]);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="au" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
        {[{l:'Critical',k:'crit',c:'var(--red)'},{l:'High',k:'high',c:'var(--orange)'},{l:'Medium',k:'med',c:'var(--blue)'},{l:'Resolved',k:'safe',c:'var(--green)'}].map(x=>(
          <div key={x.k} className="card" onClick={()=>setFilter(f=>f===x.k?'all':x.k)} style={{textAlign:'center',cursor:'pointer',border:filter===x.k?`1px solid ${x.c}`:'1px solid var(--border)',transition:'all .2s'}}>
            <div style={{fontSize:32,fontWeight:800,fontFamily:'var(--display)',color:x.c,marginBottom:4}}>{counts[x.k]}</div>
            <div style={{fontSize:12,color:'var(--t2)',fontWeight:600}}>{x.l}</div>
          </div>
        ))}
      </div>
      <div className="card au1" style={{padding:'13px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:8}}>
          {['all','crit','high','med','safe'].map(k=>(
            <button key={k} onClick={()=>setFilter(k)} style={{padding:'6px 14px',borderRadius:'var(--r-pill)',fontSize:11,fontWeight:700,fontFamily:'var(--mono)',textTransform:'uppercase',background:filter===k?'var(--t1)':'var(--surface2)',color:filter===k?'var(--bg)':'var(--t2)',border:`1px solid ${filter===k?'transparent':'var(--border)'}`}}>{k}</button>
          ))}
        </div>
        <button className="btn-ghost" style={{fontSize:12,height:32,padding:'0 14px'}} onClick={()=>{setDismissed(new Set(ALERTS.map(a=>a.id)));setToast('All alerts dismissed');}}><IcCheck s={13}/>Dismiss All</button>
      </div>
      <div className="au2" style={{display:'flex',flexDirection:'column',gap:12}}>
        {visible.length===0&&(
          <div className="card" style={{textAlign:'center',padding:'60px'}}>
            <div style={{fontSize:40,marginBottom:12}}>✅</div>
            <div style={{fontSize:16,fontWeight:700,color:'var(--t1)'}}>All clear!</div>
            <div style={{fontSize:13,color:'var(--t3)',marginTop:4}}>No alerts match this filter.</div>
          </div>
        )}
        {visible.map(a=>(
          <div key={a.id} className="card" style={{borderLeft:`3px solid ${sc(a.type)}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{display:'flex',gap:14,flex:1}}>
                <div style={{width:38,height:38,borderRadius:11,flexShrink:0,background:`${sc(a.type)}18`,color:sc(a.type),display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <IcAlert s={17}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:7}}>
                    <Tag s={a.type}/>
                    {a.cve&&<span style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--t3)',background:'var(--surface2)',padding:'2px 7px',borderRadius:5,border:'1px solid var(--border)'}}>{a.cve}</span>}
                    <span style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)'}}>{a.t}</span>
                  </div>
                  <div style={{fontSize:13.5,fontWeight:600,color:'var(--t1)',lineHeight:1.45,marginBottom:8}}>{a.msg}</div>
                  <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                    <span style={{fontSize:12,color:'var(--t3)'}}>Repo: <strong style={{color:'var(--t2)'}}>{a.repo}</strong></span>
                    <span style={{fontSize:12,color:'var(--t3)'}}>Fix: <strong style={{color:'var(--t2)'}}>{a.fix}</strong></span>
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={()=>{setDismissed(p=>new Set([...p,a.id]));setToast('Alert dismissed');}}><IcX s={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   VIEW: GITHUB INTEGRATION
============================================================ */
const ViewGitHub = ({setToast}) => {
  const [connected,setConnected]=useState(new Set(['pawsitive-diagnosis-api','alice-os-core']));
  const toggle=n=>{setConnected(p=>{const nx=new Set(p);nx.has(n)?(nx.delete(n),setToast(`Disconnected: ${n}`)):(nx.add(n),setToast(`Connected: ${n}`));return nx;});};
  const LC={'Python':'var(--blue)','C++':'var(--orange)','Node.js':'var(--green)','Go':'var(--p)'};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="au" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {[{l:'Repositories',v:REPOS.length,c:'var(--p)'},{l:'Connected',v:connected.size,c:'var(--green)'},{l:'Pending PRs',v:REPOS.reduce((a,r)=>a+r.prs,0),c:'var(--orange)'}].map(x=>(
          <div key={x.l} className="card" style={{display:'flex',alignItems:'center',gap:16}}>
            <div style={{fontSize:32,fontWeight:800,fontFamily:'var(--display)',color:x.c}}>{x.v}</div>
            <div style={{fontSize:13,color:'var(--t2)',fontWeight:600}}>{x.l}</div>
          </div>
        ))}
      </div>
      <div className="au1" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {REPOS.map((r,i)=>(
          <div key={i} className="card" style={{border:connected.has(r.n)?'1px solid var(--p)':'1px solid var(--border)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:42,height:42,borderRadius:12,background:'var(--surface2)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--t2)'}}><IcGitHub s={20}/></div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--t1)'}}>{r.n}</div>
                  <div style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:2}}>
                    <span style={{color:LC[r.lang]||'var(--t2)'}}>{r.lang}</span> · {r.b}
                  </div>
                </div>
              </div>
              <Tag s={r.s}/>
            </div>
            <div style={{display:'flex',gap:20,marginBottom:16}}>
              {[{l:'Last push',v:r.t},{l:'Updates',v:r.u},{l:'Stars',v:r.stars},{l:'Open PRs',v:r.prs}].map(x=>(
                <div key={x.l}><div style={{fontSize:11,color:'var(--t3)'}}>{x.l}</div><div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:'var(--t1)',marginTop:2}}>{x.v}</div></div>
              ))}
            </div>
            <button onClick={()=>toggle(r.n)} className={connected.has(r.n)?'btn-danger':'btn-success'} style={{width:'100%',justifyContent:'center',height:36}}>
              {connected.has(r.n)?<><IcX s={13}/>Disconnect</>:<><IcPlus s={13}/>Connect</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   VIEW: API HEALTH MONITORING
============================================================ */
const ViewHealth = () => {
  const [live,setLive]=useState(true);
  const [data,setData]=useState(UPTIME_DATA);
  useEffect(()=>{if(!live)return;const t=setInterval(()=>setData(UPTIME_DATA.map(d=>({...d,latency:Math.floor(Math.random()*40+12),errors:Math.floor(Math.random()*8)}))),3000);return()=>clearInterval(t);},[live]);
  const avg=a=>(data.reduce((s,d)=>s+d[a],0)/data.length).toFixed(1);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="au" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:12}}>
          {[{l:'Avg Uptime',v:avg('uptime')+'%',c:'var(--green)'},{l:'Avg Latency',v:avg('latency')+'ms',c:'var(--blue)'},{l:'Total Errors',v:data.reduce((a,b)=>a+b.errors,0),c:'var(--red)'}].map(x=>(
            <div key={x.l} className="card-sm" style={{padding:'14px 20px',display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:22,fontWeight:800,fontFamily:'var(--display)',color:x.c}}>{x.v}</div>
              <div style={{fontSize:12,color:'var(--t2)',fontWeight:600}}>{x.l}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>setLive(l=>!l)} className={live?'btn-danger':'btn-success'} style={{height:38}}>
          {live?<><IcX s={13}/>Pause Live</>:<><IcRefresh s={13}/>Resume Live</>}
        </button>
      </div>
      <div className="card au1">
        <SectionHeader title="Uptime — Last 24h" subtitle={live?'Live refresh every 3s':'Paused'}
          action={<div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:live?'var(--green)':'var(--t3)'}}><span className="dot" style={{background:live?'var(--green)':'var(--t3)',boxShadow:live?'0 0 8px var(--green)':undefined}}/>{live?'LIVE':'PAUSED'}</div>}/>
        <div style={{height:200}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{top:5,right:0,left:-20,bottom:0}}>
              <defs><linearGradient id="gUp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--green)" stopOpacity={.3}/><stop offset="100%" stopColor="var(--green)" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10,fontFamily:'var(--mono)'}} interval={3} dy={8}/>
              <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10,fontFamily:'var(--mono)'}} domain={[0,105]}/>
              <Tooltip content={<ChartTip/>}/>
              <Area type="monotone" dataKey="uptime" stroke="var(--green)" strokeWidth={2.5} fill="url(#gUp)" name="Uptime(%)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="au2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="card">
          <SectionHeader title="Latency — Last 24h"/>
          <div style={{height:180}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{top:5,right:0,left:-20,bottom:0}}>
                <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}} interval={3} dy={8}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}}/>
                <Tooltip content={<ChartTip/>}/>
                <Line type="monotone" dataKey="latency" stroke="var(--blue)" strokeWidth={2} dot={false} name="Latency(ms)"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <SectionHeader title="Error Rate — Last 24h"/>
          <div style={{height:180}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{top:5,right:0,left:-20,bottom:0}}>
                <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}} interval={3} dy={8}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}}/>
                <Tooltip content={<ChartTip/>}/>
                <Bar dataKey="errors" fill="var(--red)" opacity={.7} radius={[3,3,0,0]} barSize={6} name="Errors"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   VIEW: API CHANGE DETECTION
============================================================ */
const ViewChanges = ({setToast}) => {
  const CTYPE={added:{c:'var(--green)',icon:<IcPlus s={14}/>,label:'Added'},removed:{c:'var(--red)',icon:<IcX s={14}/>,label:'Removed'},auth:{c:'var(--orange)',icon:<IcLock s={14}/>,label:'Auth Changed'}};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="au" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {[{t:'added',l:'New Endpoints'},{t:'removed',l:'Removed'},{t:'auth',l:'Auth Changed'}].map(x=>(
          <div key={x.t} className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:28,fontWeight:800,fontFamily:'var(--display)',color:CTYPE[x.t].c,marginBottom:4}}>{CHANGES.filter(c=>c.type===x.t).length}</div>
            <div style={{fontSize:12,color:'var(--t2)',fontWeight:600}}>{x.l}</div>
          </div>
        ))}
      </div>
      <div className="card au1">
        <SectionHeader title="Recent API Changes" subtitle="Detected via schema diffing"
          action={<button className="btn-ghost" style={{fontSize:12,height:32,padding:'0 12px'}} onClick={()=>setToast('Changes exported!')}><IcDownload s={13}/>Export</button>}/>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {CHANGES.map((c,i)=>(
            <div key={i} className="card-sm" style={{display:'flex',gap:14,alignItems:'flex-start',borderLeft:`3px solid ${CTYPE[c.type].c}`}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${CTYPE[c.type].c}18`,color:CTYPE[c.type].c,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {CTYPE[c.type].icon}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                  <span style={{padding:'2px 8px',borderRadius:5,fontSize:10,fontWeight:800,fontFamily:'var(--mono)',background:`${CTYPE[c.type].c}18`,color:CTYPE[c.type].c}}>{CTYPE[c.type].label}</span>
                  <span style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)'}}>{c.time}</span>
                </div>
                <code style={{fontFamily:'var(--mono)',fontSize:13,color:'var(--t1)',fontWeight:700}}>{c.endpoint}</code>
                <div style={{fontSize:12,color:'var(--t3)',marginTop:4}}>
                  Repo: <span style={{color:'var(--t2)',fontWeight:600}}>{c.repo}</span>
                  {c.type==='auth'&&<> · Auth: <span style={{color:'var(--orange)',fontWeight:700,fontFamily:'var(--mono)'}}>{c.auth}</span></>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   VIEW: AI FEATURES
============================================================ */
const ViewAI = ({openModal}) => {
  const features=[
    {id:'docs',  icon:<IcFileText s={24}/>, color:'var(--blue)',  phase:'phase-2',label:'Phase 2', title:'AI Documentation Generator',  desc:'Automatically generate comprehensive API docs from your OpenAPI spec. Includes examples, error codes, and usage guides.', prompt:'Generate comprehensive API documentation for a REST API that handles user authentication, CRUD operations for users, and sensor data from IoT devices. Include endpoint descriptions, request/response examples, error codes, and best practices. Format as markdown.'},
    {id:'tests', icon:<IcZap s={24}/>,      color:'var(--green)', phase:'phase-2',label:'Phase 2', title:'AI Test Case Generator',        desc:'Generate exhaustive test suites covering happy paths, edge cases, and security scenarios. Export to Jest, Pytest, or Postman.', prompt:'Generate comprehensive API test cases for these endpoints: POST /auth/login, GET /users/{id}, DELETE /admin/purge. Include happy path tests, edge cases, authentication tests, rate limiting tests, injection attack tests, and BOLA vulnerability tests. Format as Jest test code.'},
    {id:'review', icon:<IcShield s={24}/>,  color:'var(--orange)',phase:'phase-3',label:'Phase 3', title:'AI Security Copilot',            desc:'AI-powered security review of your API. Get vulnerability explanations, fix recommendations, and OWASP alignment reports.', prompt:'Perform a security analysis of this API endpoint: POST /api/v1/auth/login with no rate limiting, no CAPTCHA, and returning detailed error messages. Identify all security vulnerabilities, their OWASP categories, severity levels, and provide specific code fixes in Node.js Express.'},
    {id:'mock',  icon:<IcServer s={24}/>,   color:'var(--purple)',phase:'phase-2',label:'Phase 2', title:'AI Mock Data Generator',         desc:'Generate realistic, contextually accurate mock data for testing. No more lorem ipsum — AI creates domain-specific fake data.', prompt:'Generate realistic mock API responses for a pet health monitoring API. Include 5 mock pets with health metrics (heart rate, SpO2, temperature, activity level), diagnosis results, and sensor readings from MPU6050 and MAX30102 sensors. Format as JSON.'},
    {id:'readme', icon:<IcCode s={24}/>,    color:'var(--yellow)', phase:'phase-3',label:'Phase 3', title:'AI README Generator',           desc:'Generate a polished, professional README for your API repository. Includes installation, quickstart, and API reference.', prompt:'Generate a professional GitHub README for the pawsitive-diagnosis-api — an IoT-based pet health monitoring system using ESP32, MPU6050, MAX30102, and INMP441 sensors. Include badges, installation guide, API endpoints, hardware setup, and contributing guide.'},
    {id:'cicd',  icon:<IcCI s={24}/>,       color:'var(--red)',   phase:'phase-2',label:'Phase 2', title:'CI/CD Config Generator',         desc:'Auto-generate GitHub Actions or Jenkins pipelines with built-in security scanning steps for your API project.', prompt:'Generate a complete GitHub Actions CI/CD pipeline for a Python FastAPI project that includes: linting with flake8, unit tests with pytest, API security scanning, Docker build and push, and deployment to AWS ECS. Include environment variables and secrets management.'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="au card" style={{background:'linear-gradient(135deg,var(--p-dim),hsla(280,78%,63%,.1))',border:'1px solid var(--p-dim)',padding:'24px 28px'}}>
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
          <div style={{width:46,height:46,borderRadius:14,background:'var(--p-dim)',color:'var(--p)',display:'flex',alignItems:'center',justifyContent:'center'}}><IcSparkles s={24}/></div>
          <div>
            <div style={{fontSize:18,fontWeight:800,fontFamily:'var(--display)',color:'var(--t1)'}}>AI Features — Powered by Claude</div>
            <div style={{fontSize:13,color:'var(--t2)',marginTop:2}}>Phase 2 & 3 capabilities. Click any card to generate AI output instantly.</div>
          </div>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <span className="phase-badge phase-1">Phase 1 — Live</span>
          <span className="phase-badge phase-2">Phase 2 — Beta</span>
          <span className="phase-badge phase-3">Phase 3 — Coming Soon</span>
        </div>
      </div>
      <div className="au1" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {features.map(f=>(
          <button key={f.id} className="card" onClick={()=>openModal('ai',{title:f.title,icon:<div style={{color:f.color}}>{f.icon}</div>,prompt:f.prompt})} style={{textAlign:'left',cursor:'pointer',border:'1px solid var(--border)',transition:'all .2s'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <div style={{width:48,height:48,borderRadius:14,background:`${f.color}18`,color:f.color,display:'flex',alignItems:'center',justifyContent:'center'}}>{f.icon}</div>
              <span className={`phase-badge ${f.phase}`}>{f.label}</span>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:'var(--t1)',marginBottom:6,fontFamily:'var(--display)'}}>{f.title}</div>
            <div style={{fontSize:12,color:'var(--t3)',lineHeight:1.6}}>{f.desc}</div>
            <div style={{marginTop:14,display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,color:f.color}}>
              <IcSparkles s={13}/>Generate with AI
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   VIEW: POSTMAN INTEGRATION
============================================================ */
const ViewPostman = ({setToast}) => {
  const [imported,setImported]=useState(false);
  const [importing,setImporting]=useState(false);
  const doImport=()=>{setImporting(true);setTimeout(()=>{setImporting(false);setImported(true);setToast('Postman collection imported!');},1800);};
  const collections=[{n:'ApiGuard Main',endpoints:15,lastSync:'5m ago'},{n:'Auth Tests',endpoints:6,lastSync:'2h ago'},{n:'Sensor APIs',endpoints:8,lastSync:'1d ago'}];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="card au" style={{padding:'28px'}}>
        <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
          <div style={{width:60,height:60,borderRadius:16,background:'hsla(28,88%,58%,.14)',color:'var(--orange)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IcPostman s={28}/></div>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:800,fontFamily:'var(--display)',color:'var(--t1)',marginBottom:6}}>Postman Integration</div>
            <div style={{fontSize:13,color:'var(--t2)',lineHeight:1.6,marginBottom:16}}>Import your Postman collections to automatically discover and scan all your API endpoints. Works with v2.1 collection format.</div>
            <div className="drop-zone" style={{marginBottom:0}}>
              <div style={{fontSize:36,marginBottom:8}}>📮</div>
              <div style={{fontWeight:700,color:'var(--t1)',fontSize:14}}>Drop Postman collection.json here</div>
              <div style={{fontSize:12,color:'var(--t3)',marginTop:4}}>Supports Postman Collection v2.0 and v2.1</div>
              <button className="btn-primary" onClick={doImport} disabled={importing} style={{marginTop:16}}>
                {importing?<><Spinner s={14}/>Importing…</>:<><IcDownload s={14}/>Import Collection</>}
              </button>
            </div>
          </div>
        </div>
      </div>
      {imported&&(
        <div className="card au1">
          <SectionHeader title="Synced Collections" subtitle="Auto-scan on import"/>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {collections.map((c,i)=>(
              <div key={i} className="card-sm" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 18px'}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:36,height:36,borderRadius:10,background:'hsla(28,88%,58%,.14)',color:'var(--orange)',display:'flex',alignItems:'center',justifyContent:'center'}}><IcPostman s={16}/></div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'var(--t1)'}}>{c.n}</div>
                    <div style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:2}}>{c.endpoints} endpoints · Last sync: {c.lastSync}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn-ghost" style={{fontSize:11,height:30,padding:'0 12px'}} onClick={()=>setToast(`Rescanning ${c.n}…`)}><IcRefresh s={12}/>Resync</button>
                  <button className="btn-primary" style={{fontSize:11,height:30,padding:'0 12px'}} onClick={()=>setToast(`Scanning ${c.n}…`)}><IcPlay s={12}/>Scan</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   THEME DRAWER
============================================================ */
const ThemeDrawer = ({mode,setMode,hue,setHue,close}) => {
  const PRESETS=[{h:85,n:'Neon Green'},{h:200,n:'Cyan'},{h:330,n:'Pink'},{h:45,n:'Gold'},{h:10,n:'Red'},{h:260,n:'Purple'},{h:165,n:'Teal'},{h:30,n:'Amber'},{h:300,n:'Magenta'},{h:120,n:'Lime'}];
  return (
    <>
      <div className="overlay" onClick={close}/>
      <div className="drawer">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
          <div>
            <div style={{fontSize:17,fontWeight:800,fontFamily:'var(--display)',color:'var(--t1)'}}>Appearance</div>
            <div style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Customize your dashboard</div>
          </div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{marginBottom:28}}>
          <div className="sec-label">Theme Mode</div>
          <div className="toggle-wrap">
            <button className={`toggle-opt${mode==='dark'?' on':''}`} onClick={()=>setMode('dark')}><IcMoon s={13}/>Dark</button>
            <button className={`toggle-opt${mode==='light'?' on':''}`} onClick={()=>setMode('light')}><IcSun s={13}/>Light</button>
          </div>
        </div>
        <div style={{marginBottom:28}}>
          <div className="sec-label">Accent Color</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:16}}>
            {PRESETS.map(p=>(
              <button key={p.h} className="hue-dot" title={p.n} onClick={()=>setHue(p.h)} style={{background:`hsl(${p.h},78%,55%)`,border:hue===p.h?'2.5px solid var(--t1)':'2.5px solid transparent',outline:hue===p.h?`2.5px solid hsl(${p.h},78%,55%)`:'none',outlineOffset:2,boxShadow:hue===p.h?`0 0 16px hsl(${p.h},78%,55%)`:'none'}}/>
            ))}
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
              <span style={{fontSize:12,color:'var(--t2)'}}>Custom hue</span>
              <span style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--t1)',fontWeight:700}}>{hue}°</span>
            </div>
            <input type="range" min="0" max="360" value={hue} onChange={e=>setHue(Number(e.target.value))} style={{width:'100%',accentColor:`hsl(${hue},78%,55%)`,cursor:'pointer'}}/>
            <div style={{height:5,borderRadius:3,marginTop:8,background:'linear-gradient(to right,hsl(0,78%,55%),hsl(60,78%,55%),hsl(120,78%,55%),hsl(180,78%,55%),hsl(240,78%,55%),hsl(300,78%,55%),hsl(360,78%,55%))'}}/>
          </div>
        </div>
        <div>
          <div className="sec-label">Preview</div>
          <div className="card-sm">
            <div style={{display:'flex',gap:8,marginBottom:10}}>
              <button className="btn-primary" style={{fontSize:11,height:30,padding:'0 14px'}}>Primary</button>
              <button className="btn-ghost" style={{fontSize:11,height:30,padding:'0 14px'}}>Ghost</button>
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              <Tag s="crit"/><Tag s="high"/><Tag s="med"/><Tag s="safe"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ============================================================
   TOPBAR
============================================================ */
const TopBar = ({openModal,setShowTheme,alertCount}) => {
  const [time,setTime]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);
  return (
    <div style={{height:58,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px',borderBottom:'1px solid var(--border)',background:'var(--surface)',position:'sticky',top:0,zIndex:100}}>
      <div className="search-bar" style={{height:36}}>
        <IcSearch s={14} c="var(--t3)"/>
        <input placeholder="Search endpoints, repos, alerts…" style={{width:200}}/>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--t2)',background:'var(--surface2)',padding:'5px 13px',borderRadius:'var(--r-pill)',border:'1px solid var(--border)'}}>
          {time.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})}
        </div>
        <button className="btn-icon" style={{position:'relative'}}>
          <IcBell s={16}/>
          {alertCount>0&&<span style={{position:'absolute',top:7,right:7,width:7,height:7,borderRadius:'50%',background:'var(--red)',border:'2px solid var(--surface)'}}/>}
        </button>
        <button className="btn-icon" onClick={()=>setShowTheme(true)}><IcSettings s={16}/></button>
        <button className="btn-primary" onClick={()=>openModal('scan')} style={{height:36,padding:'0 18px',fontSize:12}}><IcPlay s={13}/>New Scan</button>
        <div style={{width:34,height:34,borderRadius:'var(--r-pill)',background:'var(--p-dim)',color:'var(--p-lite)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:12,border:'1px solid var(--p-dim)',fontFamily:'var(--display)'}}>KS</div>
      </div>
    </div>
  );
};

/* ============================================================
   SIDEBAR
============================================================ */
const NAV_SECTIONS = [
  {label:'MAIN', items:[
    {id:'dash',     label:'Dashboard',      icon:IcLayout,  phase:1},
    {id:'history',  label:'Scan History',   icon:IcActivity,phase:1},
    {id:'alerts',   label:'Threat Alerts',  icon:IcAlert,   phase:1, badge:true},
    {id:'eps',      label:'Endpoints',      icon:IcGlobe,   phase:1, chip:true},
  ]},
  {label:'INTEGRATIONS', items:[
    {id:'github',   label:'GitHub',         icon:IcGitHub,  phase:1},
    {id:'postman',  label:'Postman',        icon:IcPostman, phase:1},
    {id:'openapi',  label:'OpenAPI Import', icon:IcPackage, phase:1},
    {id:'cicd',     label:'CI/CD',          icon:IcCI,      phase:2},
  ]},
  {label:'MONITORING', items:[
    {id:'health',   label:'API Health',     icon:IcActivity,phase:1},
    {id:'loadtest', label:'Load Testing',   icon:IcZap,     phase:2},
    {id:'mockserver',label:'Mock Server',   icon:IcServer,  phase:2},
    {id:'changes',  label:'Change Detect',  icon:IcDiff,    phase:2},
  ]},
  {label:'AI FEATURES', items:[
    {id:'ai',       label:'AI Copilot',     icon:IcSparkles,phase:3},
    {id:'reports',  label:'PDF Reports',    icon:IcFileText,phase:1},
  ]},
];

const Sidebar = ({view,setView,openModal}) => {
  const alertCount=ALERTS.filter(a=>a.type==='crit').length;
  const pColor={1:'var(--green)',2:'var(--blue)',3:'var(--purple)'};

  const handleItem=(item)=>{
    if(item.id==='openapi'){openModal('openapi');return;}
    if(item.id==='reports'){openModal('pdf');return;}
    if(item.id==='loadtest'){openModal('loadtest');return;}
    if(item.id==='mockserver'){openModal('mockserver');return;}
    setView(item.id);
  };

  return (
    <aside style={{width:222,flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',padding:'0 10px 20px',position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
      {/* Logo */}
      <div style={{padding:'18px 8px 14px',borderBottom:'1px solid var(--border)',marginBottom:14,display:'flex',alignItems:'center',gap:11}}>
        <div style={{width:36,height:36,background:'var(--p)',borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',flexShrink:0,boxShadow:'var(--p-glow)'}}>
          <IcShield s={19}/>
        </div>
        <div>
          <div style={{fontSize:15,fontWeight:800,letterSpacing:'-0.3px',color:'var(--t1)',fontFamily:'var(--display)'}}>ApiGuard</div>
          <div style={{fontSize:9.5,fontWeight:700,color:'var(--t3)',letterSpacing:'.1em',textTransform:'uppercase'}}>Security Platform</div>
        </div>
      </div>
      {/* Status */}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:'var(--r-md)',background:'hsla(148,72%,54%,.08)',border:'1px solid hsla(148,72%,54%,.2)',marginBottom:16}}>
        <span className="dot" style={{background:'var(--green)',boxShadow:'0 0 8px var(--green)'}}/>
        <span style={{fontSize:11,fontWeight:700,color:'var(--green)'}}>All Systems Nominal</span>
      </div>
      {/* Nav */}
      {NAV_SECTIONS.map(sec=>(
        <div key={sec.label} style={{marginBottom:6}}>
          <div className="sec-label">{sec.label}</div>
          {sec.items.map(item=>(
            <button key={item.id} className={`nav-item${view===item.id?' active':''}`} onClick={()=>handleItem(item)}>
              <item.icon s={15}/>
              {item.label}
              {item.badge&&alertCount>0&&<span className="badge">{alertCount}</span>}
              {item.chip&&<span className="chip">{ENDPOINTS.length}</span>}
              {item.phase>1&&<span style={{marginLeft:'auto',fontSize:9,fontWeight:800,color:pColor[item.phase],background:`${pColor[item.phase]}18`,padding:'1px 6px',borderRadius:4,fontFamily:'var(--mono)'}}>{item.phase===2?'β':'AI'}</span>}
            </button>
          ))}
        </div>
      ))}
      {/* Free scan promo */}
      <div style={{margin:'10px 0 16px',padding:'13px',borderRadius:'var(--r-lg)',background:'var(--p-dim2)',border:'1px solid var(--p-dim)'}}>
        <div style={{fontSize:11.5,fontWeight:700,color:'var(--p-lite)',marginBottom:3}}>Free Scan Available</div>
        <div style={{fontSize:11,color:'var(--t3)',lineHeight:1.5,marginBottom:9}}>Quick security check on any public API.</div>
        <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:'var(--r-pill)',background:'var(--p-dim)',fontSize:10,fontWeight:800,color:'var(--p-lite)',letterSpacing:'.06em'}}>FREE</span>
      </div>
      <div style={{flex:1}}/>
      <div style={{borderTop:'1px solid var(--border)',paddingTop:12}}>
        {[{icon:IcEye,l:'Documentation'},{icon:IcSettings,l:'Settings'}].map(x=>(
          <button key={x.l} className="nav-item" style={{opacity:.75}}><x.icon s={14}/>{x.l}</button>
        ))}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 8px',marginTop:6}}>
          <div style={{width:32,height:32,borderRadius:'var(--r-pill)',background:'var(--p-dim)',color:'var(--p-lite)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:12,border:'1px solid var(--p-dim)',flexShrink:0,fontFamily:'var(--display)'}}>KS</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:'var(--t1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Kartikeya S.</div>
            <div style={{fontSize:10,color:'var(--t3)'}}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

/* ============================================================
   LOGIN PAGE
============================================================ */

// Make sure your icon components (IcShield, IcMail, etc.) are imported at the top!

// Make sure your icon components (IcShield, IcMail, etc.) are imported at the top!

const LoginPage = ({onLogin}) => {
  // Syncing theme state perfectly with the Landing Page
  const [lightMode, setLightMode] = useState(false);
  const lp = {
    bg:        lightMode ? '#f8fafc' : '#0b0f19',
    textMain:  lightMode ? '#0f172a' : '#ffffff',
    textMuted: lightMode ? '#475569' : '#94a3b8',
    border:    lightMode ? '#cbd5e1' : '#334155',
    surface:   lightMode ? '#ffffff' : '#1e293b',
    surface2:  lightMode ? '#f1f5f9' : '#0f172a',
    accent:    '#3b82f6',
  };

  const [mode,setMode]=useState('login');
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const [step,setStep]=useState(0);
  const particles=useMemo(()=>Array.from({length:24},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:Math.random()*3+1,dur:Math.random()*4+3,delay:Math.random()*4})),[]);

  const SYS_LINES = [
    "Loading OWASP Top 10 heuristics...",
    "Connecting to CI/CD pipelines...",
    "Initializing AI documentation engine...",
    "Synchronizing Postman collections...",
    "Preparing endpoint mock servers..."
  ];

  useEffect(() => {
    const int = setInterval(() => setStep(s => (s + 1) % SYS_LINES.length), 3500);
    return () => clearInterval(int);
  }, []);

  const submit=e=>{
    e.preventDefault();setErr('');
    if(!email||!pass){setErr('Please fill all fields.');return;}
    setLoading(true);
    setTimeout(()=>{setLoading(false);if(email&&pass)onLogin();else setErr('Invalid credentials.');},1500);
  };

  return (
    <div style={{background: lp.bg, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, position:'relative', overflow:'hidden', color: lp.textMain, transition:'background .3s,color .3s'}}>
      
      {/* THEME TOGGLE (Matches Landing Page) */}
      <div style={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}>
        <button className="lp-theme" onClick={()=>setLightMode(m=>!m)}
          style={{ background:'transparent', border:`1px solid ${lp.border}`, color:lp.textMuted, borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .3s' }}>
          {lightMode
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          }
        </button>
      </div>

      {/* Grid overlay */}
      <div className="grid-lines" style={{opacity: lightMode ? 0.2 : 0.5}}/>
      
      {/* Floating orbs */}
      <div style={{position:'absolute',width:500,height:500,top:'-15%',left:'-10%',background: lp.accent,borderRadius:'50%',filter:'blur(120px)',opacity: lightMode ? .04 : .08,pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:400,height:400,bottom:'-10%',right:'-8%',background: lp.accent,borderRadius:'50%',filter:'blur(120px)',opacity: lightMode ? .03 : .07,pointerEvents:'none'}}/>
      
      {/* Particles */}
      {particles.map(p=>(
        <div key={p.id} style={{position:'absolute',left:`${p.x}%`,top:`${p.y}%`,width:p.size,height:p.size,borderRadius:'50%',background: lp.accent,opacity: lightMode ? .15 : .35,animation:`floatUp ${p.dur}s ${p.delay}s ease-in-out infinite`,pointerEvents:'none'}}/>
      ))}

      {/* ════════ LEFT TAGLINE ════════ */}
      <div className="side-tagline" style={{position:'absolute',left:60,top:'50%',transform:'translateY(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:20,zIndex:0,animation:'fadeIn 1s ease 0.5s both'}}>
        <div style={{width:1,height:120,background:`linear-gradient(to bottom, transparent, ${lp.accent})`, opacity: 0.3}}/>
        <div style={{width:5,height:5,borderRadius:'50%',background: lp.accent,boxShadow:`0 0 10px ${lp.accent}`}}/>
        <div style={{writingMode:'vertical-rl',transform:'rotate(180deg)',fontSize:11,fontWeight:700,fontFamily:'JetBrains Mono, monospace',letterSpacing:'0.4em',color:lp.textMuted,textTransform:'uppercase'}}>
          Secure Your APIs
        </div>
        <div style={{width:5,height:5,borderRadius:'50%',background: lp.accent,boxShadow:`0 0 10px ${lp.accent}`}}/>
        <div style={{width:1,height:120,background:`linear-gradient(to top, transparent, ${lp.accent})`, opacity: 0.3}}/>
      </div>

      {/* ════════ RIGHT TAGLINE ════════ */}
      <div className="side-tagline" style={{position:'absolute',right:60,top:'50%',transform:'translateY(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:20,zIndex:0,animation:'fadeIn 1s ease 0.5s both'}}>
        <div style={{width:1,height:120,background:`linear-gradient(to bottom, transparent, ${lp.accent})`, opacity: 0.3}}/>
        <div style={{width:5,height:5,borderRadius:'50%',background: lp.accent,boxShadow:`0 0 10px ${lp.accent}`}}/>
        <div style={{writingMode:'vertical-rl',fontSize:11,fontWeight:700,fontFamily:'JetBrains Mono, monospace',letterSpacing:'0.4em',color:lp.textMuted,textTransform:'uppercase'}}>
          Ship With Confidence
        </div>
        <div style={{width:5,height:5,borderRadius:'50%',background: lp.accent,boxShadow:`0 0 10px ${lp.accent}`}}/>
        <div style={{width:1,height:120,background:`linear-gradient(to top, transparent, ${lp.accent})`, opacity: 0.3}}/>
      </div>

      {/* Main Center Container */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%',maxWidth:460,position:'relative',zIndex:1}}>
        
        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16,animation:'fadeUp .5s ease both'}}>
          <div style={{width:52,height:52,background: lp.accent,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 20px ${lp.accent}40`}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div>
            <div style={{fontSize:26,fontWeight:800,letterSpacing:'-0.5px',color: lp.textMain,fontFamily:'Syne,sans-serif'}}>ApiGuard</div>
            <div style={{fontSize:11,fontWeight:700,color: lp.textMuted,letterSpacing:'.12em',textTransform:'uppercase'}}>Security Platform</div>
          </div>
        </div>

        {/* Dynamic Terminal Ticker */}
        <div style={{marginBottom: 32, height: 20, animation: 'fadeIn 1s ease 0.5s both'}}>
           <div style={{fontSize: 11, fontWeight: 600, color: lp.accent, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8, opacity: 0.8}}>
             <span style={{animation: 'blink 1s step-end infinite'}}>█</span>
             <span key={step} style={{animation: 'fadeUp 0.3s ease'}}>{SYS_LINES[step]}</span>
           </div>
        </div>

        {/* Card */}
        <div className="card" style={{width:'100%',padding:'36px',animation:'scaleIn .4s cubic-bezier(.22,.68,0,1.2) .1s both',background: lp.surface, border: `1px solid ${lp.border}`, borderRadius: 24, boxShadow: lightMode ? '0 10px 30px -10px rgba(0,0,0,0.05)' : '0 10px 30px -10px rgba(0,0,0,0.3)'}}>
          {/* Tabs */}
          <div style={{display:'flex',gap:4,marginBottom:28,background: lp.surface2,padding:5,borderRadius:'999px',border:`1px solid ${lp.border}`}}>
            {['login','signup'].map(t=>(
              <button key={t} onClick={()=>{setMode(t);setErr('');}} style={{flex:1,padding:'9px',borderRadius:'999px',fontSize:13,fontWeight:700,transition:'all .2s',background:mode===t? lp.accent :'none',color:mode===t?'#fff': lp.textMuted,border:'none',fontFamily:'Syne,sans-serif'}}>
                {t==='login'?'Sign In':'Sign Up'}
              </button>
            ))}
          </div>
          
          {/* Headline */}
          <div style={{marginBottom:24}}>
            <div style={{fontSize:22,fontWeight:800,color: lp.textMain,fontFamily:'Syne,sans-serif',marginBottom:6}}>
              {mode==='login'?'Welcome back':'Create account'}
            </div>
            <div style={{fontSize:13,color: lp.textMuted}}>
              {mode==='login'?'Sign in to your ApiGuard dashboard':'Start securing your APIs today'}
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}}>
            {mode==='signup'&&(
              <div>
                <label style={{fontSize:12,fontWeight:600,color: lp.textMuted,display:'block',marginBottom:7}}>Full Name</label>
                <input className="login-input" placeholder="Kartikeya Singh" type="text" style={{background: lp.surface2, border: `1px solid ${lp.border}`, color: lp.textMain, width:'100%', padding:'12px 18px', borderRadius:12}}/>
              </div>
            )}
            <div>
              <label style={{fontSize:12,fontWeight:600,color: lp.textMuted,display:'block',marginBottom:7}}>Email</label>
              <div style={{position:'relative'}}>
                <div style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',color: lp.textMuted,pointerEvents:'none'}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                </div>
                <input className="login-input" style={{paddingLeft:44, background: lp.surface2, border: `1px solid ${lp.border}`, color: lp.textMain, width:'100%', padding:'12px 18px 12px 44px', borderRadius:12}} placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
              </div>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color: lp.textMuted,display:'block',marginBottom:7}}>Password</label>
              <div style={{position:'relative'}}>
                <div style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',color: lp.textMuted,pointerEvents:'none'}}>
                   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <input className="login-input" style={{paddingLeft:44, background: lp.surface2, border: `1px solid ${lp.border}`, color: lp.textMain, width:'100%', padding:'12px 18px 12px 44px', borderRadius:12}} placeholder="••••••••" type="password" value={pass} onChange={e=>setPass(e.target.value)}/>
              </div>
            </div>
            {mode==='login'&&(
              <div style={{textAlign:'right',marginTop:-4}}>
                <button type="button" style={{fontSize:12,color: lp.accent,fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>Forgot password?</button>
              </div>
            )}
            {err&&<div style={{padding:'10px 14px',borderRadius:12,background:'hsla(348,88%,60%,.14)',border:'1px solid hsla(348,88%,60%,.3)',color:'#ef4444',fontSize:13,fontWeight:500}}>{err}</div>}
            <button type="submit" disabled={loading} style={{background: lp.accent,color:'#fff',fontWeight:800,fontSize:14,border:'none',borderRadius:'999px',height:48,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginTop:4,boxShadow:`0 0 20px ${lp.accent}60`,fontFamily:'Syne,sans-serif',transition:'all .2s',filter:loading?'brightness(.85)':'none'}}>
              {loading?<><span style={{animation:'spin 1s linear infinite'}}>↻</span><span>Signing in…</span></>:<><span style={{fontSize:16}}>⚡</span><span>{mode==='login'?'Sign In':'Create Account'}</span></>}
            </button>
          </form>
          {/* Divider */}
          <div style={{display:'flex',alignItems:'center',gap:12,margin:'20px 0'}}>
            <div style={{flex:1,height:1,background: lp.border}}/>
            <span style={{fontSize:12,color: lp.textMuted}}>or continue with</span>
            <div style={{flex:1,height:1,background: lp.border}}/>
          </div>
          {/* Social */}
          <div style={{display:'flex',gap:10}}>
            {['GitHub','Google'].map(s=>(
              <button key={s} onClick={onLogin} style={{flex:1,height:42,borderRadius:14,background: lp.surface2,border:`1px solid ${lp.border}`,color: lp.textMuted,fontSize:13,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer',transition:'all .2s',fontFamily:'var(--font)'}}>
                {s}
              </button>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:20,fontSize:12,color: lp.textMuted}}>
            By continuing you agree to our <span style={{color: lp.accent,cursor:'pointer'}}>Terms</span> & <span style={{color: lp.accent,cursor:'pointer'}}>Privacy Policy</span>
          </div>
        </div>
        {/* Feature badges */}
        <div style={{display:'flex',gap:8,marginTop:24,flexWrap:'wrap',justifyContent:'center',animation:'fadeIn .5s .4s ease both'}}>
          {['Phase 1 Live','AI-Powered','OWASP Top 10','OpenAPI 3.0','Free Tier'].map(t=>(
            <span key={t} style={{fontSize:11,fontWeight:700,color: lp.textMuted,background: lp.surface2,border:`1px solid ${lp.border}`,padding:'4px 12px',borderRadius:'999px'}}>{t}</span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        /* Hide side taglines on smaller screens to prevent overlap */
        @media (max-width: 1100px) {
          .side-tagline { display: none !important; }
        }
        .login-input:focus { outline: none; border-color: ${lp.accent} !important; box-shadow: 0 0 0 3px ${lp.accent}30 !important; }
      `}</style>
    </div>
  );
};
/* ============================================================
   LANDING PAGE
============================================================ */

const LandingPage = ({ onNavigate }) => {
  const [lightMode, setLightMode] = useState(false);
  const [activeLang, setActiveLang] = useState('node');

  const lp = {
    bg:        lightMode ? '#f8fafc' : '#0b0f19',
    textMain:  lightMode ? '#0f172a' : '#ffffff',
    textMuted: lightMode ? '#475569' : '#94a3b8',
    border:    lightMode ? '#cbd5e1' : '#334155',
    surface:   lightMode ? '#ffffff' : '#1e293b',
    accent:    '#3b82f6',
    badgeBg:   lightMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)',
    shadow:    lightMode ? '0 10px 30px -10px rgba(0,0,0,0.05)' : '0 10px 30px -10px rgba(0,0,0,0.3)',
  };

  const btnP   = { padding:'12px 24px', borderRadius:8, fontWeight:600, fontSize:'0.95rem', cursor:'pointer', background:lp.accent, color:'#fff', border:'none', transition:'all .3s' };
  const btnO   = { padding:'12px 24px', borderRadius:8, fontWeight:600, fontSize:'0.95rem', cursor:'pointer', background:'transparent', color:lp.textMain, border:`1px solid ${lp.border}`, transition:'all .3s' };
  const btnLP  = { padding:'12px 24px', borderRadius:8, fontWeight:700, fontSize:'0.95rem', cursor:'pointer', background:'transparent', color:lp.accent, border:`2px solid ${lp.accent}`, transition:'all .3s' };
  const card   = { background:lp.surface, padding:'40px 32px', borderRadius:24, border:`1px solid ${lp.border}`, boxShadow:lp.shadow, display:'flex', flexDirection:'column', transition:'all .3s' };
  const icon   = { width:48, height:48, background:lp.badgeBg, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, color:lp.accent };
  const grid3  = { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:32 };
  const h2s = { 
  fontSize: '2.5rem', 
  marginBottom: 16, 
  color: lightMode ? '#0f172a' : '#ffffff', 
  fontWeight: 800,
  letterSpacing: '-0.025em',
  transition: 'color .3s ease' 
};
    

  // Generated review data structure with clean minimalist key names
  const reviews = [
    { n: 'Alex Miller', r: 'Backend Lead', t: 'Saved us from a major credential stuffing attack on day two. Literally plug and play setup.', a: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    { n: 'Devon King', r: 'Security Architect', t: 'Minimalist configuration rules that actually deliver. The telemetry monitoring overhead is practically zero.', a: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
    { n: 'Sarah Lin', r: 'CTO @ Nexus', t: 'Finally an SDK framework that doesn’t bloat our runtime compilation or dependencies tree. 10/10 layer.', a: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
    { n: 'Jay Ram', r: 'Fullstack Engineer', t: 'The automatic DDoS traffic throttling kicked in flawlessly during our global traffic launch window.', a: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' }
  ];

  return (
    <div style={{ background:lp.bg, color:lp.textMain, fontFamily:"'Inter',-apple-system,sans-serif", lineHeight:1.6, overflowX:'hidden', transition:'background .3s,color .3s', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');

h1, h2, h3, h4, .lp-au1 {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  letter-spacing: -0.03em !important;
}
        @keyframes lp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes lp-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes lp-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .lp-au{animation:lp-up .5s cubic-bezier(.22,.68,0,1.2) both}
        .lp-au1{animation:lp-up .5s cubic-bezier(.22,.68,0,1.2) .1s both}
        .lp-au2{animation:lp-up .5s cubic-bezier(.22,.68,0,1.2) .2s both}
        .lp-au3{animation:lp-up .5s cubic-bezier(.22,.68,0,1.2) .3s both}
        .lp-card:hover{transform:translateY(-5px)!important; border-color:#3b82f6!important; box-shadow: 0 10px 25px -5px rgba(59,130,246,0.25)!important;}
        .lp-nav-a{color:#94a3b8;text-decoration:none;font-size:.95rem;transition:color .3s}
        .lp-nav-a:hover{color:#fff}
        .lp-doc-a{color:#3b82f6;text-decoration:none;margin-top:16px;display:inline-block;font-weight:600;transition:color .3s}
        .lp-doc-a:hover{color:#2563eb}
        .lp-li::before{content:"✓";color:#3b82f6;font-weight:bold;margin-right:8px}
        .lp-popular{border-color:#3b82f6!important;transform:scale(1.05);z-index:2}
        .lp-popular:hover{transform:scale(1.08)!important}
        .lp-btnP:hover{background:#2563eb!important;box-shadow:0 0 16px rgba(59,130,246,.45)!important}
        .lp-btnO:hover{border-color:#94a3b8!important}
        .lp-theme:hover{border-color:#fff!important;color:#fff!important}
        .lp-footer-link{color:#94a3b8; text-decoration:none; transition:color .3s; font-size:.9rem}
        .lp-footer-link:hover{color:#3b82f6}
        .lp-mq-track{display:flex; gap:24px; width:max-content; animation:lp-marquee 30s linear infinite}
        .lp-mq-container:hover .lp-mq-track{animation-play-state:paused}
      `}</style>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

        {/* ── NAV ── */}
        <header style={{ padding:'24px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:'1.5rem', fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={lp.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            API<span style={{ color:lp.accent }}>Guardian</span>
          </div>
          <nav><ul style={{ listStyle:'none', display:'flex', gap:32, margin:0, padding:0 }}>
            <li><a href="#lp-features" className="lp-nav-a">Features</a></li>
            <li><a href="#lp-docs"     className="lp-nav-a">Documentation</a></li>
            <li><a href="#lp-pricing"  className="lp-nav-a">Pricing</a></li>
          </ul></nav>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <button className="lp-theme" onClick={()=>setLightMode(m=>!m)}
              style={{ background:'transparent', border:`1px solid ${lp.border}`, color:lp.textMuted, borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .3s' }}>
              {lightMode
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              }
            </button>
            <button className="lp-btnO" onClick={()=>onNavigate('login')} style={btnO}>Log In</button>
            <button className="lp-btnP" onClick={()=>onNavigate('login')} style={btnLP}>Start for Free</button>
          </div>
        </header>

        {/* ── HERO ── */}
        <main style={{ display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:'calc(100vh - 100px)', padding:'40px 0 80px', gap:40 }}>
          <div style={{ flex:1, maxWidth:600 }}>
            <div className="lp-au" style={{ display:'inline-block', padding:'6px 12px', background:lp.badgeBg, color:lp.accent, border:'1px solid rgba(59,130,246,.2)', borderRadius:20, fontSize:'.85rem', fontWeight:600, marginBottom:24 }}>
              TRUSTLAYERS-API Security
            </div>
            <h1 className="lp-au1" style={{ fontSize:'4rem', lineHeight:1.1, fontWeight:800, marginBottom:24, backgroundImage:lightMode?'linear-gradient(to right,#0f172a,#334155)':'linear-gradient(to right,#fff,#94a3b8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', color:'transparent' }}>
              Stressed About APIs?
            </h1>
            <p className="lp-au2" style={{ fontSize:'1.125rem', color:lp.textMuted, marginBottom:40 }}>
              Don't let vulnerable endpoints become nightmares. Monitor, protect, and scale your API infrastructure with real-time threat detection and a seamless integration made for engineers. Get protected in minutes with our universal SDK
            </p>
            <div className="lp-au3" style={{ display:'flex', gap:16 }}>
              <button className="lp-btnP" onClick={()=>onNavigate('login')} style={btnP}>Protect My APIs</button>
              <button className="lp-btnO" style={btnO}>Watch Demo ▶</button>
            </div>
          </div>

          <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', position:'relative' }}>
            <div style={{ position:'absolute', width:300, height:300, background:lp.accent, filter:'blur(150px)', borderRadius:'50%', opacity:.12, zIndex:0 }}/>
            <div style={{ width:'100%', maxWidth:580, borderRadius:24, border:`1px solid ${lp.border}`, overflow:'hidden', boxShadow:'0 25px 50px -12px rgba(0,0,0,.5)', zIndex:1, position:'relative', animation:'lp-float 6s ease-in-out infinite' }}>
              <img src={ww} alt="API Guardian Comparison" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </main>

        {/* ── TRUSTED BY ── */}
        <div style={{ textAlign:'center', padding:'40px 0', borderTop:`1px solid ${lp.border}`, borderBottom:`1px solid ${lp.border}` }}>
          <p style={{ color:lp.textMuted, fontSize:'.85rem', textTransform:'uppercase', letterSpacing:1, marginBottom:24 }}>Securing endpoints for innovative teams worldwide</p>
          <div style={{ display:'flex', justifyContent:'center', gap:48, flexWrap:'wrap', opacity:.45, filter:'grayscale(100%)' }}>
            {[
              <svg key="a" viewBox="0 0 100 30" style={{height:28,fill:lp.textMain}}><rect width="100" height="20" rx="10"/></svg>,
              <svg key="b" viewBox="0 0 100 30" style={{height:28,fill:lp.textMain}}><circle cx="15" cy="15" r="10"/><rect x="35" y="10" width="60" height="10" rx="5"/></svg>,
              <svg key="c" viewBox="0 0 100 30" style={{height:28,fill:lp.textMain}}><polygon points="15,5 25,25 5,25"/><rect x="35" y="10" width="60" height="10" rx="5"/></svg>,
              <svg key="d" viewBox="0 0 100 30" style={{height:28,fill:lp.textMain}}><rect width="100" height="20" rx="10"/></svg>,
            ]}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section id="lp-features" style={{ padding:'80px 0' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={h2s}>Banish vulnerabilities instantly</h2>
            <p style={{ color:lp.textMuted, fontSize:'1.1rem' }}>Everything you need to secure your backend, packed into one intuitive platform.</p>
          </div>
          <div style={grid3}>
            {[
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title:'Real-Time Threat Shield', desc:'Automatically block DDoS attempts, SQL injections, and malicious bot traffic before they hit your database.' },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title:'Deep Usage Analytics', desc:'Track request volumes, latency drops, and error rates across all your endpoints with our beautiful dashboard.' },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title:'5-Minute Integration', desc:'No complex configurations. Drop in our SDK, grab your API key, and your infrastructure is secured instantly.' },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title:'Instant Team Alerts', desc:'Coordinate security squads during active breaches. Set role-based rule access limits and escalate infrastructure threats via cross-team rooms.' },
            ].map((f,i)=>(
              <div key={i} className="lp-card" style={card}>
                <div style={icon}>{f.icon}</div>
                <h3 style={{ marginBottom:12, fontSize:'1.25rem' }}>{f.title}</h3>
                <p style={{ color:lp.textMuted, fontSize:'.95rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CODE SHOWCASE ── */}
        <section style={{ padding:'0 0 80px' }}>
          <div style={{ background:lp.surface, borderRadius:24, border:`1px solid ${lp.border}`, padding:60, display:'flex', alignItems:'center', gap:60, boxShadow:lp.shadow }}>
            <div style={{ flex:1 }}>
              <h2 style={h2s}>Built for Developers</h2>
              <p style={{ color:lp.textMuted, marginBottom:24 }}>We know you hate complex setups. We do too. That's why API Guardian is designed to wrap around your existing code in literally two lines.</p>
              <button className="lp-btnO" style={btnO}>Read the Documentation</button>
            </div>
            <div style={{ flex:1, background:'#0f172a', borderRadius:12, border:'1px solid #334155', overflow:'hidden', boxShadow:'0 25px 50px -12px rgba(0,0,0,.5)' }}>
              
              <div style={{ background:'#1e293b', padding:'4px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #334155' }}>
                <div style={{ display:'flex', gap:8 }}>
                  {[['#ef4444'],[' #f59e0b'],['#10b981']].map(([c],i)=><div key={i} style={{ width:12, height:12, borderRadius:'50%', background:c }}/>)}
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {['node', 'python', 'cpp'].map((l) => (
                    <button 
                      key={l}
                      onClick={() => setActiveLang(l)}
                      style={{
                        background: activeLang === l ? '#0f172a' : 'transparent',
                        border: 'none',
                        color: activeLang === l ? '#3b82f6' : '#94a3b8',
                        padding: '6px 12px',
                        borderRadius: '6px 6px 0 0',
                        fontSize: '.8rem',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        fontWeight: activeLang === l ? 600 : 400,
                        transition: 'all .2s'
                      }}
                    >
                      {l === 'node' ? 'Node.js' : l === 'python' ? 'Python' : 'C++'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding:24, color:'#e2e8f0', fontFamily:'monospace', fontSize:'.9rem', lineHeight:1.5, overflowX:'auto', minHeight: '220px' }}>
                {activeLang === 'node' && (
                  <div>
                    <div><span style={{color:'#c678dd'}}>import</span> {`{ Guardian }`} <span style={{color:'#c678dd'}}>from</span> <span style={{color:'#98c379'}}>'@apiguardian/node'</span>;</div>
                    <div><span style={{color:'#c678dd'}}>import</span> express <span style={{color:'#c678dd'}}>from</span> <span style={{color:'#98c379'}}>'express'</span>;</div>
                    <div style={{marginTop:12}}><span style={{color:'#c678dd'}}>const</span> a = <span style={{color:'#61afef'}}>express</span>();</div>
                    <div><span style={{color:'#c678dd'}}>const</span> g = <span style={{color:'#c678dd'}}>new</span> <span style={{color:'#61afef'}}>Guardian</span>(<span style={{color:'#98c379'}}>'sk_live_123'</span>);</div>
                    <div style={{marginTop:12,color:'#5c6370'}}>{`// Secure setup`}</div>
                    <div>a.<span style={{color:'#61afef'}}>use</span>(g.<span style={{color:'#61afef'}}>protect</span>());</div>
                    <div>a.<span style={{color:'#61afef'}}>get</span>(<span style={{color:'#98c379'}}>'/api'</span>, (q, r) =&gt; r.<span style={{color:'#61afef'}}>json</span>({'{'} s: <span style={{color:'#98c379'}}>'secure'</span> {'}'}));</div>
                  </div>
                )}

                {activeLang === 'python' && (
                  <div>
                    <div><span style={{color:'#c678dd'}}>from</span> apiguardian <span style={{color:'#c678dd'}}>import</span> Guardian</div>
                    <div><span style={{color:'#c678dd'}}>from</span> flask <span style={{color:'#c678dd'}}>import</span> Flask</div>
                    <div style={{marginTop:12}}><span style={{color:'#e5c07b'}}>a</span> = Flask(__name__)</div>
                    <div><span style={{color:'#e5c07b'}}>g</span> = Guardian(<span style={{color:'#98c379'}}>'sk_live_123'</span>)</div>
                    <div style={{marginTop:12,color:'#5c6370'}}>{`# Secure setup`}</div>
                    <div><span style={{color:'#e5c07b'}}>@a.before_request</span></div>
                    <div><span style={{color:'#c678dd'}}>def</span> <span style={{color:'#61afef'}}>p</span>(): <span style={{color:'#e5c07b'}}>g</span>.protect()</div>
                  </div>
                )}

                {activeLang === 'cpp' && (
                  <div>
                    <div><span style={{color:'#c678dd'}}>#include</span> <span style={{color:'#98c379'}}>"apiguardian.h"</span></div>
                    <div><span style={{color:'#c678dd'}}>#include</span> <span style={{color:'#98c379'}}>"crow.h"</span></div>
                    <div style={{marginTop:12}}><span style={{color:'#c678dd'}}>int</span> <span style={{color:'#61afef'}}>main</span>() {'{'}</div>
                    <div style={{paddingLeft:20}}><span style={{color:'#e5c07b'}}>crow::SimpleApp</span> a;</div>
                    <div style={{paddingLeft:20}}><span style={{color:'#e5c07b'}}>Guardian</span> g(<span style={{color:'#98c379'}}>'sk_live_123'</span>);</div>
                    <div style={{paddingLeft:20,marginTop:12,color:'#5c6370'}}>{`// Secure setup`}</div>
                    <div style={{paddingLeft:20}}>a.route_dynamic(<span style={{color:'#98c379'}}>"/api"</span>)([&amp;g]() {'{'}</div>
                    <div style={{paddingLeft:40}}>g.protect(); <span style={{color:'#c678dd'}}>return</span> <span style={{color:'#98c379'}}>{`"{\\"s\\":\\"ok\\"}"`}</span>;</div>
                    <div style={{paddingLeft:20}}>{`});`}</div>
                    <div>{'}'}</div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* ── DOCS ── */}
        <section id="lp-docs" style={{ padding:'0 0 80px' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={h2s}>Documentation</h2>
            <p style={{ color:lp.textMuted, fontSize:'1.1rem' }}>Everything you need to integrate and master API Guardian.</p>
          </div>
          <div style={grid3}>
            {[
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, title:'Getting Started', desc:'Learn how to integrate the API Guardian SDK into your application in under 5 minutes.', link:'Read Guide →' },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, title:'API Reference', desc:'Detailed documentation of all endpoints, accepted parameters, and JSON responses.', link:'View API →' },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title:'Authentication', desc:'Secure your requests properly using API keys, OAuth, and JWT tokens.', link:'Learn More →' },
            ].map((d,i)=>(
              <div key={i} className="lp-card" style={card}>
                <div style={icon}>{d.icon}</div>
                <h3 style={{ marginBottom:12, fontSize:'1.25rem' }}>{d.title}</h3>
                <p style={{ color:lp.textMuted, fontSize:'.95rem', flex:1 }}>{d.desc}</p>
                <a href="#" className="lp-doc-a">{d.link}</a>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="lp-pricing" style={{ padding:'0 0 80px' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={h2s}>Simple, transparent pricing</h2>
            <p style={{ color:lp.textMuted, fontSize:'1.1rem' }}>Scale securely without breaking the bank. Choose the plan that fits your team.</p>
          </div>
          <div style={grid3}>
            {[
              { name:'Starter', price:'$0',   per:'/mo', desc:'Perfect for side projects and testing environments.', features:['100,000 API requests/mo','Basic DDoS protection','Community support','7-day log retention'], cta:'Get Started', primary:false },
              { name:'Pro',     price:'$49',  per:'/mo', desc:'For growing startups and production APIs.',          features:['10,000,000 API requests/mo','Advanced threat shield','Priority email support','30-day log retention'], cta:'Start Free Trial', primary:true, popular:true },
              { name:'Enterprise', price:'Custom', per:'', desc:'For mission-critical infrastructure and scale.',   features:['Unlimited API requests','Custom WAF rules','24/7 dedicated support SLA','Infinite log retention'], cta:'Contact Sales', primary:false },
            ].map((p,i)=>(
              <div key={i} className={`lp-card${p.popular?' lp-popular':''}`} style={{ ...card, ...(p.popular?{borderColor:lp.accent}:{}) }}>
                <h3 style={{ fontSize:'1.25rem', display:'flex', alignItems:'center', gap:8, marginBottom:0 }}>
                  {p.name}
                  {p.popular&&<span style={{ background:lp.accent, color:'#fff', fontSize:'.72rem', padding:'3px 10px', borderRadius:20, textTransform:'uppercase', letterSpacing:1 }}>Popular</span>}
                </h3>
                <div style={{ fontSize:'3rem', fontWeight:800, margin:'16px 0', color:lp.textMain, display:'flex', alignItems:'baseline', gap:4 }}>
                  {p.price}<span style={{ fontSize:'1rem', color:lp.textMuted, fontWeight:400 }}>{p.per}</span>
                </div>
                <p style={{ color:lp.textMuted, marginBottom:24 }}>{p.desc}</p>
                <ul style={{ listStyle:'none', padding:0, marginBottom:32, color:lp.textMuted, flex:1 }}>
                  {p.features.map((f,j)=><li key={j} className="lp-li" style={{ marginBottom:12, fontSize:'.95rem' }}>{f}</li>)}
                </ul>
                <button className={p.primary?'lp-btnP':'lp-btnO'} onClick={()=>onNavigate('login')} style={{ ...(p.primary?btnP:btnO), width:'100%', textAlign:'center' }}>{p.cta}</button>
              </div>
            ))}
          </div>
        </section>

        {/* ── DEEP DIVE ROWS ── */}
        <section style={{ padding:'0 0 80px' }}>
          {[
            { 
              title: 'Total visibility into every request', 
              desc: "Stop guessing what's breaking your app. Our dashboard gives you a granular view of your API traffic, allowing you to filter by user, region, or specific error codes.", 
              items: ['Monitor latency spikes in real-time', 'Identify bad actors instantly', 'Export logs for compliance audits'], 
              image: dashboardImg, 
              rev: false 
            },
            { 
              title: 'Alerts that actually matter', 
              desc: 'Cut through the noise. Set custom threshold rules so your team only gets pinged when a genuine anomaly occurs.', 
              items: ['Slack & Microsoft Teams integration', 'Webhook support for custom flows', 'Smart escalation policies'], 
              image: alertsImg, 
              rev: true 
            },
          ].map((row, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:60, marginBottom:100, flexDirection:row.rev?'row-reverse':'row' }}>
              
              <div style={{ flex:1 }}>
                <h2 style={{ ...h2s, fontSize:'2rem', marginBottom:16 }}>{row.title}</h2>
                <p style={{ color:lp.textMuted, fontSize:'1.05rem', marginBottom:24 }}>{row.desc}</p>
                <ul style={{ listStyle:'none', padding:0, color:lp.textMuted }}>
                  {row.items.map((it, j) => (
                    <li key={j} className="lp-li" style={{ marginBottom:12, fontSize:'.95rem' }}>{it}</li>
                  ))}
                </ul>
              </div>

              <div style={{ flex:1, background:lp.surface, border:`1px solid ${lp.border}`, borderRadius:24, height:380, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:lp.shadow }}>
                <img 
                  src={row.image} 
                  alt={row.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              </div>
              
            </div>
          ))}
        </section>

        {/* ── INFINITE SCROLLING REVIEWS TRACK ── */}
        <section style={{ padding:'0 0 60px', overflow:'hidden' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <p style={{ color:lp.accent, fontSize:'.85rem', textTransform:'uppercase', letterSpacing:1.5, fontWeight:700, marginBottom:8 }}>Developer Testimonials</p>
            <h2 style={{ ...h2s, fontSize:'2rem' }}>Approved by Engineers</h2>
          </div>
          
          <div className="lp-mq-container" style={{ width:'100%', overflow:'hidden', position:'relative', padding:'10px 0' }}>
            {/* Left and Right Fade Overlays for Depth */}
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:80, background:`linear-gradient(to right, ${lp.bg}, transparent)`, zIndex:3, pointerEvents:'none' }}/>
            <div style={{ position:'absolute', right:0, top:0, bottom:0, width:80, background:`linear-gradient(to left, ${lp.bg}, transparent)`, zIndex:3, pointerEvents:'none' }}/>
            
            {/* Double mapped reviews to form a seamless infinite sequence loop */}
            <div className="lp-mq-track">
              {[...reviews, ...reviews].map((r, i) => (
                <div key={i} style={{ 
                  background: lp.surface, 
                  border: `1px solid ${lp.border}`, 
                  borderRadius: 16, 
                  padding: '24px', 
                  width: 320, 
                  boxShadow: lp.shadow, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between',
                  gap: 16
                }}>
                  <p style={{ color: lp.textMuted, fontSize: '.95rem', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{r.t}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img 
                      src={r.a} 
                      alt={r.n} 
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${lp.accent}` }} 
                    />
                    <div>
                      <h4 style={{ fontSize: '.95rem', fontWeight: 600, margin: 0, color: lp.textMain }}>{r.n}</h4>
                      <p style={{ fontSize: '.8rem', color: lp.accent, margin: 0 }}>{r.r}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section style={{ padding:'0 0 80px' }}>
          <div style={{ textAlign:'center', padding:'90px 24px', background:lp.surface, borderRadius:24, border:`1px solid ${lp.border}`, boxShadow:lp.shadow }}>
            <h2 style={{ ...h2s, fontSize:'3rem', marginBottom:24 }}>Ready to exorcise your API demons?</h2>
            <p style={{ color:lp.textMuted, fontSize:'1.2rem', marginBottom:40, maxWidth:580, margin:'0 auto 40px' }}>
              Join thousands of developers who sleep better at night knowing their backend infrastructure is guarded.
            </p>
            <button className="lp-btnP" onClick={()=>onNavigate('login')} style={{ ...btnP, padding:'16px 36px', fontSize:'1.1rem' }}>
              Start Securing for Free
            </button>
          </div>
        </section>

        {/* ── ROBUST MULTI-COLUMN FOOTER ── */}
        <footer style={{ padding:'60px 0 40px', borderTop:`1px solid ${lp.border}` }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:40, marginBottom:40 }}>
            
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ fontSize:'1.25rem', fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lp.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                APIGuardian
              </div>
              <p style={{ color:lp.textMuted, fontSize:'.85rem', lineHeight:1.5 }}>
                Real-time edge shield and telemetry monitoring built natively for development squads.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '.95rem', fontWeight: 600, marginBottom: 16, color: lp.textMain }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#lp-features" className="lp-footer-link">Features</a>
                <a href="#" className="lp-footer-link">Integrations</a>
                <a href="#" className="lp-footer-link">Changelog</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '.95rem', fontWeight: 600, marginBottom: 16, color: lp.textMain }}>Resources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#lp-docs" className="lp-footer-link">Documentation</a>
                <a href="#" className="lp-footer-link">API Reference</a>
                <a href="#" className="lp-footer-link">Status Page</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '.95rem', fontWeight: 600, marginBottom: 16, color: lp.textMain }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#" className="lp-footer-link">About Us</a>
                <a href="#" className="lp-footer-link">Careers</a>
                <a href="#" className="lp-footer-link">Privacy & Policy</a>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:24, borderTop:`1px solid ${lp.border}`, color:lp.textMuted, fontSize:'.9rem', flexWrap:'wrap', gap:16 }}>
            <div>© 2026 API Guardian Inc. All rights reserved.</div>
            <div style={{ display:'flex', gap:20, alignItems:'center' }}>
              
              <a href="#" className="lp-footer-link" aria-label="GitHub" style={{ display:'flex', alignItems:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              <a href="#" className="lp-footer-link" aria-label="LinkedIn" style={{ display:'flex', alignItems:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>

            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};


/* ============================================================
   ROOT APP
============================================================ */
export default function App() {
  // 'landing' → 'login' → 'dashboard'
  const [page,setPage]=useState('landing');
  const [view,setView]=useState('dash');
  const [mode,setMode]=useState('dark');
  const [hue,setHue]=useState(85);
  const [toast,setToast]=useState(null);
  const [toastType,setToastType]=useState('ok');
  const [showTheme,setShowTheme]=useState(false);
  const [modal,setModal]=useState(null);
  const [modalData,setModalData]=useState({});

  const showToast=(msg,type='ok')=>{setToast(msg);setToastType(type);};

  useEffect(()=>{
    const el=document.createElement('style');
    el.setAttribute('data-ag','1');
    el.innerHTML=buildCSS(mode,hue);
    const old=document.querySelector('[data-ag]');
    if(old)document.head.removeChild(old);
    document.head.appendChild(el);
    return()=>{const e=document.querySelector('[data-ag]');if(e)document.head.removeChild(e);};
  },[mode,hue]);

  useEffect(()=>{
    if(!toast)return;
    const t=setTimeout(()=>setToast(null),3200);
    return()=>clearTimeout(t);
  },[toast]);

  const openModal=(type,data={})=>{setModal(type);setModalData(data);};
  const closeModal=()=>{setModal(null);setModalData({});};

  const VIEW_LABEL={dash:'Dashboard',history:'Scan History',eps:'Endpoints',alerts:'Threat Alerts',github:'GitHub Integration',postman:'Postman Integration',openapi:'OpenAPI Import',cicd:'CI/CD Integration',health:'API Health Monitor',loadtest:'Load Testing',mockserver:'Mock Server',changes:'Change Detection',ai:'AI Features',reports:'PDF Reports'};
  const alertCount=ALERTS.filter(a=>a.type==='crit').length;

  if(page==='landing') return <LandingPage onNavigate={setPage}/>;
  if(page==='login')   return <LoginPage   onLogin={()=>setPage('dashboard')}/>;

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--bg)'}}>
      <Sidebar view={view} setView={setView} openModal={openModal}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        <TopBar openModal={openModal} setShowTheme={setShowTheme} alertCount={alertCount}/>
        {/* Breadcrumb */}
        <div style={{padding:'12px 24px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--t3)'}}>
          <span style={{fontWeight:600}}>APIGUARD</span>
          <span style={{color:'var(--border2)'}}>›</span>
          <span style={{color:'var(--t1)',fontWeight:700}}>{VIEW_LABEL[view]||view.toUpperCase()}</span>
        </div>
        <main style={{flex:1,padding:'24px',overflowY:'auto',maxWidth:1440,width:'100%'}}>
          {view==='dash'     &&<ViewDashboard  setToast={showToast}  openModal={openModal}/>}
          {view==='history'  &&<ViewScanHistory openModal={openModal}/>}
          {view==='eps'      &&<ViewEndpoints   openModal={openModal}/>}
          {view==='alerts'   &&<ViewAlerts      setToast={showToast}/>}
          {view==='github'   &&<ViewGitHub      setToast={showToast}/>}
          {view==='postman'  &&<ViewPostman     setToast={showToast}/>}
          {view==='health'   &&<ViewHealth/>}
          {view==='changes'  &&<ViewChanges     setToast={showToast}/>}
          {view==='ai'       &&<ViewAI          openModal={openModal}/>}
          {view==='cicd'     &&(
            <div className="card au" style={{textAlign:'center',padding:'60px'}}>
              <div style={{fontSize:40,marginBottom:16}}><IcCI s={40} c="var(--p)"/></div>
              <div style={{fontSize:18,fontWeight:800,fontFamily:'var(--display)',color:'var(--t1)',marginBottom:8}}>CI/CD Integration</div>
              <div style={{fontSize:13,color:'var(--t3)',maxWidth:400,margin:'0 auto',lineHeight:1.7,marginBottom:24}}>Connect GitHub Actions or Jenkins pipelines with one click. Auto-trigger security scans on every push or PR. Phase 2 feature — coming soon.</div>
              <button className="btn-primary" onClick={()=>openModal('ai',{title:'CI/CD Config Generator',icon:<IcCI s={22}/>,prompt:'Generate a complete GitHub Actions CI/CD pipeline for a Python FastAPI project that includes linting, testing, security scanning with OWASP ZAP, Docker build, and deployment.'})} style={{margin:'0 auto',display:'flex'}}>
                <IcSparkles s={14}/>Generate with AI
              </button>
            </div>
          )}
        </main>
      </div>
      {/* Modals */}
      {modal==='scan'       &&<ScanModal       close={closeModal} setToast={showToast}/>}
      {modal==='pdf'        &&<PDFModal        close={closeModal} setToast={showToast}/>}
      {modal==='openapi'    &&<OpenAPIModal    close={closeModal} setToast={showToast}/>}
      {modal==='loadtest'   &&<LoadTestModal   close={closeModal} setToast={showToast}/>}
      {modal==='mockserver' &&<MockServerModal close={closeModal} setToast={showToast}/>}
      {modal==='ai'         &&<AIModal title={modalData.title} icon={modalData.icon} prompt={modalData.prompt} close={closeModal}/>}
      {showTheme&&<ThemeDrawer mode={mode} setMode={setMode} hue={hue} setHue={setHue} close={()=>setShowTheme(false)}/>}
      {toast&&(
        <div className={`toast${toastType==='err'?' toast-err':''}`}>
          <div style={{width:26,height:26,borderRadius:'50%',background:toastType==='err'?'hsla(348,88%,60%,.15)':'hsla(148,72%,54%,.15)',color:toastType==='err'?'var(--red)':'var(--green)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {toastType==='err'?<IcAlert s={14}/>:<IcCheck s={14}/>}
          </div>
          {toast}
        </div>
      )}
    </div>
  );
}
