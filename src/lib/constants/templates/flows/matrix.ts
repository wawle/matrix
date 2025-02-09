import { IVersion } from "@/lib/models/version";
import { VersionType } from "@/lib/models/version";

export const matrixFlow: IVersion<VersionType.AGENT> = {
  id: "matrix",
  name: "Matrix",
  description: "Matrix flow",
  slug: "matrix",
  type: VersionType.AGENT,
  nodes: [],
  edges: [],
};
