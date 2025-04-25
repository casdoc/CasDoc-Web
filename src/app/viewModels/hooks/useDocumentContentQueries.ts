import { useQuery, useQueries } from "@tanstack/react-query";
import { DocumentService } from "../../models/services/DocumentService";
import { DocumentContent } from "@/app/models/types/DocumentContent";

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

            return firstPage;
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
            queryKey: ["documentContent", documentId],
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

                return pageContent;
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
    let allContent: DocumentContent[] = [];
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
