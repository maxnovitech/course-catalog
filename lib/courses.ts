export type Course = {
  id: string;
  title: string;
  description: string;
  credits: number;
  isElective: boolean;
  likes: number;
};

const courses: Course[] = [
  {
    id: "modern-frontend",
    title: "Modern Frontend: React & Next.js",
    description: "React 19, Server Components, and the App Router.",
    credits: 5,
    isElective: false,
    likes: 24,
  },
  {
    id: "backend-fastapi",
    title: "Backend Foundations: FastAPI",
    description: "Async REST APIs in Python with FastAPI and Pydantic.",
    credits: 5,
    isElective: false,
    likes: 19,
  },
  {
    id: "databases-postgresql",
    title: "Relational Databases: PostgreSQL",
    description: "Schema design, SQLAlchemy, and migrations with Alembic.",
    credits: 5,
    isElective: false,
    likes: 15,
  },
  {
    id: "api-design",
    title: "API Design: REST vs GraphQL",
    description: "Comparing REST and GraphQL in practice.",
    credits: 4,
    isElective: true,
    likes: 11,
  },
  {
    id: "web-security",
    title: "Web Security Essentials",
    description: "JWT/OAuth2, defending against XSS, CSRF, SQL injection.",
    credits: 4,
    isElective: false,
    likes: 21,
  },
  {
    id: "ai-integration",
    title: "AI/LLM Integration",
    description: "LLM features in an app, wired up via the OpenAI API.",
    credits: 5,
    isElective: true,
    likes: 32,
  },
];

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getCourses(): Promise<Course[]> {
  return delay(courses);
}

export async function getCourse(id: string): Promise<Course | undefined> {
  return delay(courses.find((c) => c.id === id));
}
