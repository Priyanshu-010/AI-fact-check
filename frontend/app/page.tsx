"use client";

import { useState } from "react";

type Source = {
  id: number;
  title: string | null;
  url: string;
  snippet: string | null;
  evidence: string | null;
  source_relationship: string | null;
};

type FactCheckResult = {
  id: number;
  claim: string;
  verdict: string | null;
  explanation: string | null;
  created_at: string;
  sources: Source[];
};

function getVerdictStyle(verdict: string | null) {
  switch (verdict) {
    case "true":
      return "bg-green-100 text-green-700 border-green-200";

    case "false":
      return "bg-red-100 text-red-700 border-red-200";

    case "partially_true":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    case "insufficient_evidence":
      return "bg-gray-100 text-gray-700 border-gray-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function formatVerdict(verdict: string | null) {
  if (!verdict) {
    return "Unknown";
  }

  return verdict
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRelationshipStyle(relationship: string | null) {
  switch (relationship) {
    case "supports":
      return "border-green-200 bg-green-50 text-green-700";

    case "contradicts":
      return "border-red-200 bg-red-50 text-red-700";

    case "insufficient":
      return "border-gray-200 bg-gray-50 text-gray-600";

    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
}

function formatRelationship(relationship: string | null) {
  if (!relationship) {
    return "Unknown";
  }

  return relationship
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Home() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFactCheck() {
    if (!claim.trim()) {
      setError("Please enter a claim.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please log in first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/fact-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          claim: claim.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Fact check failed.");
      }

      const data: FactCheckResult = await response.json();

      setResult(data);
    } catch (err) {
      setError("Something went wrong while checking the claim.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">FactCheck AI</h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Verify claims using AI-powered web research, evidence analysis, and
            trusted sources.
          </p>
        </div>

        {/* Input */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <label
            htmlFor="claim"
            className="block text-sm font-semibold text-gray-900"
          >
            What would you like to fact-check?
          </label>

          <textarea
            id="claim"
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
            placeholder="Example: The Earth is flat"
            rows={5}
            disabled={loading}
            className="mt-3 w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          />

          <button
            type="button"
            onClick={handleFactCheck}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Researching claim..." : "Fact Check"}
          </button>

          {loading && (
            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-600">
              Searching the web and analyzing available evidence...
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Claim + Verdict */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Claim
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {result.claim}
              </p>

              <div className="mt-6">
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  Verdict
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full border px-4 py-2 text-sm font-bold ${getVerdictStyle(
                    result.verdict,
                  )}`}
                >
                  {formatVerdict(result.verdict)}
                </span>
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Explanation</h2>

              <p className="mt-3 leading-7 text-gray-700">
                {result.explanation}
              </p>
            </div>

            {/* Sources */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Sources</h2>

                <span className="text-sm text-gray-500">
                  {result.sources.length} sources
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {result.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-gray-200 p-4 transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-gray-900">
                        {source.title || "Untitled source"}
                      </h3>

                      <span className="shrink-0 text-sm text-gray-400">↗</span>
                    </div>

                    {source.snippet && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {source.snippet}
                      </p>
                    )}

                    {source.source_relationship && (
                      <span
                        className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRelationshipStyle(
                          source.source_relationship,
                        )}`}
                      >
                        {formatRelationship(source.source_relationship)}
                      </span>
                    )}

                    {source.evidence && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Evidence
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-700">
                          {source.evidence}
                        </p>
                      </div>
                    )}

                    <p className="mt-3 truncate text-xs text-gray-400">
                      {source.url}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
