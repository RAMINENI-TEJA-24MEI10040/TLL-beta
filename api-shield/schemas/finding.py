from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.finding import Severity

class FindingBase(BaseModel):
    severity: Severity
    title: str
    description: Optional[str] = None
    remediation: Optional[str] = None
    endpoint: Optional[str] = None

class FindingCreate(FindingBase):
    target_id: Optional[int] = None

class FindingResponse(FindingBase):
    id: int
    target_id: Optional[int]
    detected_at: datetime
    resolved: bool

    class Config:
        from_attributes = True
