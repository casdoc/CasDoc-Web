import { FieldType } from "../enum/FieldType";

export interface TemplateField {
    key: string;
    type: FieldType;
    label: string;
    required: boolean;
    defaultValue?: string;
    options?: string[];
}
