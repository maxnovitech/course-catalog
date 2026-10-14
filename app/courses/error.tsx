"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="p-6 border border-red-200 bg-red-50 dark:bg-red-950/20 rounded-md">
      <h1 className="mb-2 text-2xl font-bold text-red-600 dark:text-red-400">
        Something went wrong
      </h1>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        Could not load the data. The backend may not be running.
      </p>
      <button
        onClick={() => retry()}
        className="rounded-md border border-slate-300 bg-white dark:bg-slate-900 px-3 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
      >
        Try again
      </button>
    </main>
  );
}
