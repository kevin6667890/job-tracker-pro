import io
import re

import pdfplumber
from fastapi import APIRouter, File, HTTPException, UploadFile

from schemas import PDFParseResponse

router = APIRouter(prefix="/api/pdf", tags=["pdf"])

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PHONE_RE = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}")
EDUCATION_RE = re.compile(
    r"([A-Z][A-Za-z&.,'-]*(?:\s+[A-Za-z&.,'-]+)*\s+(?:University|Institute of Technology|College))"
)

SKILL_KEYWORDS = [
    "Python", "Java", "C++", "C", "JavaScript", "TypeScript", "SQL", "React",
    "Node.js", "FastAPI", "Django", "Flask", "AWS", "Azure", "GCP", "Docker",
    "Kubernetes", "Machine Learning", "Deep Learning", "Data Analysis",
    "Pandas", "NumPy", "TensorFlow", "PyTorch", "Git", "Linux", "REST API",
    "GraphQL", "MongoDB", "PostgreSQL", "MySQL", "Excel", "Tableau", "Spark",
]


@router.post("/parse", response_model=PDFParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    contents = await file.read()

    text = ""
    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        for page in pdf.pages:
            text += (page.extract_text() or "") + "\n"

    email_match = EMAIL_RE.search(text)
    phone_match = PHONE_RE.search(text)
    education_match = EDUCATION_RE.search(text)

    found_skills = sorted(
        {skill for skill in SKILL_KEYWORDS if re.search(rf"\b{re.escape(skill)}\b", text, re.IGNORECASE)}
    )

    return PDFParseResponse(
        email=email_match.group(0) if email_match else None,
        phone=phone_match.group(0) if phone_match else None,
        education=education_match.group(0) if education_match else None,
        skills=found_skills,
        raw_text_preview=text[:500].strip(),
    )
