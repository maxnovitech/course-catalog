import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">University Course Catalog</h1>
      <p className="mb-4 text-muted-foreground">Welcome to the advanced web technologies catalog.</p>
      <Link href="/courses" className={buttonVariants({ variant: "brand" })}>
        View all courses
      </Link>
    </div>
  );
}
