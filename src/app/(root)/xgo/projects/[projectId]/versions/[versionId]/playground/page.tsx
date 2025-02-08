import SchemaPlayground from "./components/model/schema-playground";
import FlowPlayground from "./components/flow/flow-playground";
import { fetchProject } from "@/lib/actions/project";
import { templates } from "@/lib/constants/templates";
import { notFound } from "next/navigation";
import { getAutoSaveState } from "@/lib/actions/version";
import { IVersion, VersionType } from "@/lib/models/version";

interface Props {
  params: Promise<{
    projectId: string;
    versionId: string;
  }>;
}

const VersionPlaygroundPage = async ({ params }: Props) => {
  const { projectId, versionId } = await params;
  const { data: project } = await fetchProject(projectId);

  if (!project) notFound();

  const version = project?.versions.find((v) => v.id === versionId);
  const type = version?.type;
  const defaultAutoSave = await getAutoSaveState();

  switch (type) {
    case VersionType.MODEL:
      const modelVersions =
        project?.versions.filter((v) => v.type === type) || [];
      const defaultModelVersion =
        version || modelVersions[0] || templates.models[0];
      return (
        <SchemaPlayground
          versions={modelVersions as IVersion<VersionType.MODEL>[]}
          defaultVersion={defaultModelVersion as IVersion<VersionType.MODEL>}
          project={project}
          defaultAutoSave={defaultAutoSave}
        />
      );
    case VersionType.AGENT:
      const versions = project?.versions.filter((v) => v.type === type) || [];
      const defaultVersion = version || versions[0] || templates.flows[0];
      return (
        <FlowPlayground
          versions={versions as IVersion<VersionType.AGENT>[]}
          defaultVersion={defaultVersion as IVersion<VersionType.AGENT>}
          project={project}
          defaultAutoSave={defaultAutoSave}
        />
      );
    default:
      return <div>VersionTypePlaygroundPage</div>;
  }
};

export default VersionPlaygroundPage;
