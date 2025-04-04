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

    get type(): DocumentType {
        return this._type;
    }

    set type(value: DocumentType) {
        this._type = value;
        this._updatedAt = new Date();
    }

    get projectId(): string {
        return this._projectId;
    }

    set projectId(value: string) {
        if (!value.trim()) {
            throw new Error("Project ID cannot be empty.");
        }
        this._projectId = value;
        this._updatedAt = new Date();
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        if (!value.trim()) {
            throw new Error("Title cannot be empty.");
        }
        this._title = value;
        this._updatedAt = new Date();
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
        this._updatedAt = new Date();
    }

    get content(): JsonObject[] {
        return this._content;
    }

    set content(value: JsonObject[]) {
        if (!Array.isArray(value)) {
            throw new Error("Content must be an array of JsonObject.");
        }
        this._content = value;
        this._updatedAt = new Date();
    }

    getTopicById = (id: string) => {
        const topic = this._content.find((item) => item.attrs?.id === id);
        return topic?.attrs;
    };
}
