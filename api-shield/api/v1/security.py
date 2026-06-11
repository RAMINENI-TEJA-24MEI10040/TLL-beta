from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Dict
from core.bola import detect_bola
from core.rbac import test_rbac

router = APIRouter()

class BolaRequest(BaseModel):
    url: str
    auth_token: Optional[str] = None

class RbacRequest(BaseModel):
    url: str
    tokens: Dict[str, str]

@router.post("/bola")
async def run_bola_detection(request: BolaRequest):
    findings = await detect_bola(request.url, request.auth_token)
    return {"status": "completed", "findings": findings}

@router.post("/rbac")
async def run_rbac_test(request: RbacRequest):
    findings = await test_rbac(request.url, request.tokens)
    return {"status": "completed", "findings": findings}
