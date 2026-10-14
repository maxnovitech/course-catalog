import LikeButton from "@/components/LikeButton";
import { EnrollForm } from "@/components/EnrollForm";
import { getCourse } from "@/lib/courses";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function CoursePage({ params }: { params: Params }) {
  const resolvedParams = await params;

  if (resolvedParams.id === "broken") {
    throw new Error("Simulated crash for error boundary testing");
  }

  const course = await getCourse(resolvedParams.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-slate-700 dark:text-slate-300">{course.description}</p>
        <div className="text-sm text-slate-500">
          Credits: {course.credits} • Elective: {course.isElective ? "Yes" : "No"}
        </div>
      </div>

      <div>
        <LikeButton courseId={course.id} initialLikes={course.likes} />
      </div>

      <section className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold mb-3">Enroll in this course</h2>
        <EnrollForm courseId={course.id} />
      </section>
    </div>
  );
}
