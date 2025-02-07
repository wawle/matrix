export interface IPageNode {
  name: string;
  children?: IPageNode[];
  props?: Record<string, any>;
  template?: "layout" | "page" | "loading" | "error" | "not-found";
}

export interface IComponentNode {
  name: string;
  children?: IComponentNode[];
  props?: Record<string, any>;
  template: string;
}

export interface ISchemaConfigNode {
  optionLabel?: string;
}

export interface ISchemaNode {
  name: string;
  label: string;
  type: string;
  unique?: boolean;
  required?: boolean;
  enum?: string[];
  match?: string;
  default?: any;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  trim?: boolean;
  config?: ISchemaConfigNode;
}

export interface IMiddlewareNode {
  type: "pre" | "post";
  action:
    | "create"
    | "update"
    | "delete"
    | "deleteOne"
    | "findOneAndDelete"
    | "deleteMany";
}

export interface IMethodNode {
  name: string;
  function: string;
}

export interface IModelNode {
  name: string;
  description?: string;
  schemas: ISchemaNode[];
  middlewares?: IMiddlewareNode[];
  methods?: IMethodNode[];
}

export interface IAgentNode {
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
  children: IAgentNode[];
}
