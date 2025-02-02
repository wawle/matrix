import { schemaBuilder } from "./builder";

export const schema = {
  template: (name: string, props: any): string => {
    const model = props.model;
    const schema = schemaBuilder(model);
    return `
    import { z } from "zod";
    
    export const ${model.name}Schema = z.object({
    ${schema}
    });
    
    export type ${model.name}FormData = z.infer<typeof ${model.name}Schema>;
      `;
  },
};
