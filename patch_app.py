import re

with open("src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add AddTargetModal before ScanModal
add_target_modal = """
/* ============================================================
   ADD TARGET MODAL
============================================================ */
const AddTargetModal = ({close,setToast}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [interval, setInterval] = useState('15m');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!url) return;
    setLoading(true);
    try {
      await apiClient.createTarget({url, name: name||url, monitor_interval: interval});
      setToast('Target added and scan triggered!');
      close();
    } catch(err) {
      setToast('Failed to add: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:500}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>Add Target API</div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          <div style={{marginBottom:15}}>
            <div className="sec-label">API URL</div>
            <input className="login-input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://api.example.com" />
          </div>
          <div style={{marginBottom:15}}>
            <div className="sec-label">Friendly Name (Optional)</div>
            <input className="login-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Production API" />
          </div>
          <div style={{marginBottom:20}}>
            <div className="sec-label">Monitor Interval</div>
            <select className="login-input" value={interval} onChange={e=>setInterval(e.target.value)}>
              <option value="5m">Every 5 minutes</option>
              <option value="15m">Every 15 minutes</option>
              <option value="30m">Every 30 minutes</option>
              <option value="1h">Every 1 hour</option>
            </select>
          </div>
          <div style={{display:'flex',gap:12}}>
            <button className="btn-primary" onClick={save} disabled={!url||loading} style={{flex:1,height:44}}>{loading?'Adding...':'Add Target'}</button>
            <button className="btn-ghost" onClick={close} style={{flex:1,height:44}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

"""
content = content.replace("/* ============================================================\n   SCAN MODAL", add_target_modal + "/* ============================================================\n   SCAN MODAL")

# 2. Update PDFModal to fetch real PDF
old_pdf_generate = """
  const generate=()=>{
    setGen(true);
    setTimeout(()=>{setGen(false);setDone(true);setToast('PDF report downloaded!');},2200);
  };
"""
new_pdf_generate = """
  const [targets, setTargets] = useState([]);
  const [targetId, setTargetId] = useState('');
  useEffect(() => { apiClient.getTargets().then(t=>{setTargets(t);if(t.length>0)setTargetId(t[0].id);}).catch(()=>{}); }, []);

  const generate=async()=>{
    if (!targetId) { setToast('Select a target first'); return; }
    setGen(true);
    try {
      const blob = await apiClient.downloadPdf(targetId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_report_${targetId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setToast('PDF report downloaded!');
      setDone(true);
    } catch(err) {
      setToast('Failed: ' + err.message);
    }
    setGen(false);
  };
"""
content = content.replace(old_pdf_generate, new_pdf_generate)
content = content.replace("desc:'High-level metrics & risk overview (2 pages)'},", "desc:'High-level metrics & risk overview (2 pages)'},\n  ];\n  // truncate opts")
content = re.sub(r"const opts=\[\n.*?(?=const generate=)", "", content, flags=re.DOTALL)

opts_replacement = """
  const opts=[
    {id:'full',label:'Full Security Report',desc:'All vulnerabilities, endpoints, recommendations'},
  ];
"""
content = content.replace("const generate=async()=>{", opts_replacement + "\n  const generate=async()=>{")

# inject target dropdown in pdf modal
old_pdf_opts = "{opts.map(o=>("
new_pdf_opts = """
            <div style={{marginBottom:15}}>
              <div className="sec-label">Select Target</div>
              <select className="login-input" value={targetId} onChange={e=>setTargetId(e.target.value)}>
                {targets.map(t=><option key={t.id} value={t.id}>{t.name||t.url}</option>)}
              </select>
            </div>
            {opts.map(o=>(
"""
content = content.replace(old_pdf_opts, new_pdf_opts)

# 3. Add LoadTestModal
load_test_modal = """
/* ============================================================
   LOAD TEST MODAL
============================================================ */
const LoadTestModal = ({close,setToast}) => {
  const [url, setUrl] = useState('');
  const [rps, setRps] = useState(10);
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    apiClient.getTargets().then(t=>{setTargets(t); if(t.length>0) setUrl(t[0].url);}).catch(()=>{});
  }, []);

  const runTest = async () => {
    setLoading(true); setResults(null);
    try {
      const data = await apiClient.runLoadTest(url, rps, duration);
      setResults(data.results);
      setToast('Load Test Complete');
    } catch(err) {
      setToast('Test Failed: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:600}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>Run Load Test</div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          <div style={{marginBottom:15}}>
            <div className="sec-label">Select Target URL</div>
            <select className="login-input" value={url} onChange={e=>setUrl(e.target.value)}>
                {targets.map(t=><option key={t.id} value={t.url}>{t.url}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:15,marginBottom:20}}>
            <div style={{flex:1}}>
              <div className="sec-label">RPS (Max 50)</div>
              <input type="number" max={50} min={1} className="login-input" value={rps} onChange={e=>setRps(Number(e.target.value))} />
            </div>
            <div style={{flex:1}}>
              <div className="sec-label">Duration Sec (Max 30)</div>
              <input type="number" max={30} min={1} className="login-input" value={duration} onChange={e=>setDuration(Number(e.target.value))} />
            </div>
          </div>
          {results && (
             <div style={{padding:16,background:'var(--p-dim2)',border:'1px solid var(--p-dim)',borderRadius:8,marginBottom:20,fontSize:13,color:'var(--t2)',lineHeight:1.6}}>
               <div><strong>Total Requests:</strong> {results.total_requests}</div>
               <div><strong>Successful:</strong> {results.successful}</div>
               <div><strong>Failed:</strong> {results.failed}</div>
               <div><strong>P50 Latency:</strong> {results.p50_latency_ms}ms</div>
               <div><strong>P95 Latency:</strong> {results.p95_latency_ms}ms</div>
               <div><strong>Duration:</strong> {results.duration_sec}s</div>
             </div>
          )}
          <button className="btn-primary" onClick={runTest} disabled={loading||!url} style={{width:'100%',height:44,justifyContent:'center'}}>{loading?'Running...':'Execute Load Test'}</button>
        </div>
      </div>
    </div>
  );
};
"""
# Note: SecurityToolsModal handles bola/rbac. The user wants load test back. Let's add it before MockServerModal.
content = content.replace("/* ============================================================\n   MOCK SERVER", load_test_modal + "/* ============================================================\n   MOCK SERVER")

# 4. ViewDocs and ViewSettings
views_code = """
/* ============================================================
   DOCS & SETTINGS VIEWS
============================================================ */
const ViewDocs = () => {
  return (
    <div className="fade-in" style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <div style={{fontSize:24,fontWeight:800,color:'var(--t1)',marginBottom:16,fontFamily:'var(--display)'}}>API Documentation</div>
      <div style={{flex:1,border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',background:'#fff'}}>
        <iframe src="http://localhost:8000/docs" style={{width:'100%',height:'100%',border:'none'}} title="Swagger Docs" />
      </div>
    </div>
  );
};

const ViewSettings = () => {
  return (
    <div className="fade-in" style={{maxWidth:800,margin:'0 auto'}}>
      <div style={{fontSize:24,fontWeight:800,color:'var(--t1)',marginBottom:6,fontFamily:'var(--display)'}}>Global Settings</div>
      <div style={{fontSize:14,color:'var(--t3)',marginBottom:24}}>Configure your API Guardian preferences.</div>
      
      <div className="card" style={{marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:800,marginBottom:16}}>Alert Notifications</div>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
          <input type="checkbox" defaultChecked /> <span style={{fontSize:14,color:'var(--t2)'}}>Email Alerts for Critical Findings</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <input type="checkbox" defaultChecked /> <span style={{fontSize:14,color:'var(--t2)'}}>Slack Webhook Notifications</span>
        </div>
      </div>
      
      <div className="card">
        <div style={{fontSize:16,fontWeight:800,marginBottom:16}}>Data Retention</div>
        <div className="sec-label">Keep scan history for</div>
        <select className="login-input" style={{maxWidth:300}}>
          <option>30 Days</option>
          <option>90 Days</option>
          <option>1 Year</option>
        </select>
        <button className="btn-primary" style={{marginTop:20}}>Save Settings</button>
      </div>
    </div>
  );
};
"""
content = content.replace("export default function App()", views_code + "\nexport default function App()")

# 5. Add triggers to Sidebar and Views
content = content.replace("onClick={()=>handleItem(item)}", "onClick={()=>{if(item.id==='docs'||item.id==='settings'){setView(item.id);return;} handleItem(item);}}")

sidebar_repl = """{[{id:'docs',icon:IcEye,l:'Documentation'},{id:'settings',icon:IcSettings,l:'Settings'}].map(x=>(
          <button key={x.l} className={`nav-item${view===x.id?' active':''}`} onClick={()=>setView(x.id)}><x.icon s={14}/>{x.l}</button>
        ))}"""
content = re.sub(r"\{\[\{icon:IcEye.*?\)\)\}", sidebar_repl, content, flags=re.DOTALL)

# Add to main routing
content = content.replace("{view==='dash'     &&", "{view==='docs'     &&<ViewDocs/>}\n          {view==='settings' &&<ViewSettings/>}\n          {view==='dash'     &&")

# Add "Add Target" button next to "New Scan" in Dashboard
dash_btn_repl = """<div style={{display:'flex',gap:10}}>
          <button className="btn-ghost" onClick={()=>openModal('add_target')}><IcZap s={14}/>Add Target</button>
          <button className="btn-primary" onClick={()=>openModal('scan')}><IcPlay s={14}/>New Scan</button>
        </div>"""
content = re.sub(r'<button className="btn-primary" onClick=\{\(\)=>openModal\(\'scan\'\)\}.*?New Scan</button>', dash_btn_repl, content, count=1)

# Register add_target modal
content = content.replace("{modal==='scan'       &&<ScanModal", "{modal==='add_target'&&<AddTargetModal close={closeModal} setToast={showToast}/>}\n      {modal==='scan'       &&<ScanModal")

# Write it back
with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched App.jsx")
