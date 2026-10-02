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
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-bold"
        >
          FactCheck AI
        </Link>

        {authenticated ? (
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Home
            </Link>

            <Link
              href="/history"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              History
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}