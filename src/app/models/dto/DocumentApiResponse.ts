import { z } from "zod";
import { DocumentType } from "@/app/models/enum/DocumentType";

export const DocumentSchema = z.object({
    id: z.number().int(),
    projectId: z.number().int(),
    title: z.string(),
    description: z.string(),
    type: z.enum(DocumentType),
});
export type DocumentDTO = z.infer<typeof DocumentSchema>;

export const DocumentListResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: z.array(DocumentSchema),
});
export type DocumentListResponse = z.infer<typeof DocumentListResponseSchema>;

export const DocumentResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: DocumentSchema,
});
export type DocumentResponse = z.infer<typeof DocumentResponseSchema>;
