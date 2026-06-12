export type ApplicationStatus = "Applied" | "OA" | "Interview" | "Offer" | "Rejected";

export const STATUS_OPTIONS: ApplicationStatus[] = ["Applied", "OA", "Interview", "Offer", "Rejected"];

export const SOURCE_OPTIONS = ["LinkedIn", "campus", "referral", "cold"] as const;

export interface Application {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus;
  applied_date: string;
  deadline: string | null;
  location: string | null;
  salary_range: string | null;
  notes: string | null;
  resume_score: number | null;
  ai_analysis: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export type ApplicationInput = {
  company: string;
  role: string;
  status: ApplicationStatus;
  applied_date: string;
  deadline: string | null;
  location: string | null;
  salary_range: string | null;
  notes: string | null;
  resume_score: number | null;
  ai_analysis: string | null;
  source: string | null;
};

export interface AnalyticsSummary {
  total: number;
  by_status: Record<string, number>;
  response_rate: number;
  offer_rate: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface TimelinePoint {
  date: string;
  count: number;
}

export interface SourceStat {
  source: string;
  count: number;
  offer_count: number;
}

export interface AIAnalysisResult {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestion: string;
}

export interface PDFParseResult {
  email: string | null;
  phone: string | null;
  education: string | null;
  skills: string[];
  raw_text_preview: string;
}
