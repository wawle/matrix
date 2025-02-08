import SchemaPlayground from "./components/model/schema-playground";
import FlowPlayground from "./components/flow/flow-playground";
import { fetchProjectBySlug } from "@/lib/actions/project";
import { templates } from "@/lib/constants/templates";
import { notFound } from "next/navigation";
import { fetchVersionBySlug, getAutoSaveState } from "@/lib/actions/version";
import { IVersion, VersionType } from "@/lib/models/version";

interface Props {
  params: Promise<{
    projectSlug: string;
    versionSlug: string;
  }>;
}

const VersionPlaygroundPage = async ({ params }: Props) => {
  const { projectSlug, versionSlug } = await params;
  const { data: project } = await fetchProjectBySlug(projectSlug);
  const { data: version } = await fetchVersionBySlug(versionSlug);
  if (!project) notFound();

  const type = version?.type;
  const defaultAutoSave = await getAutoSaveState();

  switch (type) {
    case VersionType.MODEL:
      const defaultModelVersion = version || templates.models[0];
      return (
        <SchemaPlayground
          version={defaultModelVersion as IVersion<VersionType.MODEL>}
          project={project}
          defaultAutoSave={defaultAutoSave}
        />
      );
    case VersionType.AGENT:
      const defaultVersion = version || templates.flows[0];
      return (
        <FlowPlayground
          version={defaultVersion as IVersion<VersionType.AGENT>}
          project={project}
          defaultAutoSave={defaultAutoSave}
        />
      );
    default:
      return <div>VersionTypePlaygroundPage</div>;
  }
};

export default VersionPlaygroundPage;
