from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Dict
from core.bola import detect_bola
from core.rbac import test_rbac
from core.load_tester import run_load_test
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.target import Target
from fastapi import HTTPException

router = APIRouter()

class BolaRequest(BaseModel):
    url: str
    auth_token: Optional[str] = None

class RbacRequest(BaseModel):
    url: str
    tokens: Dict[str, str]

class LoadTestRequest(BaseModel):
    url: str
    rps: int = 10
    duration_sec: int = 10

@router.post("/bola")
async def run_bola_detection(request: BolaRequest):
    findings = await detect_bola(request.url, request.auth_token)
    return {"status": "completed", "findings": findings}

@router.post("/rbac")
async def run_rbac_test(request: RbacRequest):
    findings = await test_rbac(request.url, request.tokens)
    return {"status": "completed", "findings": findings}

@router.post("/loadtest")
async def execute_load_test(request: LoadTestRequest, db: AsyncSession = Depends(get_db)):
    # Restrict to registered targets
    stmt = select(Target).where(Target.url == request.url)
    result = await db.execute(stmt)
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Load testing is restricted to registered target URLs only.")
        
    results = await run_load_test(request.url, request.rps, request.duration_sec)
    return {"status": "completed", "results": results}

