import { Node } from "reactflow";

// for agents
export type IAgentData = {
  instructions: string;
  stream: boolean;
  model_provider: string;
  model_name: string;
  max_tokens: number;
  temperature: number;
  seed: number;
  name: string;
  title: string;
  is_public: boolean;
  photo: string;
  key: string;
  children: Node<IAgentData>[];
};

export type IAgentConnectionType =
  | "sequential"
  | "parallel"
  | "conditional"
  | "child";

export type IAgentConnectionData = {
  type: IAgentConnectionType;
};
