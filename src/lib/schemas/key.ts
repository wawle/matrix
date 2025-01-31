
    import { z } from "zod";
    
    export const KeySchema = z.object({
      name: z.string().min(1, 'Required'),
  description: z.string().optional(),
  value: z.string().min(1, 'Required'),
  type: z.string().optional().default("default"),
  user: z.string().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type KeyFormData = z.infer<typeof KeySchema>;
      