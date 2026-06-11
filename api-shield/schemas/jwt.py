from pydantic import BaseModel
from typing import List, Optional

class JWTAnalyzeRequest(BaseModel):
    token: str

class JWTAnalyzeResponse(BaseModel):
    risk_score: int
    findings: List[dict]
