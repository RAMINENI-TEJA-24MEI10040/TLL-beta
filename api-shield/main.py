from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1 import monitor, jwt, security

app = FastAPI(title="TrustLayer API Shield", description="Active Security Monitoring Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(monitor.router, prefix="/api/v1/monitor", tags=["monitor"])
app.include_router(jwt.router, prefix="/api/v1/jwt", tags=["jwt"])
app.include_router(security.router, prefix="/api/v1/security", tags=["security"])

@app.get("/")
async def root():
    return {"message": "TrustLayer API Shield is running"}
