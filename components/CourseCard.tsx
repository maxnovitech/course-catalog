import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  credits: number;
  likes: number;
};

export default function CourseCard({ id, title, description, credits, likes }: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card className="hover:shadow-md hover:border-blue-300 transition dark:hover:border-blue-700 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardContent className="pt-0 mt-auto">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Credits: {credits}</Badge>
            <Button variant="ghost" size="sm">❤ {likes}</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
