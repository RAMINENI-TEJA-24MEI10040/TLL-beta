from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship
from database import Base

class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    target_id = Column(Integer, ForeignKey("targets.id"))
    status_code = Column(Integer, nullable=True)
    response_time_ms = Column(Float, nullable=True)
    tls_expiry_date = Column(DateTime(timezone=True), nullable=True)
    uptime_status = Column(String)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())

    target = relationship("Target", back_populates="scan_results")
