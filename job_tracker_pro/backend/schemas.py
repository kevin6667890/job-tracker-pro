from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from models import StatusEnum


class ApplicationBase(BaseModel):
    company: str
    role: str
    status: StatusEnum = StatusEnum.APPLIED
    applied_date: date
    deadline: Optional[date] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    notes: Optional[str] = None
    resume_score: Optional[float] = None
    ai_analysis: Optional[str] = None
    source: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[StatusEnum] = None
    applied_date: Optional[date] = None
    deadline: Optional[date] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    notes: Optional[str] = None
    resume_score: Optional[float] = None
    ai_analysis: Optional[str] = None
    source: Optional[str] = None


class StatusUpdate(BaseModel):
    status: StatusEnum


class ApplicationOut(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIAnalyzeRequest(BaseModel):
    application_id: int
    job_description: str


class AIAnalyzeResponse(BaseModel):
    score: float
    strengths: list[str]
    gaps: list[str]
    suggestion: str


class PDFParseResponse(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    education: Optional[str] = None
    skills: list[str] = []
    raw_text_preview: str
