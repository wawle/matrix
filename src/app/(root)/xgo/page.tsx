import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Calendar, Clock, Layers } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { fetchProjects } from "@/lib/actions/project";

export default async function XgoPage() {
  const { data: projects } = await fetchProjects();

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Yeni Proje Kartı */}
      <Link href="/xgo/projects/new">
        <Card className="h-[160px] flex flex-col items-center justify-center hover:border-primary transition-all hover:shadow-md cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center">
            <PlusCircle className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
            <h3 className="text-xl font-medium text-foreground">
              Start New Project
            </h3>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
