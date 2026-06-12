"""Populate the database with realistic mock applications."""
from datetime import date, timedelta

from database import Base, SessionLocal, engine
from models import Application, StatusEnum

# days_ago: when the application was submitted (relative to today)
# deadline_in: days from today until the next deadline (None if no deadline)
APPLICATIONS = [
    dict(
        company="Google", role="Software Engineer Intern", location="Mountain View, CA",
        salary_range="$9,000/mo", source="LinkedIn", status=StatusEnum.INTERVIEW,
        days_ago=35, deadline_in=2, resume_score=88,
        ai_analysis="Strong alignment with backend infrastructure roles. Emphasize distributed systems coursework.",
        notes="Recruiter screen passed; onsite interview loop scheduled.",
    ),
    dict(
        company="Meta", role="Data Scientist Intern", location="Menlo Park, CA",
        salary_range="$8,500/mo", source="referral", status=StatusEnum.OA,
        days_ago=28, deadline_in=5, resume_score=81,
        ai_analysis="Good statistics background. Brush up on A/B testing and SQL window functions before the OA.",
        notes="Online assessment (SQL + Python) due soon.",
    ),
    dict(
        company="Stripe", role="Backend Engineer Intern", location="San Francisco, CA",
        salary_range="$9,500/mo", source="LinkedIn", status=StatusEnum.APPLIED,
        days_ago=10, deadline_in=None, resume_score=None, ai_analysis=None,
        notes="Application submitted, awaiting recruiter response.",
    ),
    dict(
        company="Bytedance", role="Software Engineer", location="San Jose, CA",
        salary_range="$130,000/yr", source="campus", status=StatusEnum.REJECTED,
        days_ago=40, deadline_in=None, resume_score=65,
        ai_analysis="Resume lacked large-scale systems examples expected for the role.",
        notes="Rejected after the first technical interview round.",
    ),
    dict(
        company="Shopify", role="Full Stack Developer Intern", location="Remote",
        salary_range="$7,500/mo", source="cold", status=StatusEnum.APPLIED,
        days_ago=5, deadline_in=None, resume_score=None, ai_analysis=None,
        notes="Cold applied through the company careers page.",
    ),
    dict(
        company="Jane Street", role="Quantitative Trading Intern", location="New York, NY",
        salary_range="$10,500/mo", source="referral", status=StatusEnum.INTERVIEW,
        days_ago=25, deadline_in=1, resume_score=90,
        ai_analysis="Excellent quantitative background. Practice mental math and trading puzzle drills before the final round.",
        notes="Final round interview (trading puzzles) scheduled.",
    ),
    dict(
        company="Amazon", role="SDE Intern", location="Seattle, WA",
        salary_range="$8,000/mo", source="LinkedIn", status=StatusEnum.OA,
        days_ago=20, deadline_in=None, resume_score=75,
        ai_analysis="Solid coding fundamentals. Review Leadership Principles for the behavioral portion of the OA.",
        notes="OA (2 coding questions + work styles assessment) in progress.",
    ),
    dict(
        company="Microsoft", role="Software Engineer Intern", location="Redmond, WA",
        salary_range="$8,200/mo", source="campus", status=StatusEnum.OFFER,
        days_ago=42, deadline_in=None, resume_score=92,
        ai_analysis="Excellent fit for the cloud infrastructure team based on past internship experience.",
        notes="Received offer after 4 rounds of interviews.",
    ),
    dict(
        company="Apple", role="Software Engineer", location="Cupertino, CA",
        salary_range="$145,000/yr", source="LinkedIn", status=StatusEnum.APPLIED,
        days_ago=3, deadline_in=None, resume_score=None, ai_analysis=None,
        notes="Application submitted, awaiting response.",
    ),
    dict(
        company="Netflix", role="Data Engineer Intern", location="Los Gatos, CA",
        salary_range="$9,000/mo", source="referral", status=StatusEnum.REJECTED,
        days_ago=38, deadline_in=None, resume_score=70,
        ai_analysis="Pipeline experience was relevant but lacked depth in streaming systems (Kafka/Flink).",
        notes="Rejected after the recruiter screen.",
    ),
    dict(
        company="Airbnb", role="Software Engineer Intern", location="San Francisco, CA",
        salary_range="$8,800/mo", source="LinkedIn", status=StatusEnum.INTERVIEW,
        days_ago=18, deadline_in=None, resume_score=84,
        ai_analysis="Good full-stack project experience. Prepare to discuss trade-offs in your portfolio projects.",
        notes="Phone interview completed, awaiting next steps.",
    ),
    dict(
        company="Uber", role="Backend Engineer", location="San Francisco, CA",
        salary_range="$135,000/yr", source="cold", status=StatusEnum.APPLIED,
        days_ago=8, deadline_in=None, resume_score=None, ai_analysis=None,
        notes="Applied directly through the Uber careers site.",
    ),
    dict(
        company="Goldman Sachs", role="Technology Analyst", location="New York, NY",
        salary_range="$100,000/yr", source="campus", status=StatusEnum.OA,
        days_ago=33, deadline_in=None, resume_score=78,
        ai_analysis="Strong fit for technology division. Review OOP design and SQL before the assessment.",
        notes="HireVue + coding assessment pending.",
    ),
    dict(
        company="Two Sigma", role="Quant Researcher Intern", location="New York, NY",
        salary_range="$11,000/mo", source="referral", status=StatusEnum.OFFER,
        days_ago=44, deadline_in=None, resume_score=95,
        ai_analysis="Outstanding match for quant research given research publications and competition results.",
        notes="Offer received, deciding by end of month.",
    ),
    dict(
        company="Palantir", role="Forward Deployed Engineer", location="Denver, CO",
        salary_range="$125,000/yr", source="LinkedIn", status=StatusEnum.APPLIED,
        days_ago=12, deadline_in=None, resume_score=None, ai_analysis=None,
        notes="Applied after meeting a recruiter at a career fair.",
    ),
    dict(
        company="Snowflake", role="Software Engineer Intern", location="San Mateo, CA",
        salary_range="$8,600/mo", source="campus", status=StatusEnum.REJECTED,
        days_ago=36, deadline_in=None, resume_score=68,
        ai_analysis="Resume was a reasonable match, but the team had already filled the open headcount.",
        notes="Rejected, role filled internally.",
    ),
    dict(
        company="Databricks", role="Software Engineer Intern", location="San Francisco, CA",
        salary_range="$9,200/mo", source="LinkedIn", status=StatusEnum.OA,
        days_ago=15, deadline_in=4, resume_score=80,
        ai_analysis="Good data engineering exposure. Review Spark internals before the take-home.",
        notes="Take-home assignment due this week.",
    ),
    dict(
        company="Salesforce", role="Software Engineer", location="San Francisco, CA",
        salary_range="$128,000/yr", source="cold", status=StatusEnum.APPLIED,
        days_ago=6, deadline_in=None, resume_score=None, ai_analysis=None,
        notes="Applied via the company website.",
    ),
    dict(
        company="LinkedIn", role="Software Engineer Intern", location="Sunnyvale, CA",
        salary_range="$8,400/mo", source="LinkedIn", status=StatusEnum.INTERVIEW,
        days_ago=22, deadline_in=None, resume_score=83,
        ai_analysis="Relevant social platform experience. Prepare system design basics for team-match interviews.",
        notes="Team-match interviews ongoing.",
    ),
    dict(
        company="Adobe", role="Software Engineer Intern", location="San Jose, CA",
        salary_range="$8,300/mo", source="campus", status=StatusEnum.APPLIED,
        days_ago=14, deadline_in=None, resume_score=None, ai_analysis=None,
        notes="Applied through the campus recruiting portal.",
    ),
]


def run_seed(db):
    today = date.today()
    for entry in APPLICATIONS:
        applied_date = today - timedelta(days=entry["days_ago"])
        deadline = today + timedelta(days=entry["deadline_in"]) if entry["deadline_in"] is not None else None
        db.add(
            Application(
                company=entry["company"],
                role=entry["role"],
                status=entry["status"],
                applied_date=applied_date,
                deadline=deadline,
                location=entry["location"],
                salary_range=entry["salary_range"],
                notes=entry["notes"],
                resume_score=entry["resume_score"],
                ai_analysis=entry["ai_analysis"],
                source=entry["source"],
            )
        )
    db.commit()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Application).count() == 0:
            run_seed(db)
            print(f"Seeded {len(APPLICATIONS)} applications.")
        else:
            print("Database already contains applications; skipping seed.")
    finally:
        db.close()
