
    import { z } from "zod";
    
    export const UserSchema = z.object({
      fullname: z.string().min(1, 'Required'),
  email: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  photo: z.string().optional(),
  role: z.string().min(1, 'Required').default("user"),
  id: z.string().optional().default("")
    });
    
    export type UserFormData = z.infer<typeof UserSchema>;
      