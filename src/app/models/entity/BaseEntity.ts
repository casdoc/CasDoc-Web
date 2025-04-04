export class BaseEntity {
    public readonly id: string;
    _createdAt: Date;
    _updatedAt: Date;

    constructor(id: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }
}
