
    import { z } from "zod";
    
    export const FlowSchema = z.object({
      name: z.string().min(1, 'Required'),
  description: z.string().optional(),
  user: z.string().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type FlowFormData = z.infer<typeof FlowSchema>;
      