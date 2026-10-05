"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

    case "false":
      return "border-red-500/30 bg-red-500/10 text-red-400";

    case "partially_true":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";

    case "insufficient_evidence":
      return "border-zinc-700 bg-zinc-800/50 text-zinc-400";

    default:
      return "border-zinc-700 bg-zinc-800/50 text-zinc-400";
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
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

    case "contradicts":
      return "border-red-500/30 bg-red-500/10 text-red-400";

    case "insufficient":
      return "border-zinc-700 bg-zinc-800/50 text-zinc-400";

    default:
      return "border-zinc-700 bg-zinc-800/50 text-zinc-400";
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fact-checks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            claim: claim.trim(),
          }),
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.detail || "Fact check failed. Please try again.");
      }

      const data: FactCheckResult = await response.json();

      setResult(data);
    } catch (err) {
      console.log(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while checking the claim.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <section className="text-center">
          <div className="mx-auto inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs font-medium text-zinc-400">
            AI-powered fact verification
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Find out what is
            <span className="text-zinc-500"> actually true.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Submit a claim and let AI research the web, analyze evidence, and
            explain what the available evidence shows.
          </p>
        </section>

        {/* Input */}
        <section className="mt-10">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-2 shadow-2xl shadow-black/20">
            <textarea
              id="claim"
              value={claim}
              onChange={(event) => setClaim(event.target.value)}
              placeholder="Enter a claim to fact-check..."
              rows={5}
              disabled={loading}
              className="w-full resize-none rounded-xl bg-transparent px-4 py-4 text-base text-white outline-none placeholder:text-zinc-600 disabled:opacity-50"
            />

            <div className="flex items-center justify-between gap-4 border-t border-zinc-800 px-2 pt-2">
              <span className="hidden text-xs text-zinc-600 sm:block">
                AI will research multiple web sources
              </span>

              <button
                type="button"
                onClick={handleFactCheck}
                disabled={loading}
                className="ml-auto rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Researching..." : "Fact Check →"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-zinc-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
              Researching the claim and analyzing evidence...
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
              {error}
            </div>
          )}
        </section>

        {/* Result */}
        {result && (
          <section className="mt-10 space-y-4">
            {/* Claim + Verdict */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Claim
                  </p>

                  <h2 className="mt-2 text-xl font-semibold leading-8 text-white">
                    {result.claim}
                  </h2>
                </div>

                <div className="shrink-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
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
            </div>

            {/* Explanation */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
              <h2 className="text-lg font-semibold">Explanation</h2>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {result.explanation}
              </p>
            </div>

            {/* Sources */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Evidence & Sources</h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Sources used during the fact-check
                  </p>
                </div>

                <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-500">
                  {result.sources.length}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {result.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-zinc-200 group-hover:text-white">
                          {source.title || "Untitled source"}
                        </h3>

                        <p className="mt-1 truncate text-xs text-zinc-600">
                          {source.url}
                        </p>
                      </div>

                      <span className="text-zinc-600 transition group-hover:text-white">
                        ↗
                      </span>
                    </div>

                    {source.snippet && (
                      <p className="mt-4 text-sm leading-6 text-zinc-500">
                        {source.snippet}
                      </p>
                    )}

                    {source.source_relationship && (
                      <span className="mt-4 inline-flex rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-400">
                        {formatRelationship(source.source_relationship)}
                      </span>
                    )}

                    {source.evidence && (
                      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                          Evidence
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                          {source.evidence}
                        </p>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
