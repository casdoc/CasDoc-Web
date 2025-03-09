import { BaseEntity } from "@/app/models/entity/BaseEntity";
import { Connection } from "@/app/models/types/Connection";
import { JsonObject } from "../types/JsonObject";
export class Component extends BaseEntity {
    private _documentId: string;
    private _topicType: string;
    private _templateType: string;
    private _connections: Connection[];
    private _content: JsonObject;

    constructor(
        id: string,
        createdAt: Date,
        updatedAt: Date,
        documentId: string,
        topicType: string,
        templateType: string,
        connections: Connection[],
        content: JsonObject
    ) {
        super(id, createdAt, updatedAt);
        this._documentId = documentId;
        this._topicType = topicType;
        this._templateType = templateType;
        this._connections = connections;
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

    getConnections(): Connection[] {
        return this._connections;
    }

    addConnection(value: Connection): void {
        if (!value) {
            throw new Error("Connection cannot be null or undefined.");
        }
        this._connections.push(value);
        this.updatedAt = new Date();
    }

    deleteConnection(value: Connection): void {
        const index = this._connections.indexOf(value);
        if (index !== -1) {
            this._connections.splice(index, 1);
            this.updatedAt = new Date();
        } else {
            throw new Error("Connection not found.");
        }
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
