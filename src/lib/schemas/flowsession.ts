
    import { z } from "zod";
    
    export const FlowSessionSchema = z.object({
      flow: z.string().min(1, 'Required'),
  session: z.string().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type FlowSessionFormData = z.infer<typeof FlowSessionSchema>;
      