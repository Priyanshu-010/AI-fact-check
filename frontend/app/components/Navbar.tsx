"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAuthenticated(Boolean(token));
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    setAuthenticated(false);
    router.replace("/login");
  }

  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-black text-black transition-transform group-hover:scale-105">
            F
          </div>

          <span className="text-lg font-semibold tracking-tight">
            FactCheck<span className="text-zinc-500">AI</span>
          </span>
        </Link>

        {authenticated ? (
          <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/70 p-1">
            <Link
              href="/"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === "/"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Home
            </Link>

            <Link
              href="/history"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === "/history"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              History
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}