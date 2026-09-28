"use client";

import { useState } from "react";

type Source = {
  id: number;
  title: string | null;
  url: string;
  snippet: string | null;
};

type FactCheckResult = {
  id: number;
  claim: string;
  verdict: string | null;
  explanation: string | null;
  created_at: string;
  sources: Source[];
};

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

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/fact-checks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            claim: claim,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Fact check failed.");
      }

      const data: FactCheckResult = await response.json();

      setResult(data);
    } catch (error) {
      setError("Something went wrong while checking the claim.");
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 text-gray-700">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-center text-4xl font-bold">
          FactCheck AI
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Verify claims using AI-powered web research.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">
          <label
            htmlFor="claim"
            className="block text-sm font-medium text-gray-700"
          >
            Enter a claim
          </label>

          <textarea
            id="claim"
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
            placeholder="Example: The Earth is flat"
            rows={5}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
          />

          <button
            type="button"
            onClick={handleFactCheck}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Checking..." : "Fact Check"}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold">
              Result
            </h2>

            <p className="mt-4">
              <strong>Verdict:</strong> {result.verdict}
            </p>

            <p className="mt-4 text-gray-700">
              {result.explanation}
            </p>

            <h3 className="mt-8 text-xl font-semibold">
              Sources
            </h3>

            <div className="mt-4 space-y-4">
              {result.sources.map((source) => (
                <div
                  key={source.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                  >
                    {source.title || source.url}
                  </a>

                  {source.snippet && (
                    <p className="mt-2 text-sm text-gray-600">
                      {source.snippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}