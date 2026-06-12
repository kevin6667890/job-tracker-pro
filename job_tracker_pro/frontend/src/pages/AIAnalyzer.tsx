import { useState } from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { analyzeApplication } from "../api/endpoints";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import type { AIAnalysisResult } from "../types";

const HARDCODED_APPLICATION_ID = 1;

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function scoreRingColor(score: number): string {
  if (score >= 80) return "border-emerald-500";
  if (score >= 60) return "border-amber-500";
  return "border-red-500";
}

export default function AIAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const { showToast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      showToast("Paste a job description first.");
      return;
    }
    setLoading(true);
    try {
      const data = await analyzeApplication(HARDCODED_APPLICATION_ID, jobDescription);
      setResult(data);
    } catch (err) {
      showToast(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Resume Analyzer</h1>
        <p className="mt-1 text-sm text-gray-400">Paste a job description to see how well your resume matches.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-white">Job Description</h2>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={14}
            placeholder="Paste job description here..."
            className="mt-3 w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Analyze Match
          </button>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-white">Analysis Result</h2>

          {loading ? (
            <div className="flex h-72 flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
              <p className="text-sm">Analyzing your resume against the job description...</p>
            </div>
          ) : !result ? (
            <div className="flex h-72 flex-col items-center justify-center gap-2 text-center text-gray-500">
              <Sparkles className="h-8 w-8" />
              <p className="text-sm">Run an analysis to see your match score, strengths, and gaps.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 ${scoreRingColor(result.score)}`}
                >
                  <span className={`text-2xl font-bold ${scoreColor(result.score)}`}>{result.score}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Match Score</p>
                  <p className={`text-lg font-semibold ${scoreColor(result.score)}`}>
                    {result.score >= 80 ? "Strong Match" : result.score >= 60 ? "Decent Match" : "Needs Work"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Strengths
                </h3>
                <ul className="mt-2 space-y-1">
                  {result.strengths.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Gaps
                </h3>
                <ul className="mt-2 space-y-1">
                  {result.gaps.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
                  <Lightbulb className="h-4 w-4" />
                  Suggestion
                </h3>
                <p className="mt-2 text-sm text-gray-300">{result.suggestion}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-500">Analysis powered by DeepSeek API</p>
    </div>
  );
}
