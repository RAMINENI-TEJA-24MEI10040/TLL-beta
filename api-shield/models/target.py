from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, func
from sqlalchemy.orm import relationship
import enum
from database import Base

class MonitorInterval(str, enum.Enum):
    MIN_5 = "5m"
    MIN_15 = "15m"
    MIN_30 = "30m"
    HOUR_1 = "1h"

class Target(Base):
    __tablename__ = "targets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String, nullable=False)
    auth_token = Column(String, nullable=True)
    monitor_interval = Column(Enum(MonitorInterval), default=MonitorInterval.MIN_15)
    security_score = Column(Float, default=100.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    scan_results = relationship("ScanResult", back_populates="target", cascade="all, delete")
    findings = relationship("Finding", back_populates="target", cascade="all, delete")
