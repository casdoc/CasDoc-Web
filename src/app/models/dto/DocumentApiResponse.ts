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

export const DocumentBlockContentSchema = z.record(z.string(), z.any());

export type DocumentBlockContent = z.infer<typeof DocumentBlockContentSchema>;

export const DocumentBlockSchema = z.object({
    id: z.number(),
    content: DocumentBlockContentSchema,
});

export const BlocksResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: DocumentBlockSchema,
});
export type BlockResponse = z.infer<typeof BlocksResponseSchema>;

export const DocumentBlocksResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        totalPages: z.number(),
        totalElements: z.number(),
        size: z.number(),
        content: z.array(DocumentBlockSchema),
        number: z.number(),
        sort: z.object({
            empty: z.boolean(),
            sorted: z.boolean(),
            unsorted: z.boolean(),
        }),
        first: z.boolean(),
        last: z.boolean(),
        numberOfElements: z.number(),
        pageable: z.object({
            offset: z.number(),
            sort: z.object({
                empty: z.boolean(),
                sorted: z.boolean(),
                unsorted: z.boolean(),
            }),
            pageSize: z.number(),
            paged: z.boolean(),
            pageNumber: z.number(),
            unpaged: z.boolean(),
        }),
        empty: z.boolean(),
    }),
});

export type DocumentBlocksResponse = z.infer<
    typeof DocumentBlocksResponseSchema
>;

// Add schema for the position update response
export const UpdateBlockPositionsResponseSchema = z.object({
    status: z.number().int(),
    message: z.string(),
    data: z.boolean(), // Assuming the API returns true on success
});
export type UpdateBlockPositionsResponse = z.infer<
    typeof UpdateBlockPositionsResponseSchema
>;
