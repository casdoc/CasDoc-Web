import { TemplateField } from "../types/TemplateField";
import { BaseEntity } from "./BaseEntity";
import { DocumentType } from "@/app/models/enum/DocumentType";
export interface Template extends BaseEntity {
    documentType: DocumentType;
    TopicType: string;
    name: string;
    type: string;
    description: string;
    fields: TemplateField[];
}
