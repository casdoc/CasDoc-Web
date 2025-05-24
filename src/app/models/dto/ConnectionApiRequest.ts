import z from "zod";

export const ConnectionCreateSchema = z.object({
    sourceId: z.string(),
    targetId: z.string(),
    label: z.string(),
    offsetValue: z.number(),
    bidirectional: z.boolean(),
});
export type ConnectionCreate = z.infer<typeof ConnectionCreateSchema>;

export const ConnectionUpdateSchema = z.object({
    label: z.string(),
    offsetValue: z.number(),
    bidirectional: z.boolean(),
});
export type ConnectionUpdate = z.infer<typeof ConnectionUpdateSchema>;
