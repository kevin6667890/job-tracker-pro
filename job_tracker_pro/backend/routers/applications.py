from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from models import Application, StatusEnum
from schemas import ApplicationCreate, ApplicationOut, ApplicationUpdate, StatusUpdate

router = APIRouter(prefix="/api/applications", tags=["applications"])


def _get_application_or_404(db: Session, application_id: int) -> Application:
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail=f"Application {application_id} not found")
    return application


@router.get("", response_model=list[ApplicationOut])
def list_applications(
    status: Optional[StatusEnum] = None,
    search: Optional[str] = Query(default=None, description="Search company or role"),
    db: Session = Depends(get_db),
):
    query = db.query(Application)
    if status is not None:
        query = query.filter(Application.status == status)
    if search:
        like = f"%{search}%"
        query = query.filter(or_(Application.company.ilike(like), Application.role.ilike(like)))
    return query.order_by(Application.applied_date.desc()).all()


@router.post("", response_model=ApplicationOut, status_code=201)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    application = Application(**payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(application_id: int, db: Session = Depends(get_db)):
    return _get_application_or_404(db, application_id)


@router.put("/{application_id}", response_model=ApplicationOut)
def update_application(application_id: int, payload: ApplicationUpdate, db: Session = Depends(get_db)):
    application = _get_application_or_404(db, application_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(application, field, value)
    application.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(application)
    return application


@router.delete("/{application_id}", status_code=204)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    application = _get_application_or_404(db, application_id)
    db.delete(application)
    db.commit()
    return None


@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(application_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    application = _get_application_or_404(db, application_id)
    application.status = payload.status
    application.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(application)
    return application
