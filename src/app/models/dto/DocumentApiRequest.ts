import { DocumentType } from "@/app/models/enum/DocumentType";
import { z } from "zod";

export const DocumentCreateSchema = z.object({
    projectId: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.enum(DocumentType),
});
export type DocumentCreate = z.infer<typeof DocumentCreateSchema>;

export const DocumentUpdateSchema = z.object({
    title: z.string(),
    description: z.string(),
});
export type DocumentUpdate = z.infer<typeof DocumentUpdateSchema>;
