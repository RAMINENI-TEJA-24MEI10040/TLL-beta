from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.target import MonitorInterval

class TargetBase(BaseModel):
    name: str
    url: str
    auth_token: Optional[str] = None
    monitor_interval: MonitorInterval = MonitorInterval.MIN_15

class TargetCreate(TargetBase):
    pass

class TargetResponse(TargetBase):
    id: int
    security_score: float
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
