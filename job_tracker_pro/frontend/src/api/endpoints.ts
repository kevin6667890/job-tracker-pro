import client from "./client";
import type {
  AIAnalysisResult,
  AnalyticsSummary,
  Application,
  ApplicationInput,
  ApplicationStatus,
  FunnelStage,
  PDFParseResult,
  SourceStat,
  TimelinePoint,
} from "../types";

export async function fetchApplications(params?: { status?: string; search?: string }): Promise<Application[]> {
  const res = await client.get<Application[]>("/api/applications", { params });
  return res.data;
}

export async function fetchApplication(id: number): Promise<Application> {
  const res = await client.get<Application>(`/api/applications/${id}`);
  return res.data;
}

export async function createApplication(payload: ApplicationInput): Promise<Application> {
  const res = await client.post<Application>("/api/applications", payload);
  return res.data;
}

export async function updateApplication(id: number, payload: ApplicationInput): Promise<Application> {
  const res = await client.put<Application>(`/api/applications/${id}`, payload);
  return res.data;
}

export async function deleteApplication(id: number): Promise<void> {
  await client.delete(`/api/applications/${id}`);
}

export async function updateApplicationStatus(id: number, status: ApplicationStatus): Promise<Application> {
  const res = await client.patch<Application>(`/api/applications/${id}/status`, { status });
  return res.data;
}

export async function fetchSummary(): Promise<AnalyticsSummary> {
  const res = await client.get<AnalyticsSummary>("/api/analytics/summary");
  return res.data;
}

export async function fetchFunnel(): Promise<FunnelStage[]> {
  const res = await client.get<FunnelStage[]>("/api/analytics/funnel");
  return res.data;
}

export async function fetchTimeline(): Promise<TimelinePoint[]> {
  const res = await client.get<TimelinePoint[]>("/api/analytics/timeline");
  return res.data;
}

export async function fetchSources(): Promise<SourceStat[]> {
  const res = await client.get<SourceStat[]>("/api/analytics/sources");
  return res.data;
}

export async function analyzeApplication(applicationId: number, jobDescription: string): Promise<AIAnalysisResult> {
  const res = await client.post<AIAnalysisResult>("/api/ai/analyze", {
    application_id: applicationId,
    job_description: jobDescription,
  });
  return res.data;
}

export async function parseResume(file: File): Promise<PDFParseResult> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await client.post<PDFParseResult>("/api/pdf/parse", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
