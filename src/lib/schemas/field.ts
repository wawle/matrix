
    import { z } from "zod";
    
    export const FieldSchema = z.object({
      name: z.string().min(1, 'Required'),
  label: z.string().min(1, 'Required'),
  type: z.string().min(1, 'Required'),
  validations: z.object({}).optional(),
  id: z.string().optional().default("")
    });
    
    export type FieldFormData = z.infer<typeof FieldSchema>;
      