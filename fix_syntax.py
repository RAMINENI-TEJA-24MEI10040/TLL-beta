with open("src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# The BOLA/RBAC tester was defined as:
# const LoadTestModal = ({close,setToast}) => {
#   const [mode, setMode] = useState('bola');
# And later the real LoadTestModal was added.

# Replace the first LoadTestModal with SecurityToolsModal
content = content.replace("const LoadTestModal = ({close,setToast}) => {\n  const [mode, setMode] = useState('bola');", "const SecurityToolsModal = ({close,setToast}) => {\n  const [mode, setMode] = useState('bola');")

# In the modal rendering, we had:
# {modal==='loadtest'   &&<LoadTestModal   close={closeModal} setToast={showToast}/>}
# Wait, where was the BOLA/RBAC tester registered?
# Let's check where it's called. The user clicks "BOLA/RBAC Tester".
# Which is `modal==='security' &&<SecurityToolsModal close={closeModal} setToast={showToast}/>`?
# Let's see what is under modal render:
#       {modal==='add_target'&&<AddTargetModal close={closeModal} setToast={showToast}/>}
#       {modal==='scan'       &&<ScanModal       close={closeModal} setToast={showToast}/>}
#       {modal==='pdf'        &&<PDFModal        close={closeModal} setToast={showToast}/>}
#       {modal==='openapi'    &&<OpenAPIModal    close={closeModal} setToast={showToast}/>}
#       {modal==='loadtest'   &&<LoadTestModal   close={closeModal} setToast={showToast}/>}
#       {modal==='mockserver' &&<MockServerModal close={closeModal} setToast={showToast}/>}
# Wait, if there was no 'security' modal, how did the BOLA tester run?
# Ah! In `App.jsx`, I think the quick action grid called `openModal('loadtest')` to open the BOLA tester!
# So I need to:
# 1. Change the quick action grid to open `security` for BOLA/RBAC tester.
# 2. Add `{modal==='security'&&<SecurityToolsModal close={closeModal} setToast={showToast}/>}`
content = content.replace("openModal('loadtest')} style={{height:36}}><IcZap s={14}/>BOLA/RBAC Tester", "openModal('security')} style={{height:36}}><IcZap s={14}/>BOLA/RBAC Tester")
content = content.replace("{modal==='openapi'    &&<OpenAPIModal    close={closeModal} setToast={showToast}/>}", "{modal==='openapi'    &&<OpenAPIModal    close={closeModal} setToast={showToast}/>}\n      {modal==='security'   &&<SecurityToolsModal close={closeModal} setToast={showToast}/>}")

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed syntax error")
