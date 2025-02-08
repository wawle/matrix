import { IVersion, VersionType } from "@/lib/models/version";

export const investTrackerModel: IVersion<VersionType.MODEL> = {
  id: "investTracker",
  name: "Invest Tracker",
  description: "Invest Tracker",
  is_active: false,
  type: VersionType.MODEL,
  nodes: [
    {
      id: "investment",
      position: { x: 100, y: 100 },
      type: VersionType.MODEL,
      data: {
        name: "Investment",
        description: "Investment",
        fields: [
          { id: "i1", name: "id", type: "string", required: true },
          { id: "i2", name: "name", type: "string", required: true },
          { id: "i3", name: "amount", type: "number", required: true },
          { id: "i4", name: "date", type: "date", required: true },
          { id: "i5", name: "category", type: "reference", required: true },
          { id: "i6", name: "description", type: "string", required: false },
        ],
      },
    },
    {
      id: "category",
      position: { x: 500, y: 100 },
      type: VersionType.MODEL,
      data: {
        name: "Category",
        description: "Category",
        fields: [
          { id: "c1", name: "id", type: "string", required: true },
          { id: "c2", name: "name", type: "string", required: true },
          { id: "c3", name: "description", type: "string", required: false },
        ],
      },
    },
    {
      id: "user",
      position: { x: 100, y: 400 },
      type: VersionType.MODEL,
      data: {
        name: "User",
        description: "User",
        fields: [
          { id: "u1", name: "id", type: "string", required: true },
          { id: "u2", name: "name", type: "string", required: true },
          { id: "u3", name: "email", type: "string", required: true },
          { id: "u4", name: "password", type: "string", required: true },
          { id: "u5", name: "investments", type: "reference", required: false },
        ],
      },
    },
  ],
  edges: [
    {
      id: "e1",
      source: "investment",
      target: "category",
      animated: true,
      label: "N:1",
      type: VersionType.MODEL,
      data: { type: "oneToMany" },
    },
    {
      id: "e2",
      source: "user",
      target: "investment",
      animated: true,
      label: "N:1",
      type: VersionType.MODEL,
      data: { type: "oneToMany" },
    },
  ],
};
