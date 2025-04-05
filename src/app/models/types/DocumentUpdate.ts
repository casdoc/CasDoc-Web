import { DocumentType } from "@/app/models/enum/DocumentType";

export interface DocumentUpdate {
    projectId: string;
    title: string;
    description: string;
    type: DocumentType;
}
