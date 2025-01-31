
    import { z } from "zod";
    
    export const FlowStepSchema = z.object({
      flow: z.string().min(1, 'Required'),
  agent: z.string().min(1, 'Required'),
  order: z.number().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type FlowStepFormData = z.infer<typeof FlowStepSchema>;
      