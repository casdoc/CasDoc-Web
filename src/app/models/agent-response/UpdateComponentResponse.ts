import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export class UpdateComponentResponse extends BaseResponse {
    updatedComponent: Array<JsonObject>;
    reason: string;

    constructor(data: {
        message: string;
        updatedComponent: Array<JsonObject>;
        reason: string;
    }) {
        super(data.message);
        this.updatedComponent = data.updatedComponent;
        this.reason = data.reason;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parse(result: any): UpdateComponentResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            !Array.isArray(result.updatedComponent) ||
            typeof result.reason !== "string"
        ) {
            throw new Error("Invalid UpdateComponentResponse format");
        }

        return new UpdateComponentResponse({
            message: result.message,
            updatedComponent: result.updatedComponent,
            reason: result.reason,
        });
    }
}
