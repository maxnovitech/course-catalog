import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-4">Course not found</h2>
      <Link href="/courses" className="text-blue-600 underline">
        Return to course list
      </Link>
    </div>
  );
}
