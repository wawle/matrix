import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchProject, fetchProjectBySlug } from "@/lib/actions/project";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Layers,
  PlusCircle,
  Type,
  Workflow,
  Code2,
  Bot,
  Globe,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { VersionType } from "@/lib/models/version";

interface VersionTypeConfig {
  type: VersionType;
  label: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
}

const VERSION_TYPES: VersionTypeConfig[] = [
  {
    type: VersionType.MODEL,
    label: "Api",
    icon: Code2,
    bgColor: "bg-blue-50 dark:bg-blue-700/50",
    borderColor: "hover:border-blue-500",
    iconColor: "text-blue-500",
  },
  {
    type: VersionType.AGENT,
    label: "Agent",
    icon: Bot,
    bgColor: "bg-purple-50 dark:bg-purple-700/50",
    borderColor: "hover:border-purple-500",
    iconColor: "text-purple-500",
  },
  {
    type: VersionType.PAGE,
    label: "Web",
    icon: Globe,
    bgColor: "bg-green-50 dark:bg-green-700/50",
    borderColor: "hover:border-green-500",
    iconColor: "text-green-500",
  },
  {
    type: VersionType.SCREEN,
    label: "App",
    icon: Smartphone,
    bgColor: "bg-rose-50 dark:bg-rose-700/50",
    borderColor: "hover:border-rose-500",
    iconColor: "text-rose-500",
  },
];

const getVersionTypeConfig = (type: string) => {
  return VERSION_TYPES.find((t) => t.type === type) || VERSION_TYPES[0];
};

const getVersionLabel = (type: string) => {
  return getVersionTypeConfig(type).label;
};

interface Props {
  searchParams: Promise<{
    type: string;
  }>;
  params: Promise<{
    projectSlug: string;
  }>;
}

const VersionsPage = async (props: Props) => {
  const { projectSlug } = await props.params;
  const { data: project } = await fetchProjectBySlug(projectSlug);
  const versions = project?.versions;

  const existingTypes = versions?.map((v) => v.type) || [];
  const availableTypes = VERSION_TYPES.filter(
    (t) => !existingTypes.includes(t.type)
  );

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="w-full space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">Versions</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mevcut Versiyonlar */}
          {versions?.map((version) => {
            const typeConfig = getVersionTypeConfig(version.type);
            return (
              <Link
                key={version.id}
                href={`/xgo/projects/${projectSlug}/versions/${version.slug}`}
              >
                <Card
                  className={cn(
                    "h-[240px] transition-all hover:shadow-md cursor-pointer group",
                    typeConfig.bgColor
                  )}
                >
                  <CardHeader className="space-y-2">
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-1 flex items-center gap-2">
                        <typeConfig.icon
                          className={cn("w-5 h-5", typeConfig.iconColor)}
                        />
                        {version.name}
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
                        {getVersionLabel(version.type)}
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
            );
          })}

          {/* Yeni Version Kartları */}
          {availableTypes.map((typeConfig) => (
            <Link
              key={typeConfig.type}
              href={`/xgo/projects/${projectSlug}/versions/new?type=${typeConfig.type}`}
            >
              <Card
                className={cn(
                  "h-[240px] flex flex-col items-center justify-center transition-all hover:shadow-md cursor-pointer group border-2",
                  typeConfig.bgColor,
                  typeConfig.borderColor
                )}
              >
                <CardContent className="flex flex-col items-center justify-center space-y-4">
                  <typeConfig.icon
                    className={cn("w-12 h-12", typeConfig.iconColor)}
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-foreground">
                      New {typeConfig.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Create a new {typeConfig.label.toLowerCase()}
                    </p>
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
    case "agent":
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
