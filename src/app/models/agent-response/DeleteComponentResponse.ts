import { BaseResponse } from "./BaseResponse";

export class DeleteComponentResponse extends BaseResponse {
    deletedComponentIds: Array<string>;
    reason: string;

    constructor(data: {
        message: string;
        deletedComponentIds: Array<string>;
        reason: string;
    }) {
        super(data.message);
        this.deletedComponentIds = data.deletedComponentIds;
        this.reason = data.reason;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parse(result: any): DeleteComponentResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            !Array.isArray(result.deletedComponentIds) ||
            typeof result.reason !== "string"
        ) {
            throw new Error("Invalid DeleteComponentResponse format");
        }

        return new DeleteComponentResponse({
            message: result.message,
            deletedComponentIds: result.deletedComponentIds,
            reason: result.reason,
        });
    }
}
