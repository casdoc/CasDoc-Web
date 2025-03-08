import { BaseEntity } from "@/app/models/entity/BaseEntity";
import { FieldType } from "../enum/FieldType";
export interface TemplateField extends BaseEntity {
    key: string;
    type: FieldType;
    label: string;
    required: boolean;
    defaultValue?: string;
    options?: string[];
}
