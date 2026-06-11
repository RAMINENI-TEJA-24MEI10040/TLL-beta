import re

file_path = r"c:\Users\Laptop\tlll\TLL-beta\src\App.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Refactor ViewDashboard
view_dashboard_pattern = re.compile(r"const ViewDashboard = \(\{setToast,openModal\}\) => \([\s\S]*?^\);\n", re.MULTILINE)

new_view_dashboard = """const ViewDashboard = ({setToast,openModal}) => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getTargets()
      .then(data => { setTargets(data); setLoading(false); })
      .catch(err => { setToast(err.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:60}}><Spinner s={30}/></div>;

  const totalScanned = targets.length;
  // Calculate average score
  const avgScore = totalScanned ? Math.round(targets.reduce((acc, t) => acc + (t.security_score || 0), 0) / totalScanned) : 0;
  // For the Pie Chart
  const pieData = [{v:avgScore}, {v:100-avgScore}];

  return (
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
        {label:'APIs Monitored',  val:totalScanned, delta:'Active', deltaGood:true,  color:'var(--p)',    icon:<IcGlobe s={16}/>,   prog:100},
        {label:'Avg Security',val:avgScore+'%',   delta:'Live',deltaGood:true,  color:'var(--green)',icon:<IcShield s={16}/>,  prog:avgScore},
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
            <span style={{fontSize:11,color:'var(--t3)'}}>status</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{width:`${c.prog}%`,background:c.color}}/></div>
        </div>
      ))}
    </div>

    {/* Charts row */}
    <div className="au2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <div className="card" style={{display:'flex',flexDirection:'column'}}>
        <SectionHeader title="Security Score Average" subtitle="Across all targets"/>
        <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
          <div style={{width:160,height:160,position:'relative'}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={56} outerRadius={72} dataKey="v" stroke="none" startAngle={90} endAngle={-270}>
                  <Cell fill="var(--green)" style={{filter:'drop-shadow(0 0 8px var(--green))'}}/>
                  <Cell fill="var(--surface3)"/>
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:30,fontWeight:800,fontFamily:'var(--display)',color:'var(--t1)'}}>{avgScore}<span style={{fontSize:16}}>%</span></span>
              <span style={{fontSize:11,color:'var(--green)',fontWeight:700}}>{avgScore > 80 ? 'Excellent' : 'Needs Work'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <SectionHeader title="Monitored Targets" action={<button className="btn-ghost" style={{fontSize:11,height:30,padding:'0 12px'}}>Refresh</button>}/>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {targets.map((r,i)=>(
            <div key={r.id || i} className="card-sm" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:11}}>
                <div style={{width:34,height:34,borderRadius:9,background:'var(--surface)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--t2)'}}>
                  <IcGlobe s={15}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--t1)'}}>{r.name || r.url}</div>
                  <div style={{fontSize:11,color:'var(--t3)',fontFamily:'var(--mono)',marginTop:1}}>{r.url}</div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                <Tag s={r.status === 'healthy' ? 'safe' : 'crit'}/>
                <span style={{fontSize:10,color:'var(--t3)',fontFamily:'var(--mono)'}}>Score: {r.security_score}%</span>
              </div>
            </div>
          ))}
          {targets.length === 0 && <div style={{fontSize:12, color:'var(--t3)'}}>No targets monitored yet.</div>}
        </div>
      </div>
    </div>
  </div>
  );
};
"""

content = view_dashboard_pattern.sub(new_view_dashboard, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("ViewDashboard replaced.")
