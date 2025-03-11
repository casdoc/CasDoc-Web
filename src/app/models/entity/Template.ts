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

    getDocumentType(): DocumentType {
        return this._documentType;
    }

    setDocumentType(value: DocumentType): void {
        this._documentType = value;
        this.updatedAt = new Date();
    }

    getTopicType(): string {
        return this._topicType;
    }

    setTopicType(value: string): void {
        if (!value.trim()) {
            throw new Error("Topic type cannot be empty.");
        }
        this._topicType = value;
        this.updatedAt = new Date();
    }

    getName(): string {
        return this._name;
    }

    setName(value: string): void {
        if (!value.trim()) {
            throw new Error("Name cannot be empty.");
        }
        this._name = value;
        this.updatedAt = new Date();
    }

    getFields(): TemplateField[] {
        return this._fields;
    }

    setFields(value: TemplateField[]): void {
        if (!Array.isArray(value)) {
            throw new Error("Fields must be an array of TemplateField.");
        }
        this._fields = value;
        this.updatedAt = new Date();
    }
}
