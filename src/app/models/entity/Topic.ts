import { DocumentType } from "@/app/models/enum/DocumentType";
import { BaseEntity } from "@/app/models/entity/BaseEntity";

export class Topic extends BaseEntity {
    private _documentId: string;
    private _documentType: DocumentType;
    private _name: string;
    private _description: string;

    constructor(
        id: string,
        createdAt: Date,
        updatedAt: Date,
        documentId: string,
        documentType: DocumentType,
        name: string,
        description: string
    ) {
        super(id, createdAt, updatedAt);
        this._documentId = documentId;
        this._documentType = documentType;
        this._name = name;
        this._description = description;
    }

    get documentId(): string {
        return this._documentId;
    }

    set documentId(value: string) {
        if (!value.trim()) {
            throw new Error("Document ID cannot be empty.");
        }
        this._documentId = value;
        this._updatedAt = new Date();
    }

    get documentType(): DocumentType {
        return this._documentType;
    }

    set documentType(value: DocumentType) {
        this._documentType = value;
        this._updatedAt = new Date();
    }

    get name(): string {
        return this._name;
    }

    set type(value: string) {
        if (!value.trim()) {
            throw new Error("Type cannot be empty.");
        }
        this._name = value;
        this._updatedAt = new Date();
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
        this._updatedAt = new Date();
    }
}
