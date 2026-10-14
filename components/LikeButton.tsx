"use client";

import { useState } from "react";

type LikeButtonProps = {
  initialLikes: number;
};

export default function LikeButton({ initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <button
      onClick={() => setLikes((l) => l + 1)}
      className="border border-red-200 bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100"
    >
      ❤️ {likes}
    </button>
  );
}
