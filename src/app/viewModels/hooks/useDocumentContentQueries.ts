import { useQuery, useQueries } from "@tanstack/react-query";
import { DocumentService } from "../../models/services/DocumentService";
import {
    DocumentBlockContent,
    DocumentBlocksResponse,
} from "@/app/models/dto/DocumentApiResponse";

// Replace inner id with outer id
const transformContent = (pageData: DocumentBlocksResponse | undefined) => {
    if (!pageData) return pageData;
    const blockPostList: number[] = [];
    const transformedContent = pageData.data.content.map((item) => {
        if (item.content && item.content.attrs) {
            blockPostList.push(item.id);
            return {
                ...item,
                content: {
                    ...item.content,
                    attrs: {
                        ...item.content.attrs,
                        id: item.id,
                    },
                },
            };
        }
        return item;
    });

    return {
        ...pageData,
        data: {
            ...pageData.data,
            content: transformedContent,
        },
    };
};

export const useDocumentContentQueries = (
    documentId: string,
    isEnabled = true
) => {
    // First query to get the first page and determine total pages
    const initialQuery = useQuery({
        queryKey: ["documentContent", documentId, 0],
        queryFn: async () => {
            const firstPage = await DocumentService.fetchDocumentContent(
                documentId,
                0,
                5
            );

            if (!firstPage) {
                throw new Error(
                    `Failed to fetch initial content for document ${documentId}`
                );
            }

            // Transform the content
            const transformedPage = transformContent(firstPage);
            if (!transformedPage) {
                throw new Error(
                    `Failed to transform initial content for document ${documentId}`
                );
            }

            return transformedPage.data;
        },
        enabled: isEnabled && !!documentId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // After getting first page, create parallel queries for all remaining pages
    const pageQueries = useQueries({
        queries: Array.from({
            length: initialQuery.data?.totalPages
                ? initialQuery.data.totalPages - 1
                : 0,
        }).map((_, index) => ({
            queryKey: ["documentContent", documentId, index + 1],
            queryFn: async () => {
                const pageContent = await DocumentService.fetchDocumentContent(
                    documentId,
                    index + 1, // Start from page 1 (page 0 is already fetched)
                    5
                );

                if (!pageContent) {
                    throw new Error(
                        `Failed to fetch content for document ${documentId} at page ${
                            index + 1
                        }`
                    );
                }

                // Transform the content
                const transformedPage = transformContent(pageContent);
                if (!transformedPage) {
                    throw new Error(
                        `Failed to transform initial content for document ${documentId}`
                    );
                }
                return transformedPage.data;
            },
            enabled:
                !!initialQuery.data?.totalPages && isEnabled && !!documentId,
            staleTime: 5 * 60 * 1000,
        })),
    });

    // Combine results from all queries
    const isLoading =
        initialQuery.isLoading || pageQueries.some((query) => query.isLoading);
    const isError =
        initialQuery.isError || pageQueries.some((query) => query.isError);
    const error =
        initialQuery.error || pageQueries.find((query) => query.error)?.error;

    // Combine all content when everything is loaded
    let allContent: DocumentBlockContent[] = [];
    if (initialQuery.data && !isLoading && !isError) {
        allContent = [
            ...initialQuery.data.content.flatMap((block) => block.content),
        ];
        pageQueries.forEach((query) => {
            if (query.data) {
                allContent = [
                    ...allContent,
                    ...query.data.content.flatMap((block) => block.content),
                ];
            }
        });
    }

    return {
        data: allContent.length > 0 ? { allContent, documentId } : undefined,
        isLoading,
        isError,
        error,
        isSuccess:
            !isLoading &&
            !isError &&
            initialQuery.isSuccess &&
            pageQueries.every((query) => query.isSuccess || !query.error),
    };
};
