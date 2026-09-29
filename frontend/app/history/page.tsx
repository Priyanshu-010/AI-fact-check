"use client";

import { useEffect, useState } from "react";

type Source = {
  id: number;
  title: string | null;
  url: string;
  snippet: string | null;
};

type FactCheck = {
  id: number;
  claim: string;
  verdict: string | null;
  explanation: string | null;
  created_at: string;
  sources: Source[];
};

export default function HistoryPage() {
  const [factChecks, setFactChecks] = useState<FactCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please log in first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/fact-checks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load history.");
        }

        const data: FactCheck[] = await response.json();

        setFactChecks(data);
      } catch (err) {
        setError("Could not load your fact-check history.");
        console.log(err)
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p>Loading history...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">
          Fact Check History
        </h1>

        {error && (
          <p className="mt-6 text-red-600">
            {error}
          </p>
        )}

        {!error && factChecks.length === 0 && (
          <p className="mt-6 text-gray-600">
            You have not checked any claims yet.
          </p>
        )}

        <div className="mt-8 space-y-6">
          {factChecks.map((factCheck) => (
            <div
              key={factCheck.id}
              className="rounded-2xl bg-white p-6 shadow-md"
            >
              <p className="text-lg font-semibold">
                {factCheck.claim}
              </p>

              <p className="mt-3">
                <strong>Verdict:</strong>{" "}
                {factCheck.verdict}
              </p>

              <p className="mt-3 text-gray-700">
                {factCheck.explanation}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                {new Date(
                  factCheck.created_at
                ).toLocaleString()}
              </p>

              <h3 className="mt-6 font-semibold">
                Sources
              </h3>

              <div className="mt-3 space-y-3">
                {factCheck.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                  >
                    <p className="font-medium underline">
                      {source.title || source.url}
                    </p>

                    {source.snippet && (
                      <p className="mt-1 text-sm text-gray-600">
                        {source.snippet}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}