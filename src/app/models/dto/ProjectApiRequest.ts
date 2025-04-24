import { z } from "zod";

export const ProjectApiRequestSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});

export type ProjectApiRequest = z.infer<typeof ProjectApiRequestSchema>;
