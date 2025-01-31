
    import { z } from "zod";
    
    export const EdgeSchema = z.object({
      version: z.string().min(1, 'Required'),
  data: z.object({}).min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type EdgeFormData = z.infer<typeof EdgeSchema>;
      