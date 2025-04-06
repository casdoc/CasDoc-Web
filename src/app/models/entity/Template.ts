import { TemplateField } from "@/app/models/types/TemplateField";
import { BaseEntity } from "@/app/models/entity/BaseEntity";
import { DocumentType } from "@/app/models/enum/DocumentType";

export class Template extends BaseEntity {
    private _documentType: DocumentType;
    private _topicType: string;
    private _name: string;
    private _fields: TemplateField[];

    constructor(
        id: string,
        createdAt: Date,
        updatedAt: Date,
        documentType: DocumentType,
        topicType: string,
        name: string,
        fields: TemplateField[]
    ) {
        super(id, createdAt, updatedAt);
        this._documentType = documentType;
        this._topicType = topicType;
        this._name = name;
        this._fields = fields;
    }

    get documentType(): DocumentType {
        return this._documentType;
    }

    set documentType(value: DocumentType) {
        this._documentType = value;
        this._updatedAt = new Date();
    }

    get topicType(): string {
        return this._topicType;
    }

    set topicType(value: string) {
        if (!value.trim()) {
            throw new Error("Topic type cannot be empty.");
        }
        this._topicType = value;
        this._updatedAt = new Date();
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        if (!value.trim()) {
            throw new Error("Name cannot be empty.");
        }
        this._name = value;
        this._updatedAt = new Date();
    }

    get fields(): TemplateField[] {
        return this._fields;
    }

    set fields(value: TemplateField[]) {
        if (!Array.isArray(value)) {
            throw new Error("Fields must be an array of TemplateField.");
        }
        this._fields = value;
        this._updatedAt = new Date();
    }
}
