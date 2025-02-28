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

export default async function ProjectsPage() {
  const { data: projects } = await fetchProjects();

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Projelerim</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Yeni Proje Kartı */}
          <Link href="/xgo/projects/new">
            <Card className="h-[240px] flex flex-col items-center justify-center hover:border-primary transition-all hover:shadow-md cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <PlusCircle className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <h3 className="text-xl font-medium text-foreground">
                  Yeni Proje Oluştur
                </h3>
              </CardContent>
            </Card>
          </Link>

          {/* Mevcut Projeler */}
          {projects.map((project) => (
            <Link key={project.id} href={`/xgo/projects/${project.id}`}>
              <Card className="h-[240px] hover:border-primary transition-all hover:shadow-md cursor-pointer">
                <CardHeader className="space-y-2">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    <span>{project.versions?.length || 0} Version</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString(
                              "tr-TR"
                            )
                          : "Tarih yok"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {project.updatedAt
                          ? formatDistanceToNow(new Date(project.updatedAt), {
                              addSuffix: true,
                              locale: tr,
                            })
                          : "Tarih yok"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
