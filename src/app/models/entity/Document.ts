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
        type: DocumentType,
        projectId: string,
        title: string,
        description: string,
        content: JsonObject[]
    ) {
        super(id);
        this._type = type;
        this._projectId = projectId;
        this._title = title;
        this._description = description;
        this._content = content;
    }

    static fromObject(obj: {
        id: number;
        type: DocumentType;
        projectId: number;
        title: string;
        description: string;
        content: JsonObject[];
    }): Document {
        return new Document(
            obj.id.toString(),
            obj.type,
            obj.projectId.toString(),
            obj.title,
            obj.description,
            obj.content
        );
    }

    get type(): DocumentType {
        return this._type;
    }

    set type(value: DocumentType) {
        this._type = value;
    }

    get projectId(): string {
        return this._projectId;
    }

    set projectId(value: string) {
        this._projectId = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        if (!value.trim()) {
            throw new Error("Title cannot be empty.");
        }
        this._title = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get content(): JsonObject[] {
        return this._content;
    }
    set content(value: JsonObject[]) {
        this._content = value;
    }
}
