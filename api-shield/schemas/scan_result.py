from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScanResultBase(BaseModel):
    status_code: Optional[int] = None
    response_time_ms: Optional[float] = None
    tls_expiry_date: Optional[datetime] = None
    uptime_status: Optional[str] = None

class ScanResultCreate(ScanResultBase):
    target_id: int

class ScanResultResponse(ScanResultBase):
    id: int
    target_id: int
    checked_at: datetime

    class Config:
        from_attributes = True
