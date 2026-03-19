import { useState } from "react";
import { AttackReport } from "../types/jwt";

interface SampleToken {
  label: string;
  token: string;
  description: string;
}

export function useJwtAnalysis() {
  const [report, setReport] = useState<AttackReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [samples, setSamples] = useState<SampleToken[]>([]);

  const analyze = async (token: string, wordlistSize: "small" | "medium" | "large" = "medium") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, wordlistSize }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Analysis failed");
      }
      setReport(data.report);
      return data.report as AttackReport;
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : "Unexpected error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadSamples = async () => {
    try {
      const response = await fetch("/api/sample-tokens");
      const data = await response.json();
      setSamples(data.tokens || []);
    } catch {
      setSamples([]);
    }
  };

  return { report, loading, error, samples, analyze, loadSamples };
}
