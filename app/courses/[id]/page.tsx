import LikeButton from "@/components/LikeButton";
import { getCourse, getCourses } from "@/lib/courses";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({
    id: course.id,
  }));
}

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
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-700">{course.description}</p>
      <div className="text-sm text-gray-500">
        Credits: {course.credits} • Elective: {course.isElective ? "Yes" : "No"}
      </div>
      <div>
        <LikeButton initialLikes={course.likes} />
      </div>
    </div>
  );
}
