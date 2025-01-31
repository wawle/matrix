
    import { z } from "zod";
    
    export const NodeSchema = z.object({
      version: z.string().min(1, 'Required'),
  data: z.object({}).min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type NodeFormData = z.infer<typeof NodeSchema>;
      