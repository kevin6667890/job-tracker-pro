import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Application
from schemas import AIAnalyzeRequest, AIAnalyzeResponse
from services import ai_service

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/analyze", response_model=AIAnalyzeResponse)
def analyze_application(payload: AIAnalyzeRequest, db: Session = Depends(get_db)):
    application = db.get(Application, payload.application_id)
    if application is None:
        raise HTTPException(status_code=404, detail=f"Application {payload.application_id} not found")

    resume_text = application.notes or ""
    result = ai_service.analyze(resume_text, payload.job_description)

    application.resume_score = result.get("score")
    application.ai_analysis = json.dumps(result)
    db.commit()

    return result
