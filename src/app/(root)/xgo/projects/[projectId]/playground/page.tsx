import { fetchProject } from "@/lib/actions/project";
import { getAutoSaveState } from "@/lib/actions/version";
import SchemaPlayground from "./components/schema-playground";
import { templates } from "@/lib/constants/templates";
import { IProject } from "@/lib/models/project";

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

  const defaultVersion =
    project?.versions.length > 0 ? project?.versions[0] : templates[0];
  console.log({ versions: project?.versions });

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
