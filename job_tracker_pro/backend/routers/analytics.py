from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import Application, StatusEnum

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total = db.query(Application).count()

    by_status = {status.value: 0 for status in StatusEnum}
    rows = db.query(Application.status, func.count(Application.id)).group_by(Application.status).all()
    for status, count in rows:
        key = status.value if isinstance(status, StatusEnum) else status
        by_status[key] = count

    responded = sum(by_status[s.value] for s in StatusEnum if s != StatusEnum.APPLIED)
    offers = by_status[StatusEnum.OFFER.value]

    response_rate = round(responded / total, 4) if total else 0.0
    offer_rate = round(offers / total, 4) if total else 0.0

    return {
        "total": total,
        "by_status": by_status,
        "response_rate": response_rate,
        "offer_rate": offer_rate,
    }


@router.get("/funnel")
def get_funnel(db: Session = Depends(get_db)):
    stages = [StatusEnum.APPLIED, StatusEnum.OA, StatusEnum.INTERVIEW, StatusEnum.OFFER]
    return [
        {"stage": stage.value, "count": db.query(Application).filter(Application.status == stage).count()}
        for stage in stages
    ]


@router.get("/timeline")
def get_timeline(db: Session = Depends(get_db)):
    today = date.today()
    start = today - timedelta(days=59)

    rows = (
        db.query(Application.applied_date, func.count(Application.id))
        .filter(Application.applied_date >= start)
        .filter(Application.applied_date <= today)
        .group_by(Application.applied_date)
        .all()
    )
    counts = {applied_date.isoformat(): count for applied_date, count in rows}

    timeline = []
    for offset in range(60):
        day = (start + timedelta(days=offset)).isoformat()
        timeline.append({"date": day, "count": counts.get(day, 0)})
    return timeline


@router.get("/sources")
def get_sources(db: Session = Depends(get_db)):
    sources = [row[0] for row in db.query(Application.source).distinct().all() if row[0]]

    result = []
    for source in sources:
        count = db.query(Application).filter(Application.source == source).count()
        offer_count = (
            db.query(Application)
            .filter(Application.source == source, Application.status == StatusEnum.OFFER)
            .count()
        )
        result.append({"source": source, "count": count, "offer_count": offer_count})
    return result
