import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "./components/project-form";
import { fetchProject } from "@/lib/actions/project";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="grid grid-cols-2 gap-8 container mx-auto p-8">
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
      {project && (
        <div className="flex flex-col gap-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Version</TableHead>
                <TableHead className="">
                  <Link href={`/xgo/projects/${projectId}/versions/new`}>
                    <Button variant="link" size="icon">
                      <PlusCircle />
                      New Version
                    </Button>
                  </Link>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project?.versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/xgo/projects/${projectId}/versions/${version.id}`}
                    >
                      <Button variant="link" size="icon">
                        {version.name}
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
