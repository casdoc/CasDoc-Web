import { BaseEntity } from "@/app/models/entity/BaseEntity";

export class Project extends BaseEntity {
    private _name: string;
    private _description: string;

    constructor(
        id: string,
        createdAt: Date,
        updatedAt: Date,
        name: string,
        description: string
    ) {
        super(id, createdAt, updatedAt);
        this._name = name;
        this._description = description;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        if (value.trim().length === 0) {
            throw new Error("Name cannot be empty.");
        }
        this._name = value;
        this.updatedAt = new Date();
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        if (value.length > 500) {
            throw new Error("Description is too long (max 500 characters).");
        }
        this._description = value;
        this.updatedAt = new Date();
    }
}
