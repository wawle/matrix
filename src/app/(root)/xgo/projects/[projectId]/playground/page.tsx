import { fetchProject } from "@/lib/actions/project";
import { getAutoSaveState } from "@/lib/actions/version";
import SchemaPlayground from "./components/schema-playground";
import { templates } from "@/lib/constants/templates";
import { IProject } from "@/lib/models/project";
import { fetchModels } from "@/lib/actions/model";
import { IEdge } from "@/lib/models/edge";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectPlaygroundPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const [{ data: project }, autoSaveEnabled] = await Promise.all([
    fetchProject(projectId),
    getAutoSaveState(),
  ]);

  if (!project) notFound();

  let defaultVersion = null;
  if (project?.versions.length > 0) {
    defaultVersion = project?.versions[0];
    const { data: models } = await fetchModels({ version: defaultVersion.id });
    defaultVersion.models = models;
    defaultVersion.edges = defaultVersion.edges.map((edge: IEdge) => ({
      ...edge,
      style: {
        stroke: "hsl(var(--primary))",
      },
    }));
  } else {
    defaultVersion = templates[0];
  }

  return (
    <SchemaPlayground
      versions={project?.versions}
      defaultVersion={defaultVersion}
      project={project as IProject}
      defaultAutoSave={autoSaveEnabled}
    />
  );
};

export default ProjectPlaygroundPage;
