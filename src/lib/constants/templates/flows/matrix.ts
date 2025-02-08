import { IVersion } from "@/lib/models/version";
import { VersionType } from "@/lib/models/version";

export const matrixFlow: IVersion<VersionType.AGENT> = {
  id: "matrix",
  name: "Matrix",
  description: "Matrix flow",
  is_active: false,
  type: VersionType.AGENT,
  nodes: [],
  edges: [],
};
