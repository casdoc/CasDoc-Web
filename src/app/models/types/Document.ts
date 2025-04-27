import { DocumentType } from "@/app/models/enum/DocumentType";

export interface Document {
    id: string;
    projectId: string;
    title: string;
    description: string;
    type: DocumentType;
}
