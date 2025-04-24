import { z } from "zod";

export const ProjectApiRequestSchema = z.object({
    name: z.string(),
    description: z.string(),
});

export type ProjectApiRequest = z.infer<typeof ProjectApiRequestSchema>;
