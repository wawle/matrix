import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { VersionForm } from "./components/version-form";
import { fetchVersion } from "@/lib/actions/version";

interface VersionPageProps {
  params: Promise<{ projectId: string; versionId: string }>;
}

export default async function VersionPage({ params }: VersionPageProps) {
  const { projectId, versionId } = await params;
  const version =
    versionId === "new" ? undefined : (await fetchVersion(versionId)).data;

  const title =
    versionId === "new" ? "Yeni Version Oluştur" : "Version Güncelle";

  const description =
    versionId === "new"
      ? "Versioninizin detaylarını girerek yeni bir version oluşturun"
      : "Versioninizin detaylarını güncelleyin";

  const defaultValues = {
    name: version?.name || "",
    description: version?.description || "",
    type: version?.type || "model",
    is_active: version?.is_active || false,
    project: projectId,
  };

  console.log({ versionId });

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
          <VersionForm defaultValues={defaultValues} versionId={versionId} />
        </CardContent>
      </Card>
      {versionId !== "new" && (
        <Link
          href={`/xgo/projects/${projectId}/versions/${versionId}/playground`}
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
