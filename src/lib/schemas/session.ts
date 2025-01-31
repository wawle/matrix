
    import { z } from "zod";
    
    export const SessionSchema = z.object({
      agent: z.string().min(1, 'Required'),
  user: z.string().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type SessionFormData = z.infer<typeof SessionSchema>;
      