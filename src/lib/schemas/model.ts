
    import { z } from "zod";
    
    export const ModelSchema = z.object({
      name: z.string().min(1, 'Required'),
  version: z.string().min(1, 'Required'),
  description: z.string().optional(),
  id: z.string().optional().default("")
    });
    
    export type ModelFormData = z.infer<typeof ModelSchema>;
      