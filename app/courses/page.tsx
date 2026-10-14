import { getCourses } from "@/lib/courses";
import CourseSearchWrapper from "@/components/CourseSearchWrapper";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Courses</h1>
      <CourseSearchWrapper courses={courses} />
    </div>
  );
}
