import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "./components/project-form";
import { fetchProjectBySlug } from "@/lib/actions/project";

interface ProjectPageProps {
  params: Promise<{ projectSlug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectSlug } = await params;
  const project =
    projectSlug === "new"
      ? undefined
      : (await fetchProjectBySlug(projectSlug)).data;

  const title = projectSlug === "new" ? "Yeni Proje Oluştur" : "Proje Güncelle";

  const description =
    projectSlug === "new"
      ? "Projenizin detaylarını girerek yeni bir proje oluşturun"
      : "Projenizin detaylarını güncelleyin";

  const defaultValues = {
    name: project?.name || "",
    description: project?.description || "",
  };

  return (
    <div className="flex items-center justify-center mx-auto p-8">
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
          <ProjectForm defaultValues={defaultValues} projectId={project?.id} />
        </CardContent>
      </Card>
    </div>
  );
}
