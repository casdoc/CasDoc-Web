import { BaseEntity } from "./BaseEntity";
export interface EdgeData {
    offsetValue: number;
    bidirectional: boolean;
}
export class ConnectionEdge extends BaseEntity {
    private _projectId: string;
    private _source: string;
    private _target: string;
    private _label: string;
    private _data: EdgeData;

    constructor(
        id: string,
        projectId: string,
        source: string,
        target: string,
        label: string,
        offsetValue: number,
        bidirectional: boolean
    ) {
        super(id);
        this._projectId = projectId;
        this._source = source;
        this._target = target;
        this._label = label;
        this._data = {
            offsetValue: offsetValue,
            bidirectional: bidirectional,
        };
    }

    static fromObject(obj: {
        id: number;
        projectId: number;
        sourceId: string;
        targetId: string;
        label: string;
        offsetValue: number;
        bidirectional: boolean;
    }): ConnectionEdge {
        return new ConnectionEdge(
            obj.id.toString(),
            obj.projectId.toString(),
            obj.sourceId,
            obj.targetId,
            obj.label,
            obj.offsetValue,
            obj.bidirectional
        );
    }

    get projectId(): string {
        return this._projectId;
    }

    get source(): string {
        return this._source;
    }

    get target(): string {
        return this._target;
    }

    get label(): string {
        return this._label;
    }

    get offsetValue(): number {
        return this._data.offsetValue;
    }

    get bidirectional(): boolean {
        return this._data.bidirectional;
    }

    set projectId(value: string) {
        this._projectId = value;
    }

    set source(value: string) {
        this._source = value;
    }

    set target(value: string) {
        this._target = value;
    }

    set label(value: string) {
        this._label = value;
    }

    set offsetValue(value: number) {
        this._data.offsetValue = value;
    }

    set bidirectional(value: boolean) {
        this._data.bidirectional = value;
    }
}
