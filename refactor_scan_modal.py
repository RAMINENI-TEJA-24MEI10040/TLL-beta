import re

file_path = r"c:\Users\Laptop\tlll\TLL-beta\src\App.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Refactor ScanModal
scan_modal_pattern = re.compile(r"const ScanModal = \(\{close,setToast\}\) => \{[\s\S]*?^\};\n", re.MULTILINE)

new_scan_modal = """const ScanModal = ({close,setToast}) => {
  const [targets, setTargets] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    apiClient.getTargets().then(setTargets).catch(err => setToast(err.message));
  }, []);

  const start = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      await apiClient.triggerScan(targetId);
      setToast('Scan completed!');
      close();
    } catch (err) {
      setToast('Scan failed: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:640}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:13}}>
            <div style={{width:42,height:42,borderRadius:14,background:'var(--p-dim)',color:'var(--p)',display:'flex',alignItems:'center',justifyContent:'center'}}><IcTerminal s={20}/></div>
            <div>
              <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>Trigger Security Scan</div>
              <div style={{fontSize:12,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:2}}>Run Active Security Monitoring Engine</div>
            </div>
          </div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          {!loading ? (
            <div style={{marginBottom:22}}>
              <div className="sec-label">Select Target to Scan</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {targets.map(r=>(
                  <button key={r.id} onClick={()=>setTargetId(r.id)} style={{padding:'6px 14px',borderRadius:'var(--r-pill)',fontSize:12,fontWeight:600,background:targetId===r.id?'var(--p-dim)':'var(--surface2)',color:targetId===r.id?'var(--p-lite)':'var(--t2)',border:`1px solid ${targetId===r.id?'var(--p)':'var(--border)'}`}}>
                    {r.name || r.url}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{textAlign:'center', padding:40, color:'var(--p)'}}>
              <Spinner s={32}/>
              <div style={{marginTop:16, fontSize:14, fontWeight:600}}>Scan in progress... Please wait.</div>
            </div>
          )}
          <div style={{display:'flex',gap:12,marginTop:20}}>
            {!loading && <button className="btn-primary" disabled={!targetId} onClick={start} style={{flex:1,justifyContent:'center',height:44}}><IcPlay s={14}/>Start Scan</button>}
            <button className="btn-ghost" onClick={close} style={{flex:1, height:44}}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};
"""
content = scan_modal_pattern.sub(new_scan_modal, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("ScanModal replaced.")
