import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./context/ToastContext";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ApplicationForm from "./pages/ApplicationForm";
import Analytics from "./pages/Analytics";
import AIAnalyzer from "./pages/AIAnalyzer";

export default function App() {
  return (
    <ToastProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/add" element={<ApplicationForm />} />
          <Route path="/edit/:id" element={<ApplicationForm />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-analyze" element={<AIAnalyzer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </ToastProvider>
  );
}
