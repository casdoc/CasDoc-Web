import { z } from "zod";

export const ConnectionSchema = z.object({
    id: z.number().int(),
    projectId: z.number().int(),
    sourceId: z.string(),
    targetId: z.string(),
    label: z.string(),
    offsetValue: z.number(),
    bidirectional: z.boolean(),
});
export type ConnectionDTO = z.infer<typeof ConnectionSchema>;

export const ConnectionResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: ConnectionSchema,
});
export type ConnectionResponse = z.infer<typeof ConnectionResponseSchema>;

export const ConnectionListResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: z.array(ConnectionSchema),
});
export type ConnectionListResponse = z.infer<
    typeof ConnectionListResponseSchema
>;
