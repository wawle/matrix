import { z } from "zod";

export const EdgeSchema = z.object({
  version: z.string().min(1, "Required"),
  data: z.object({}),
  id: z.string().optional().default(""),
});

export type EdgeFormData = z.infer<typeof EdgeSchema>;
