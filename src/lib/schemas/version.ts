
    import { z } from "zod";
    
    export const VersionSchema = z.object({
      name: z.string().min(1, 'Required'),
  description: z.string().optional(),
  project: z.string().min(1, 'Required'),
  is_active: z.boolean().optional(),
  id: z.string().optional().default("")
    });
    
    export type VersionFormData = z.infer<typeof VersionSchema>;
      