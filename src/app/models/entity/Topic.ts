import { BaseEntity } from "./BaseEntity";
import { DocumentType } from "@/app/models/enum/DocumentType";
export interface Topic extends BaseEntity {
    documentId: string;
    documentType: DocumentType;
    type: string;
    title: string;
    description: string;
    sortOrder: number;
}
