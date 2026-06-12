# Job Tracker Pro

A full-stack job application tracking system with AI-powered resume analysis.

## Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts
**Backend**: Python 3.11, FastAPI, SQLAlchemy, SQLite
**AI**: DeepSeek API (resume × JD match scoring)
**Notifications**: Server酱 WeChat push (deadline reminders)
**Deployment**: Railway (backend) + Vercel (frontend)

## Features

- Track applications across 5 pipeline stages (Applied, OA, Interview, Offer, Rejected)
- Upload resume PDF → auto-extract education, skills, contact info
- AI analysis: match score, strengths, skill gaps, improvement suggestions
- Visual analytics: funnel chart, timeline, source breakdown, quick stats
- Automated WeChat alerts 3 days before application deadlines

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate      # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at `http://localhost:8000` (docs at `/docs`). On first run, the SQLite
database is created and seeded automatically with sample applications.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Configuration

Copy `backend/.env.example` to `backend/.env` and fill in your keys:

```bash
cp backend/.env.example backend/.env
```

API keys are optional — the app runs fully with mock data (a placeholder AI analysis
result and no-op WeChat notifications) when keys are not configured.

| Variable | Purpose |
| --- | --- |
| `DEEPSEEK_API_KEY` | Enables real AI resume × job description match scoring |
| `SERVERCHAN_KEY` | Enables WeChat push notifications for upcoming deadlines |

To point the frontend at a deployed backend, set `VITE_API_URL` (see `frontend/.env.example`).

## Deployment

- **Backend**: deploy `backend/` to Railway using the included `railway.toml`.
- **Frontend**: deploy `frontend/` to Vercel using the included `vercel.json`, and set
  the `VITE_API_URL` environment variable to your Railway backend URL.
