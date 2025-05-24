import { z } from "zod";

export const ProjectSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
});
export type ProjectDTO = z.infer<typeof ProjectSchema>;

export const ProjectResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: ProjectSchema,
});
export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;

export const ProjectListResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: z.array(ProjectSchema),
});
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;
