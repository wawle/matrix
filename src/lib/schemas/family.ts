
    import { z } from "zod";
    
    export const FamilySchema = z.object({
      agent: z.string().min(1, 'Required'),
  parent: z.string().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type FamilyFormData = z.infer<typeof FamilySchema>;
      