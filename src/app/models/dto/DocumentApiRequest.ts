import { DocumentType } from "@/app/models/enum/DocumentType";
import { z } from "zod";

export const DocumentApiRequestSchema = z.object({
    projectId: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.enum(DocumentType),
});

export type DocumentApiRequest = z.infer<typeof DocumentApiRequestSchema>;
