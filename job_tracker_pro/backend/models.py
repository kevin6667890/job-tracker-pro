import enum
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Enum, Float, Integer, String, Text

from database import Base


class StatusEnum(str, enum.Enum):
    APPLIED = "Applied"
    OA = "OA"
    INTERVIEW = "Interview"
    OFFER = "Offer"
    REJECTED = "Rejected"


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False, index=True)
    role = Column(String, nullable=False)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.APPLIED, index=True)
    applied_date = Column(Date, nullable=False)
    deadline = Column(Date, nullable=True)
    location = Column(String, nullable=True)
    salary_range = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    resume_score = Column(Float, nullable=True)
    ai_analysis = Column(Text, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
