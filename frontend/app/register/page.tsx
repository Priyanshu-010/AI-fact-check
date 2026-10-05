"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Registration failed.");
        return;
      }

      router.push("/login");
    } catch (err) {
      console.log(err);
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/login"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-black"
          >
            F
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Start checking claims with FactCheckAI.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl sm:p-8">
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleRegister();
                  }
                }}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-zinc-600"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleRegister();
                  }
                }}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-zinc-600"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Use at least 6 characters.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Button */}
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          {/* Login link */}
          <div className="mt-6 border-t border-zinc-800 pt-6 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-white transition hover:text-zinc-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}