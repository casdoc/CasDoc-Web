import { DocumentType } from "@/app/models/enum/DocumentType";

export interface DocumentUpdate {
    title: string;
    description: string;
    type: DocumentType;
}
