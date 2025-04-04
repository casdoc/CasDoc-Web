export class BaseEntity {
    _id: string;
    _createdAt: Date;
    _updatedAt: Date;

    constructor(id: string, createdAt: Date, updatedAt: Date) {
        this._id = id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id(): string {
        return this._id;
    }
}
