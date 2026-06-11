import re

file_path = r"c:\Users\Laptop\tlll\TLL-beta\src\App.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Refactor ViewScanHistory -> TargetDetail (History & Findings)
history_pattern = re.compile(r"const ViewScanHistory = \(\{openModal\}\) => \{[\s\S]*?^\};\n", re.MULTILINE)

new_history = """const ViewScanHistory = ({openModal}) => {
  const [targets, setTargets] = useState([]);
  const [selId, setSelId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getTargets().then(data => { setTargets(data); setLoading(false); }).catch(e => { setLoading(false); });
  }, []);

  useEffect(() => {
    if (selId) {
      setDetail(null);
      apiClient.getTarget(selId).then(setDetail).catch(console.error);
    }
  }, [selId]);

  if (loading) return <div style={{padding:60, textAlign:'center'}}><Spinner s={30}/></div>;

  const uptimeData = detail?.scan_results?.map(r => ({
    time: new Date(r.checked_at).toLocaleTimeString(),
    latency: r.response_time_ms,
    status: r.status_code
  })) || [];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div className="au card" style={{padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'0 18px'}}>
            <div style={{fontSize:20,fontWeight:800,fontFamily:'var(--display)',color:'var(--p)'}}>{targets.length}</div>
            <div style={{fontSize:12,color:'var(--t2)',fontWeight:600}}>Total Targets</div>
          </div>
        </div>
        <button className="btn-primary" onClick={()=>openModal('scan')}><IcPlay s={14}/>New Scan</button>
      </div>

      <div className="card au1" style={{padding:0}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',padding:'11px 22px',borderBottom:'1px solid var(--border)',fontSize:10,fontWeight:700,color:'var(--t3)',letterSpacing:'.09em',fontFamily:'var(--mono)'}}>
          <div>TARGET URL</div><div>SCORE</div><div>STATUS</div><div>LAST CHECKED</div>
        </div>
        {targets.map((s,i)=>(
          <div key={s.id} className="tr" onClick={()=>setSelId(selId===s.id?null:s.id)} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',padding:'14px 22px',borderBottom:i<targets.length-1?'1px solid var(--border)':'none',alignItems:'center',cursor:'pointer',background:selId===s.id?'var(--p-dim2)':'var(--surface)'}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--t1)'}}>{s.url}</div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:s.security_score>=90?'var(--green)':s.security_score>=70?'var(--orange)':'var(--red)'}}>{s.security_score}%</div>
            <span style={{padding:'3px 10px',borderRadius:6,fontSize:11,fontWeight:700,fontFamily:'var(--mono)',background:s.status==='healthy'?'hsla(148,72%,54%,.14)':'hsla(348,88%,60%,.14)',color:s.status==='healthy'?'var(--green)':'var(--red)',display:'inline-block',width:'fit-content'}}>
              {s.status}
            </span>
            <div style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)'}}>{s.last_checked ? new Date(s.last_checked).toLocaleString() : 'Never'}</div>
          </div>
        ))}
      </div>

      {selId && detail && (
        <div className="card au" style={{borderColor:'var(--p)'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--display)'}}>Target Detail — {detail.url}</div>
            <button className="btn-icon" onClick={()=>setSelId(null)}><IcX s={14}/></button>
          </div>
          
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr', gap:16, marginBottom: 20}}>
             {/* Latency Chart */}
             <div className="card-sm">
                <div style={{fontSize:12, fontWeight:700, marginBottom:8}}>Recent Scan Latency (ms)</div>
                <div style={{height:150}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={uptimeData} margin={{top:5,right:0,left:-20,bottom:0}}>
                      <defs><linearGradient id="gUp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--p)" stopOpacity={.3}/><stop offset="100%" stopColor="var(--p)" stopOpacity={0}/></linearGradient></defs>
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}}/>
                      <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Area type="monotone" dataKey="latency" stroke="var(--p)" strokeWidth={2} fill="url(#gUp)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
             {/* Status Codes Chart */}
             <div className="card-sm">
                <div style={{fontSize:12, fontWeight:700, marginBottom:8}}>Recent Status Codes</div>
                <div style={{height:150}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={uptimeData} margin={{top:5,right:0,left:-20,bottom:0}}>
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}}/>
                      <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--t3)',fontSize:10}}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Bar dataKey="status" fill="var(--green)" opacity={.8} radius={[2,2,0,0]} barSize={8}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>

          <div style={{fontSize:14, fontWeight:700, marginBottom:10}}>Vulnerabilities Found ({detail.findings?.length || 0})</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {detail.findings?.map(f => (
              <div key={f.id} className="card-sm" style={{borderLeft:`3px solid ${sc(f.severity==='CRITICAL'?'crit':f.severity==='HIGH'?'high':f.severity==='MEDIUM'?'med':'safe')}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                      <Tag s={f.severity.toLowerCase().slice(0,4)}/>
                      <span style={{fontSize:10,fontFamily:'var(--mono)',color:'var(--t3)'}}>{f.engine_source}</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--t1)'}}>{f.title}</div>
                    <div style={{fontSize:12,color:'var(--t2)',marginTop:4}}>{f.description}</div>
                    {f.remediation && <div style={{fontSize:11,color:'var(--t3)',marginTop:6}}>Fix: <span style={{color:'var(--green)'}}>{f.remediation}</span></div>}
                  </div>
                </div>
              </div>
            ))}
            {!detail.findings?.length && <div style={{fontSize:12, color:'var(--t3)'}}>No vulnerabilities detected!</div>}
          </div>

        </div>
      )}
    </div>
  );
};
"""
content = history_pattern.sub(new_history, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("ViewScanHistory replaced.")
