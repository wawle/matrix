export interface PageNode {
  name: string;
  children?: PageNode[];
  props?: Record<string, any>;
  template?: "layout" | "page" | "loading" | "error" | "not-found";
}

export interface ComponentNode {
  name: string;
  children?: ComponentNode[];
  props?: Record<string, any>;
  template: string;
}

export interface INodeField {
  id: string;
  name: string;
  label: string;
  type: string;
  validations?: Record<string, any>;
}
