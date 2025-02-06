import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "./components/project-form";
import { fetchProject } from "@/lib/actions/project";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project =
    projectId === "new" ? undefined : (await fetchProject(projectId)).data;

  const title = projectId === "new" ? "Yeni Proje Oluştur" : "Proje Güncelle";

  const description =
    projectId === "new"
      ? "Projenizin detaylarını girerek yeni bir proje oluşturun"
      : "Projenizin detaylarını güncelleyin";

  const defaultValues = {
    name: project?.name || "",
    description: project?.description || "",
  };

  return (
    <div className="flex-1 overflow-auto p-8 flex justify-center gap-8">
      <Card className="w-[600px] hover:shadow-lg transition-all duration-300 hover:border-primary">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center">
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            {description}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <ProjectForm defaultValues={defaultValues} projectId={projectId} />
        </CardContent>
      </Card>
      {projectId !== "new" && (
        <Link href={`/xgo/projects/${projectId}/playground`}>
          <Card className="w-[600px] h-full hover:shadow-lg transition-all duration-300 hover:border-primary">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-bold text-center">
                Playground
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      )}
    </div>
  );
}
