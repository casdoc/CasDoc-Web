import { BaseEntity } from "@/app/models/entity/BaseEntity";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { JsonObject } from "@/app/models/types/JsonObject";

export class Document extends BaseEntity {
    private _type: DocumentType;
    private _projectId: string;
    private _title: string;
    private _description: string;
    private _content: JsonObject[];

    constructor(
        id: string,
        createdAt: Date,
        updatedAt: Date,
        type: DocumentType,
        projectId: string,
        title: string,
        description: string,
        content: JsonObject[]
    ) {
        super(id, createdAt, updatedAt);
        this._type = type;
        this._projectId = projectId;
        this._title = title;
        this._description = description;
        this._content = content;
    }

    getType(): DocumentType {
        return this._type;
    }

    setType(value: DocumentType): void {
        this._type = value;
        this.updatedAt = new Date();
    }

    getProjectId(): string {
        return this._projectId;
    }

    setProjectId(value: string): void {
        if (!value.trim()) {
            throw new Error("Project ID cannot be empty.");
        }
        this._projectId = value;
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

    getContent(): JsonObject[] {
        return this._content;
    }

    setAllContent(value: JsonObject[]): void {
        if (!Array.isArray(value)) {
            throw new Error("Content must be an array of JsonObject.");
        }
        this._content = value;
        this.updatedAt = new Date();
    }

    getTopicById = (id: string) => {
        const topic = this._content.find((item) => item.attrs.id === id);
        return topic?.attrs;
    };
}
