import { fetchVersion } from "@/lib/actions/version";
import SchemaPlayground from "./components/model/schema-playground";
import FlowPlayground from "./components/flow/flow-playground";

interface Props {
  params: Promise<{
    projectId: string;
    versionId: string;
  }>;
}

const VersionTypePlaygroundPage = async ({ params }: Props) => {
  const { versionId } = await params;
  const { data: version } = await fetchVersion(versionId);
  const type = version?.type;

  switch (type) {
    case "model":
      return <SchemaPlayground />;
    case "flow":
      return <FlowPlayground />;
    default:
      return <div>VersionTypePlaygroundPage</div>;
  }
};

export default VersionTypePlaygroundPage;
