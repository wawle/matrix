import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { VersionForm } from "./components/version-form";
import { fetchVersionBySlug } from "@/lib/actions/version";
import { VersionType } from "@/lib/models/version";
import { fetchProjectBySlug } from "@/lib/actions/project";
import { notFound } from "next/navigation";

interface VersionPageProps {
  searchParams: Promise<{
    type: VersionType;
  }>;
  params: Promise<{ projectSlug: string; versionSlug: string }>;
}

export default async function VersionPage(props: VersionPageProps) {
  const { type } = await props.searchParams;
  const { projectSlug, versionSlug } = await props.params;
  const { data: project } = await fetchProjectBySlug(projectSlug);

  if (!project) notFound();

  const version =
    versionSlug === "new"
      ? undefined
      : (await fetchVersionBySlug(versionSlug)).data;

  const title =
    versionSlug === "new" ? "Yeni Version Oluştur" : "Version Güncelle";

  const description =
    versionSlug === "new"
      ? "Versioninizin detaylarını girerek yeni bir version oluşturun"
      : "Versioninizin detaylarını güncelleyin";

  const defaultValues = {
    name: version?.name || "",
    description: version?.description || "",
    type: version?.type || (type as VersionType) || VersionType.MODEL,
    project: project?.id,
    nodes: version?.nodes || [],
    edges: version?.edges || [],
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
          <VersionForm defaultValues={defaultValues} versionId={version?.id} />
        </CardContent>
      </Card>
      {versionSlug !== "new" && (
        <Link
          href={`/xgo/projects/${projectSlug}/versions/${versionSlug}/playground`}
        >
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
