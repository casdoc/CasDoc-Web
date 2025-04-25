export interface DocumentContent {
    content: Record<string, any>;
}

export interface PaginatedDocumentContent {
    totalPages: number;
    totalElements: number;
    size: number;
    content: DocumentContent[];
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}
