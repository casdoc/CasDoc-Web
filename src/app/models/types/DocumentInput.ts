import { DocumentType } from "@/app/models/enum/DocumentType";
import { JsonObject } from "./JsonObject";

export interface DocumentInput {
    projectId: string;
    title: string;
    description: string;
    type: DocumentType;
    content?: JsonObject[];
}
