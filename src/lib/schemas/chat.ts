
    import { z } from "zod";
    
    export const ChatSchema = z.object({
      sender: z.string().min(1, 'Required'),
  message: z.string().min(1, 'Required'),
  session: z.string().min(1, 'Required'),
  id: z.string().optional().default("")
    });
    
    export type ChatFormData = z.infer<typeof ChatSchema>;
      