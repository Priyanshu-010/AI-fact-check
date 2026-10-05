"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

// function getRelationshipStyle(relationship: string | null) {
//   switch (relationship) {
//     case "supports":
//       return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

//     case "contradicts":
//       return "border-red-500/30 bg-red-500/10 text-red-400";

//     case "insufficient":
//       return "border-zinc-700 bg-zinc-800/50 text-zinc-400";

//     default:
//       return "border-zinc-700 bg-zinc-800/50 text-zinc-400";
//   }
// }

// function formatRelationship(relationship: string | null) {
//   if (!relationship) {
//     return "Unknown";
//   }

//   return relationship
//     .replaceAll("_", " ")
//     .replace(/\b\w/g, (letter) => letter.toUpperCase());
// }

export default function HistoryPage() {
  const [factChecks, setFactChecks] = useState<FactCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }
    async function loadHistory() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please log in first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fact-checks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load history.");
        }

        const data: FactCheck[] = await response.json();

        setFactChecks(data);
      } catch (err) {
        setError("Could not load your fact-check history.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [router]);

  async function handleDelete(factCheckId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fact check?",
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/fact-checks/${factCheckId}`,
        {
          method: "DELETE",
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

      if (!response.ok) {
        throw new Error("Failed to delete fact check.");
      }

      setFactChecks((current) =>
        current.filter((factCheck) => factCheck.id !== factCheckId),
      );
    } catch (err) {
      setError("Could not delete the fact check.");
      console.log(err);
    }
  }

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
    <main className="min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Your activity
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Fact Check History
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Review the claims you have previously investigated and the
              evidence found during each fact-check.
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <p className="text-xs text-zinc-500">Total checks</p>

            <p className="mt-1 text-xl font-bold">{factChecks.length}</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && factChecks.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-xl">
              +
            </div>

            <h2 className="mt-5 text-lg font-semibold">No fact checks yet</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Start by submitting a claim and your completed fact checks will
              appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Check a claim
            </Link>
          </div>
        )}

        {/* History */}
        <div className="mt-8 space-y-4">
          {factChecks.map((factCheck) => (
            <article
              key={factCheck.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 transition hover:border-zinc-700"
            >
              <div className="p-5 sm:p-6">
                {/* Claim + Verdict */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                      Claim
                    </p>

                    <h2 className="mt-2 text-lg font-semibold leading-7 text-white">
                      {factCheck.claim}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 self-start rounded-full border px-3 py-1.5 text-xs font-bold ${getVerdictStyle(
                      factCheck.verdict,
                    )}`}
                  >
                    {formatVerdict(factCheck.verdict)}
                  </span>
                </div>

                {/* Explanation */}
                {factCheck.explanation && (
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-500">
                    {factCheck.explanation}
                  </p>
                )}

                {/* Bottom row */}
                <div className="mt-5 flex flex-col gap-4 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-xs text-zinc-600">
                    <span>
                      {factCheck.sources.length}{" "}
                      {factCheck.sources.length === 1 ? "source" : "sources"}
                    </span>

                    <span>•</span>

                    <span>
                      {new Date(factCheck.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/history/${factCheck.id}`}
                      className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(factCheck.id)}
                      className="rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-500 transition hover:border-red-900/70 hover:bg-red-950/30 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
