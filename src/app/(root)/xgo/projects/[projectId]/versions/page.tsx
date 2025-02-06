import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchProject } from "@/lib/actions/project";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Layers,
  PlusCircle,
  Type,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  searchParams: {
    type: string;
  };
  params: Promise<{
    projectId: string;
  }>;
}

const VersionsPage = async ({ params, searchParams }: Props) => {
  const { projectId } = await params;
  const { data: project } = await fetchProject(projectId);
  const versions = project?.versions;
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Versions</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Yeni Proje Kartı */}
          <Link href={`/xgo/projects/${projectId}/versions/new`}>
            <Card className="h-[240px] flex flex-col items-center justify-center hover:border-primary transition-all hover:shadow-md cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <PlusCircle className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <h3 className="text-xl font-medium text-foreground">
                  New Version
                </h3>
              </CardContent>
            </Card>
          </Link>

          {/* Mevcut Projeler */}
          {versions?.map((version) => (
            <Link
              key={version.id}
              href={`/xgo/projects/${projectId}/versions/${version.id}`}
            >
              <Card className="h-[240px] hover:border-primary transition-all hover:shadow-md cursor-pointer">
                <CardHeader className="space-y-2">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">
                      Version: {version.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {version.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Type className="w-4 h-4" />
                    <Badge variant={variantSwitcher(version.type)}>
                      {version.type.charAt(0).toUpperCase() +
                        version.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    <span>{version.nodes?.length || 0} Node</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Workflow className="w-4 h-4" />
                    <span>{version.edges?.length || 0} Edge</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {version.createdAt
                          ? new Date(version.createdAt).toLocaleDateString(
                              "tr-TR"
                            )
                          : "Tarih yok"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {version.updatedAt
                          ? formatDistanceToNow(new Date(version.updatedAt), {
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
};

const variantSwitcher = (type: string) => {
  switch (type) {
    case "model":
      return "outline";
    case "flow":
      return "secondary";
    case "page":
      return "destructive";
    case "screen":
      return "default";
    default:
      return "default";
  }
};

export default VersionsPage;
