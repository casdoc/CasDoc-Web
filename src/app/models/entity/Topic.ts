import { DocumentType } from "@/app/models/enum/DocumentType";
import { BaseEntity } from "@/app/models/entity/BaseEntity";

export class Topic extends BaseEntity {
    private _documentId: string;
    private _documentType: DocumentType;
    private _type: string;
    private _title: string;
    private _description: string;
    private _sortOrder: number;

    constructor(
        id: string,
        createdAt: Date,
        updatedAt: Date,
        documentId: string,
        documentType: DocumentType,
        type: string,
        title: string,
        description: string,
        sortOrder: number
    ) {
        super(id, createdAt, updatedAt);
        this._documentId = documentId;
        this._documentType = documentType;
        this._type = type;
        this._title = title;
        this._description = description;
        this._sortOrder = sortOrder;
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

    getType(): string {
        return this._type;
    }

    setType(value: string): void {
        if (!value.trim()) {
            throw new Error("Type cannot be empty.");
        }
        this._type = value;
        this.updatedAt = new Date();
    }

    getTitle(): string {
        return this._title;
    }

    setTitle(value: string): void {
        if (!value.trim()) {
            throw new Error("Title cannot be empty.");
        }
        this._title = value;
        this.updatedAt = new Date();
    }

    getDescription(): string {
        return this._description;
    }

    setDescription(value: string): void {
        this._description = value;
        this.updatedAt = new Date();
    }

    getSortOrder(): number {
        return this._sortOrder;
    }

    setSortOrder(value: number): void {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("Sort order must be a non-negative integer.");
        }
        this._sortOrder = value;
        this.updatedAt = new Date();
    }
}
