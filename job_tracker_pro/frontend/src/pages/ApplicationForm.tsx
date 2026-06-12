import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { createApplication, fetchApplication, parseResume, updateApplication } from "../api/endpoints";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { SOURCE_OPTIONS, STATUS_OPTIONS, type ApplicationInput, type ApplicationStatus, type PDFParseResult } from "../types";
import Spinner from "../components/Spinner";

const todayISO = () => new Date().toISOString().slice(0, 10);

const emptyForm: ApplicationInput = {
  company: "",
  role: "",
  status: "Applied",
  applied_date: todayISO(),
  deadline: null,
  location: null,
  salary_range: null,
  notes: null,
  resume_score: null,
  ai_analysis: null,
  source: null,
};

const inputClass =
  "w-full rounded-md border bg-gray-950 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500";

export default function ApplicationForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState<ApplicationInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedInfo, setParsedInfo] = useState<PDFParseResult | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchApplication(Number(id))
      .then((app) => {
        setForm({
          company: app.company,
          role: app.role,
          status: app.status,
          applied_date: app.applied_date,
          deadline: app.deadline,
          location: app.location,
          salary_range: app.salary_range,
          notes: app.notes,
          resume_score: app.resume_score,
          ai_analysis: app.ai_analysis,
          source: app.source,
        });
      })
      .catch((err: unknown) => showToast(getErrorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const setField = <K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!form.company.trim()) newErrors.company = true;
    if (!form.role.trim()) newErrors.role = true;
    if (!form.applied_date) newErrors.applied_date = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateApplication(Number(id), form);
        showToast("Application updated", "success");
      } else {
        await createApplication(form);
        showToast("Application created", "success");
      }
      navigate("/applications");
    } catch (err) {
      showToast(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleParse = async () => {
    if (!file) {
      showToast("Choose a PDF file first.");
      return;
    }
    setParsing(true);
    try {
      const result = await parseResume(file);
      setParsedInfo(result);
    } catch (err) {
      showToast(getErrorMessage(err));
    } finally {
      setParsing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">{isEdit ? "Edit Application" : "Add Application"}</h1>
        <p className="mt-1 text-sm text-gray-400">
          {isEdit ? "Update the details of this application." : "Track a new job application."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Company *</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setField("company", e.target.value)}
              className={`${inputClass} ${errors.company ? "border-red-500" : "border-gray-700"}`}
              placeholder="e.g. Google"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Role *</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setField("role", e.target.value)}
              className={`${inputClass} ${errors.role ? "border-red-500" : "border-gray-700"}`}
              placeholder="e.g. Software Engineer Intern"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Status</label>
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value as ApplicationStatus)}
              className={`${inputClass} border-gray-700`}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Applied Date *</label>
            <input
              type="date"
              value={form.applied_date}
              onChange={(e) => setField("applied_date", e.target.value)}
              className={`${inputClass} ${errors.applied_date ? "border-red-500" : "border-gray-700"}`}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Deadline</label>
            <input
              type="date"
              value={form.deadline ?? ""}
              onChange={(e) => setField("deadline", e.target.value || null)}
              className={`${inputClass} border-gray-700`}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Location</label>
            <input
              type="text"
              value={form.location ?? ""}
              onChange={(e) => setField("location", e.target.value || null)}
              className={`${inputClass} border-gray-700`}
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Salary Range</label>
            <input
              type="text"
              value={form.salary_range ?? ""}
              onChange={(e) => setField("salary_range", e.target.value || null)}
              className={`${inputClass} border-gray-700`}
              placeholder="e.g. $9,000/mo"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Source</label>
            <select
              value={form.source ?? ""}
              onChange={(e) => setField("source", e.target.value || null)}
              className={`${inputClass} border-gray-700`}
            >
              <option value="">— Select —</option>
              {SOURCE_OPTIONS.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Notes</label>
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => setField("notes", e.target.value || null)}
            rows={4}
            className={`${inputClass} border-gray-700`}
            placeholder="Any notes about this application..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Application"}
          </button>
          <Link
            to="/applications"
            className="rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-white">Resume PDF</h2>
        <p className="mt-1 text-sm text-gray-400">
          Upload your resume to extract contact info, education, and skills.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-700 px-3 py-2 text-sm text-gray-400 hover:border-gray-600">
            <UploadCloud className="h-4 w-4 shrink-0" />
            <span className="truncate">{file ? file.name : "Choose a PDF file..."}</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="button"
            onClick={handleParse}
            disabled={parsing}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-indigo-500 px-4 py-2 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/10 disabled:opacity-60"
          >
            {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Parse my resume
          </button>
        </div>

        {parsedInfo && (
          <div className="mt-4 space-y-3 rounded-lg border border-gray-700 bg-gray-950 p-4">
            <h3 className="text-sm font-semibold text-white">Parsed Info</h3>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-200">{parsedInfo.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="text-gray-200">{parsedInfo.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Education</dt>
                <dd className="text-gray-200">{parsedInfo.education ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Skills</dt>
                <dd className="mt-1 text-gray-200">
                  {parsedInfo.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {parsedInfo.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-gray-500">Raw Text Preview</dt>
                <dd className="mt-1 whitespace-pre-wrap rounded-md bg-gray-900 p-3 text-xs text-gray-400">
                  {parsedInfo.raw_text_preview}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
