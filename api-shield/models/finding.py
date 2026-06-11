from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Enum, func
from sqlalchemy.orm import relationship
import enum
from database import Base

class Severity(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    target_id = Column(Integer, ForeignKey("targets.id"), nullable=True)
    severity = Column(Enum(Severity), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    remediation = Column(String, nullable=True)
    endpoint = Column(String, nullable=True)
    detected_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved = Column(Boolean, default=False)

    target = relationship("Target", back_populates="findings")
