// for schema config
export interface ISchemaConfig {
  optionLabel?: string;
}

// for schema fields
export interface ISchema {
  id: string;
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
  regex?: string;
  config?: ISchemaConfig;
}

// for schema middlewares
export interface IMiddleware {
  type: "pre" | "post";
  function: string;
  action:
    | "create"
    | "update"
    | "delete"
    | "deleteOne"
    | "findOneAndDelete"
    | "deleteMany";
}

// for schema methods
export interface IMethod {
  name: string;
  function: string;
}

// for model
export type IModelData = {
  name: string;
  description?: string;
  schemas: ISchema[];
  middlewares?: IMiddleware[];
  methods?: IMethod[];
  onWidthChange?: (width: number) => void;
  onHeightChange?: (height: number) => void;
};

export type IModelConnectionType =
  | "oneToMany"
  | "oneToOne"
  | "manyToOne"
  | "manyToMany";

export type IModelConnectionData = {
  type: IModelConnectionType;
};
