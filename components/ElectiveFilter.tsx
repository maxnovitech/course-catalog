"use client";

import { useState } from "react";
import useSWR from "swr";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetcher(url: string): Promise<Course[]> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export function ElectiveFilter() {
  const [onlyElective, setOnlyElective] = useState(false);
  const query = onlyElective ? "?is_elective=true" : "";
  const { data, error, isLoading } = useSWR(`${API}/courses${query}`, fetcher);

  return (
    <div>
      <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={onlyElective}
          onChange={(e) => setOnlyElective(e.target.checked)}
          className="rounded border-slate-300"
        />
        Electives only
      </label>
      {error && <p className="text-red-600 mb-2">Failed to load courses</p>}
      {isLoading && <p className="text-slate-500 mb-2">Loading…</p>}
      {data && (
        <ul className="list-disc pl-6 space-y-1">
          {data.map((c) => (
            <li key={c.id}>
              {c.title} — {c.credits} cr.
              {c.isElective && " · elective"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
