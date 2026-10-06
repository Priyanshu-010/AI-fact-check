"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Source = {
  id: number;
  title: string | null;
  url: string;
  snippet: string | null;
  evidence: string | null;
  source_relationship: string | null;
};

type FactCheck = {
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

function getRelationshipLabel(relationship: string) {
  switch (relationship) {
    case "supports":
      return "Supports the claim";

    case "contradicts":
      return "Contradicts the claim";

    case "insufficient":
      return "Insufficient evidence";

    default:
      return "Other evidence";
  }
}

export default function FactCheckDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [factCheck, setFactCheck] = useState<FactCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function loadFactCheck() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/fact-checks/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.replace("/login");
          return;
        }

        if (response.status === 404) {
          setError("Fact check not found.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load fact check.");
        }

        const data: FactCheck = await response.json();

        setFactCheck(data);
      } catch (err) {
        setError("Could not load this fact check.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadFactCheck();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-zinc-500">Loading fact check...</p>
        </div>
      </main>
    );
  }

  if (error || !factCheck) {
    return (
      <main className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/history"
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            ← Back to History
          </Link>

          <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/30 p-6">
            <p className="text-sm text-red-400">
              {error || "Fact check not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const supportingSources = factCheck.sources.filter(
    (source) => source.source_relationship === "supports",
  );

  const contradictingSources = factCheck.sources.filter(
    (source) => source.source_relationship === "contradicts",
  );

  const insufficientSources = factCheck.sources.filter(
    (source) => source.source_relationship === "insufficient",
  );

  const unclassifiedSources = factCheck.sources.filter(
    (source) =>
      !source.source_relationship ||
      !["supports", "contradicts", "insufficient"].includes(
        source.source_relationship,
      ),
  );

  function renderSourceSection(
    title: string,
    sources: Source[],
    description: string,
  ) {
    if (sources.length === 0) {
      return null;
    }

    return (
      <section className="mt-8">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>

            <span className="text-xs text-zinc-600">
              {sources.length} {sources.length === 1 ? "source" : "sources"}
            </span>
          </div>

          <p className="mt-1 text-xs text-zinc-600">{description}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
          {sources.map((source, index) => (
            <article
              key={source.id}
              className={`p-5 ${
                index !== sources.length - 1 ? "border-b border-zinc-800" : ""
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-medium text-zinc-200">
                    {source.title || "Untitled source"}
                  </h3>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getRelationshipStyle(
                      source.source_relationship,
                    )}`}
                  >
                    {formatRelationship(source.source_relationship)}
                  </span>
                </div>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-medium text-zinc-500 transition hover:text-white"
                >
                  Open source ↗
                </a>
              </div>

              {source.evidence && (
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-700">
                    Extracted evidence
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {source.evidence}
                  </p>
                </div>
              )}

              {!source.evidence && source.snippet && (
                <p className="mt-4 text-xs leading-5 text-zinc-600">
                  {source.snippet}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          href="/history"
          className="inline-flex items-center text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to History
        </Link>

        {/* Claim header */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Fact Check
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="max-w-3xl text-2xl font-bold leading-9 tracking-tight text-white sm:text-3xl">
              {factCheck.claim}
            </h1>

            <span
              className={`shrink-0 self-start rounded-full border px-3 py-1.5 text-xs font-bold ${getVerdictStyle(
                factCheck.verdict,
              )}`}
            >
              {formatVerdict(factCheck.verdict)}
            </span>
          </div>

          <p className="mt-3 text-xs text-zinc-600">
            Checked on {new Date(factCheck.created_at).toLocaleString()}
          </p>
        </div>

        {/* Verdict */}
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Verdict
          </p>

          <div className="mt-4 flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold ${getVerdictStyle(
                factCheck.verdict,
              )}`}
            >
              {factCheck.verdict === "true"
                ? "✓"
                : factCheck.verdict === "false"
                  ? "×"
                  : "?"}
            </div>

            <div>
              <p className="text-lg font-semibold text-white">
                {formatVerdict(factCheck.verdict)}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Based on the evidence collected during this fact check.
              </p>
            </div>
          </div>

          {factCheck.explanation && (
            <div className="mt-6 border-t border-zinc-800 pt-5">
              <p className="text-sm leading-7 text-zinc-400">
                {factCheck.explanation}
              </p>
            </div>
          )}
        </section>

        {/* Evidence */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Evidence
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Sources used for this fact check
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            The sources below were analyzed to determine the final verdict.
          </p>
        </div>

        {renderSourceSection(
          getRelationshipLabel("contradicts"),
          contradictingSources,
          "Sources containing evidence that conflicts with the claim.",
        )}

        {renderSourceSection(
          getRelationshipLabel("supports"),
          supportingSources,
          "Sources containing evidence that supports the claim.",
        )}

        {renderSourceSection(
          getRelationshipLabel("insufficient"),
          insufficientSources,
          "Sources that did not provide enough evidence to determine their relationship to the claim.",
        )}

        {renderSourceSection(
          "Other sources",
          unclassifiedSources,
          "Sources that were found but could not be classified.",
        )}

        {factCheck.sources.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center">
            <p className="text-sm text-zinc-500">
              No sources were recorded for this fact check.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
