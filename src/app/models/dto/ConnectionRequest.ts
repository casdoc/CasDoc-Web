import z from "zod";

export const ConnectionApiRequestSchema = z.object({
    sourceId: z.string(),
    targetId: z.string(),
    label: z.string(),
    offsetValue: z.number(),
    bidirectional: z.boolean(),
});

export type ConnectionApiRequest = z.infer<typeof ConnectionApiRequestSchema>;
