
    import { z } from "zod";
    
    export const HiringSchema = z.object({
      user: z.string().min(1, 'Required'),
  agent: z.string().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type HiringFormData = z.infer<typeof HiringSchema>;
      