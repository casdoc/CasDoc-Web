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

    getDocumentId(): string {
        return this._documentId;
    }

    setDocumentId(value: string): void {
        if (!value.trim()) {
            throw new Error("Document ID cannot be empty.");
        }
        this._documentId = value;
        this.updatedAt = new Date();
    }

    getDocumentType(): DocumentType {
        return this._documentType;
    }

    setDocumentType(value: DocumentType): void {
        this._documentType = value;
        this.updatedAt = new Date();
    }

    getName(): string {
        return this._name;
    }

    setType(value: string): void {
        if (!value.trim()) {
            throw new Error("Type cannot be empty.");
        }
        this._name = value;
        this.updatedAt = new Date();
    }

    getDescription(): string {
        return this._description;
    }

    setDescription(value: string): void {
        this._description = value;
        this.updatedAt = new Date();
    }
}
