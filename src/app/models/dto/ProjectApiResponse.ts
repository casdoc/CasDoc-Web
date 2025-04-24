import { z } from "zod";

export const ProjectItemSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string().nullish(),
});

export const ProjectListResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: z.array(ProjectItemSchema),
});

export const ProjectResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: ProjectItemSchema,
});

export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;
export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;
