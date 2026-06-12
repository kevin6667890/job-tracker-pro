from datetime import date, timedelta

from apscheduler.schedulers.background import BackgroundScheduler

from database import SessionLocal
from models import Application, StatusEnum
from services.notifier import send_wechat


def check_deadlines():
    db = SessionLocal()
    try:
        today = date.today()
        soon = today + timedelta(days=3)
        upcoming = (
            db.query(Application)
            .filter(Application.deadline.isnot(None))
            .filter(Application.deadline >= today)
            .filter(Application.deadline <= soon)
            .filter(Application.status.notin_([StatusEnum.OFFER, StatusEnum.REJECTED]))
            .all()
        )
        for application in upcoming:
            send_wechat(
                title=f"Deadline approaching: {application.company}",
                content=(
                    f"Your application for {application.role} at {application.company} "
                    f"has a deadline on {application.deadline.isoformat()}."
                ),
            )
    finally:
        db.close()


def start_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_deadlines, "cron", hour=9)
    scheduler.start()
    return scheduler
