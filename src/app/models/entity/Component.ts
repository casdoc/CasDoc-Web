import { BaseEntity } from "@/app/models/entity/BaseEntity";
import { JsonObject } from "../types/JsonObject";
export class Component extends BaseEntity {
    private _documentId: string;
    private _topicId: string;
    private _templateType: string;
    private _name: string;
    private _content: JsonObject;

    constructor(
        id: string,
        createdAt: Date,
        updatedAt: Date,
        documentId: string,
        topicId: string,
        templateType: string,
        name: string,
        content: JsonObject
    ) {
        super(id, createdAt, updatedAt);
        this._documentId = documentId;
        this._topicId = topicId;
        this._templateType = templateType;
        this._name = name;
        this._content = content;
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

    getTopicId(): string {
        return this._topicId;
    }

    setTopicId(value: string): void {
        if (!value.trim()) {
            throw new Error("Topic type cannot be empty.");
        }
        this._topicId = value;
        this.updatedAt = new Date();
    }

    getTemplateType(): string {
        return this._templateType;
    }

    setTemplateType(value: string): void {
        if (!value.trim()) {
            throw new Error("Template type cannot be empty.");
        }
        this._templateType = value;
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

    getContent(): JsonObject {
        return this._content;
    }

    setData(value: JsonObject): void {
        if (!Array.isArray(value)) {
            throw new Error("Data must be an array of JsonObject.");
        }
        this._content = value;
        this.updatedAt = new Date();
    }
}
