"use client";

import { useState } from "react";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

type LikeButtonProps = {
  courseId: string;
  initialLikes: number;
};

export default function LikeButton({ courseId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    setFailed(false);
    try {
      const res = await fetch(`${API}/courses/${courseId}/like`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error();
      }
      const course: Course = await res.json();
      setLikes(course.likes);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        ❤ {likes}
      </button>
      {failed && <p className="text-red-600 text-sm mt-1">Failed to like the course</p>}
    </div>
  );
}
