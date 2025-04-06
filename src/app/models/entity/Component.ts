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

    get topicId(): string {
        return this._topicId;
    }

    set topicId(value: string) {
        if (!value.trim()) {
            throw new Error("Topic type cannot be empty.");
        }
        this._topicId = value;
        this._updatedAt = new Date();
    }

    get templateType(): string {
        return this._templateType;
    }

    set templateType(value: string) {
        if (!value.trim()) {
            throw new Error("Template type cannot be empty.");
        }
        this._templateType = value;
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

    get content(): JsonObject {
        return this._content;
    }

    set data(value: JsonObject) {
        if (!Array.isArray(value)) {
            throw new Error("Data must be an array of JsonObject.");
        }
        this._content = value;
        this._updatedAt = new Date();
    }
}
