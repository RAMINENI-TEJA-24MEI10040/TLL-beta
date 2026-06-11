import re

file_path = r"c:\Users\Laptop\tlll\TLL-beta\src\App.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace LoadTestModal with SecurityToolsModal (BOLA/RBAC)
loadtest_pattern = re.compile(r"const LoadTestModal = \(\{close,setToast\}\) => \{[\s\S]*?^\};\n", re.MULTILINE)

new_tools_modal = """const LoadTestModal = ({close,setToast}) => {
  const [mode, setMode] = useState('bola');
  const [url, setUrl] = useState('http://localhost:3000/api/users/123');
  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runTest = async () => {
    setLoading(true); setResults(null);
    try {
      if (mode === 'bola') {
        const data = await apiClient.runBolaCheck(url, token1);
        setResults(data);
        setToast('BOLA Check Complete');
      } else {
        const data = await apiClient.runRbacCheck(url, [token1, token2]);
        setResults(data);
        setToast('RBAC Check Complete');
      }
    } catch(err) {
      setToast('Test Failed: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:600}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>Advanced Security Tests</div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          <div style={{display:'flex',gap:10,marginBottom:20}}>
            <button className={mode==='bola'?'btn-primary':'btn-ghost'} onClick={()=>setMode('bola')}>BOLA Tester</button>
            <button className={mode==='rbac'?'btn-primary':'btn-ghost'} onClick={()=>setMode('rbac')}>RBAC Token Swapper</button>
          </div>
          
          <div style={{marginBottom:15}}>
            <div className="sec-label">Target URL</div>
            <input className="login-input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://api.example.com/users/123" />
          </div>

          <div style={{marginBottom:15}}>
            <div className="sec-label">Auth Token {mode==='rbac'?'1 (Admin)':''}</div>
            <input className="login-input" value={token1} onChange={e=>setToken1(e.target.value)} placeholder="Bearer eyJhbGci..." />
          </div>

          {mode === 'rbac' && (
            <div style={{marginBottom:20}}>
              <div className="sec-label">Auth Token 2 (User)</div>
              <input className="login-input" value={token2} onChange={e=>setToken2(e.target.value)} placeholder="Bearer eyJhbGci..." />
            </div>
          )}

          {loading && <div style={{textAlign:'center', padding:20, color:'var(--p)'}}><Spinner s={24}/> Running tests...</div>}

          {results && (
            <div style={{background:'var(--surface2)', padding:16, borderRadius:12, marginTop:20}}>
              <div style={{fontSize:14, fontWeight:700, marginBottom:10}}>Test Results:</div>
              {results.findings?.map((f,i) => (
                 <div key={i} style={{marginBottom:10, paddingBottom:10, borderBottom:'1px solid var(--border)'}}>
                   <Tag s={f.severity==='CRITICAL'?'crit':'high'}/> <span style={{fontWeight:600}}>{f.title}</span>
                   <div style={{fontSize:12, marginTop:4, color:'var(--t2)'}}>{f.description}</div>
                 </div>
              ))}
              {!results.findings?.length && <div style={{color:'var(--green)', fontWeight:600}}>No vulnerabilities found!</div>}
            </div>
          )}

          <div style={{display:'flex',gap:12,marginTop:24}}>
            <button className="btn-primary" onClick={runTest} style={{flex:1,height:44}}>Run Test</button>
          </div>
        </div>
      </div>
    </div>
  );
};
"""
content = loadtest_pattern.sub(new_tools_modal, content)


# Replace MockServerModal with JWTAnalyzerModal
mockserver_pattern = re.compile(r"const MockServerModal = \(\{close,setToast\}\) => \{[\s\S]*?^\};\n", re.MULTILINE)

new_jwt_modal = """const MockServerModal = ({close,setToast}) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runTest = async () => {
    if (!token) return;
    setLoading(true); setResults(null);
    try {
      const data = await apiClient.analyzeJwt(token);
      setResults(data);
      setToast('JWT Analysis Complete');
    } catch(err) {
      setToast('Analysis Failed: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&close()}>
      <div className="modal" style={{maxWidth:600}}>
        <div style={{padding:'22px 28px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--display)'}}>JWT Security Analyzer</div>
          <button className="btn-icon" onClick={close}><IcX s={15}/></button>
        </div>
        <div style={{padding:28}}>
          
          <div style={{marginBottom:15}}>
            <div className="sec-label">Paste JWT Token</div>
            <textarea className="login-input" value={token} onChange={e=>setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." style={{height:100, resize:'vertical'}} />
          </div>

          {loading && <div style={{textAlign:'center', padding:20, color:'var(--p)'}}><Spinner s={24}/> Analyzing claims & signature...</div>}

          {results && (
            <div style={{background:'var(--surface2)', padding:16, borderRadius:12, marginTop:20}}>
              <div style={{fontSize:14, fontWeight:700, marginBottom:10}}>Analysis Results — Risk Score: {results.risk_score}/100</div>
              {results.findings?.map((f,i) => (
                 <div key={i} style={{marginBottom:10, paddingBottom:10, borderBottom:'1px solid var(--border)'}}>
                   <Tag s={f.severity==='CRITICAL'?'crit':f.severity==='HIGH'?'high':'med'}/> <span style={{fontWeight:600}}>{f.title}</span>
                   <div style={{fontSize:12, marginTop:4, color:'var(--t2)'}}>{f.description}</div>
                   <div style={{fontSize:11, marginTop:4, color:'var(--p)'}}>Remediation: {f.remediation}</div>
                 </div>
              ))}
              {!results.findings?.length && <div style={{color:'var(--green)', fontWeight:600}}>Token appears secure!</div>}
            </div>
          )}

          <div style={{display:'flex',gap:12,marginTop:24}}>
            <button className="btn-primary" onClick={runTest} style={{flex:1,height:44}}>Analyze Token</button>
          </div>
        </div>
      </div>
    </div>
  );
};
"""
content = mockserver_pattern.sub(new_jwt_modal, content)

# Change the quick action buttons to point to our new tools instead of LoadTest/MockServer text
content = content.replace("label:'Run Load Test'", "label:'BOLA/RBAC Tester'")
content = content.replace("desc:'100 or 1000 virtual users'", "desc:'Run advanced injection attacks'")

content = content.replace("label:'Mock Server'", "label:'JWT Analyzer'")
content = content.replace("desc:'Generate fake APIs'", "desc:'Detect algorithm confusion'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("LoadTestModal and MockServerModal replaced.")
