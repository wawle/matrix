
    import { z } from "zod";
    
    export const AgentSchema = z.object({
      instructions: z.string().min(1, 'Required'),
  stream: z.boolean().optional(),
  model_provider: z.string().min(1, 'Required'),
  model_name: z.string().min(1, 'Required'),
  max_tokens: z.number().optional().default("2000"),
  temperature: z.number().optional().default("0.1"),
  seed: z.number().optional().default("1"),
  name: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  is_public: z.boolean().optional().default(""),
  photo: z.string().optional(),
  key: z.string().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type AgentFormData = z.infer<typeof AgentSchema>;
      