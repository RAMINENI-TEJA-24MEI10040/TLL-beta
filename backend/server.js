const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data
let SCAN_DATA = [
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

let UPTIME_DATA = Array.from({length:24},(_,i)=>({h:`${String(i).padStart(2,'0')}:00`,uptime:Math.random()>.05?100:Math.floor(Math.random()*80+10),latency:Math.floor(Math.random()*40+12),errors:Math.floor(Math.random()*8)}));

let LOAD_DATA = {
  100: Array.from({length:10},(_,i)=>({t:`${i*10}s`,rps:Math.floor(Math.random()*40+80),latency:Math.floor(Math.random()*20+30),errors:Math.floor(Math.random()*3)})),
  1000:Array.from({length:10},(_,i)=>({t:`${i*10}s`,rps:Math.floor(Math.random()*200+600),latency:Math.floor(Math.random()*80+120),errors:Math.floor(Math.random()*15)})),
};

let RADAR_DATA = [
  {subject:'Auth',A:90,B:65,fullMark:100},
  {subject:'Injection',A:85,B:78,fullMark:100},
  {subject:'BOLA',A:72,B:55,fullMark:100},
  {subject:'Exposure',A:88,B:70,fullMark:100},
  {subject:'Misconfig',A:95,B:80,fullMark:100},
  {subject:'Rate Limit',A:68,B:60,fullMark:100},
];

let ENDPOINTS = [
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

let ALERTS = [
  {id:1,type:'crit', msg:'BOLA on /api/v1/bot/navigate',                   t:'2m ago',  repo:'med-bot-gw',     fix:'Add object-level auth checks',        cve:'CVE-2024-1234'},
  {id:2,type:'high', msg:'Rate limit missing on /api/v1/auth/login',       t:'15m ago', repo:'med-bot-gw',     fix:'Sliding window rate limiter',          cve:'CVE-2024-5678'},
  {id:3,type:'med',  msg:'Unencrypted MPU6050 sensor payload',             t:'1h ago',  repo:'pawsitive-api',  fix:'Enable TLS 1.3 for sensor stream',     cve:null},
  {id:4,type:'crit', msg:'Admin purge exposed without JWT',                t:'3h ago',  repo:'skitech-backend',fix:'Add jwt.verify() middleware',           cve:'CVE-2024-9012'},
  {id:5,type:'safe', msg:'Alice OS numeric input validation patched',      t:'1d ago',  repo:'alice-os-core',  fix:'N/A — resolved',                       cve:null},
  {id:6,type:'med',  msg:'Acoustic fingerprinting pitch variance failure', t:'2d ago',  repo:'pawsitive-api',  fix:'Revisit FFT window sizing',            cve:null},
  {id:7,type:'high', msg:'Swap cost loop in worker node',                  t:'2d ago',  repo:'skitech-backend',fix:'Add loop termination guard',            cve:'CVE-2024-3456'},
  {id:8,type:'safe', msg:'Sleep predictor model synced',                   t:'3d ago',  repo:'sleep-predictor',fix:'N/A — resolved',                       cve:null},
];

let REPOS = [
  {n:'pawsitive-diagnosis-api',  b:'main',              s:'safe', t:'10m ago', u:12, lang:'Python',  stars:34, prs:2},
  {n:'alice-os-core',            b:'feature/num-input', s:'med',  t:'1h ago',  u:4,  lang:'C++',     stars:21, prs:1},
  {n:'sleep-predictor-svc',      b:'main',              s:'safe', t:'3h ago',  u:8,  lang:'Python',  stars:18, prs:0},
  {n:'skitech-innothon-backend', b:'develop',           s:'high', t:'1d ago',  u:22, lang:'Node.js', stars:9,  prs:4},
  {n:'med-bot-gateway',          b:'main',              s:'crit', t:'2d ago',  u:45, lang:'Go',      stars:55, prs:7},
  {n:'gfg-vit-chapter-api',      b:'main',              s:'safe', t:'4d ago',  u:2,  lang:'Node.js', stars:7,  prs:0},
];

let SCAN_HISTORY = [
  {id:'SCN-001',target:'pawsitive-diagnosis-api',date:'2026-05-31 20:13',score:94,issues:3,status:'completed',duration:'2m 14s'},
  {id:'SCN-002',target:'med-bot-gateway',         date:'2026-05-31 18:00',score:61,issues:12,status:'completed',duration:'4m 08s'},
  {id:'SCN-003',target:'alice-os-core',           date:'2026-05-30 14:22',score:82,issues:5,status:'completed',duration:'1m 55s'},
  {id:'SCN-004',target:'skitech-innothon-backend',date:'2026-05-29 09:10',score:57,issues:18,status:'failed',   duration:'0m 44s'},
  {id:'SCN-005',target:'sleep-predictor-svc',     date:'2026-05-28 16:45',score:96,issues:1,status:'completed',duration:'1m 32s'},
];

let CHANGES = [
  {type:'added',   endpoint:'/api/v2/predict/sleep',  repo:'sleep-predictor-svc',  time:'2h ago', auth:'JWT'},
  {type:'removed', endpoint:'/api/v1/legacy/auth',    repo:'med-bot-gw',           time:'1d ago', auth:'None'},
  {type:'auth',    endpoint:'/api/v1/auth/login',     repo:'med-bot-gw',           time:'2d ago', auth:'None→JWT'},
  {type:'added',   endpoint:'/api/v1/sensors/dht22',  repo:'pawsitive-api',        time:'3d ago', auth:'API Key'},
];

let PIE_THREATS = [
  {name:'Broken Auth',value:35,color:'#ef4469'},
  {name:'BOLA',       value:25,color:'#f5803f'},
  {name:'Injection',  value:20,color:'#3b98f5'},
  {name:'Misconfig',  value:12,color:'#9f7aea'},
  {name:'Other',      value:8, color:'#34d484'},
];

let MOCK_ENDPOINTS_SPEC = [
  {m:'GET',  p:'/users',       desc:'List all users',            params:['page','limit'],auth:'Bearer'},
  {m:'POST', p:'/users',       desc:'Create a new user',         params:['body'],        auth:'Bearer'},
  {m:'GET',  p:'/users/{id}',  desc:'Get user by ID',            params:['id'],          auth:'Bearer'},
  {m:'PUT',  p:'/users/{id}',  desc:'Update user',               params:['id','body'],   auth:'Bearer'},
  {m:'DELETE',p:'/users/{id}', desc:'Delete user',               params:['id'],          auth:'Admin'},
  {m:'POST', p:'/auth/login',  desc:'Authenticate & get token',  params:['body'],        auth:'None'},
  {m:'POST', p:'/auth/refresh',desc:'Refresh access token',      params:['body'],        auth:'Bearer'},
];

// --- ROUTES --- //

// 1. Dashboard
app.get('/api/dashboard', (req, res) => {
  res.json({
    SCAN_DATA,
    UPTIME_DATA,
    LOAD_DATA,
    RADAR_DATA,
    PIE_THREATS,
    CHANGES,
    REPOS
  });
});

// 2. Scan History
app.get('/api/scans', (req, res) => {
  res.json(SCAN_HISTORY);
});

app.post('/api/scans', (req, res) => {
  const newScan = req.body;
  newScan.id = `SCN-${String(SCAN_HISTORY.length + 1).padStart(3, '0')}`;
  SCAN_HISTORY.unshift(newScan);
  res.status(201).json(newScan);
});

// 3. Threat Alerts
app.get('/api/alerts', (req, res) => {
  res.json(ALERTS);
});

app.post('/api/alerts', (req, res) => {
  const newAlert = req.body;
  newAlert.id = ALERTS.length ? Math.max(...ALERTS.map(a => a.id)) + 1 : 1;
  ALERTS.unshift(newAlert);
  res.status(201).json(newAlert);
});

// 4. Endpoints
app.get('/api/endpoints', (req, res) => {
  res.json(ENDPOINTS);
});

app.post('/api/endpoints', (req, res) => {
  const newEndpoint = req.body;
  ENDPOINTS.unshift(newEndpoint);
  res.status(201).json(newEndpoint);
});

app.get('/api/endpoints-spec', (req, res) => {
  res.json(MOCK_ENDPOINTS_SPEC);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
