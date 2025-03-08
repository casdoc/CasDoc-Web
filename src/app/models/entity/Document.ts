import { BaseEntity } from "./BaseEntity";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { JsonObject } from "@/app/models/types/JsonObject";
export interface Document extends BaseEntity {
    type: DocumentType;
    projectId: string;
    title: string;
    description: string;
    content: JsonObject[];
}
