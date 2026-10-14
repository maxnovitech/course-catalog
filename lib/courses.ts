import type { components } from "./schema";

export type Course = components["schemas"]["Course"];
export type Enrollment = components["schemas"]["Enrollment"];

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("API_URL is not set: create .env.local");
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_URL}/courses`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getCourse(id: string): Promise<Course | undefined> {
  const res = await fetch(`${API_URL}/courses/${id}`, { cache: "no-store" });
  if (res.status === 404) {
    return undefined;
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}
