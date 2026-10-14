"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Course error boundary caught:", error);
  }, [error]);

  return (
    <div className="p-4 border border-red-300 bg-red-50 rounded mt-4">
      <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong!</h2>
      <p className="mb-4 text-gray-700">{error.message || "Failed to load the course data."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
