import { Edge } from "reactflow";

// for web pages
export type IPageData = {
  name: string;
  children?: IPageData[];
  props?: Record<string, any>;
  template?: "layout" | "page" | "loading" | "error" | "not-found";
};

// for components to use in pages
export interface IComponentData {
  name: string;
  children?: IComponentData[];
  props?: Record<string, any>;
  template: string;
}

export type IComponentEdge = Edge<{
  type: "oneToMany" | "oneToOne" | "manyToOne" | "manyToMany";
}>;
