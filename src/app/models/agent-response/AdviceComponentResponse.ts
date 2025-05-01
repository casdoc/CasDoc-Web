import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export class AdviceComponentResponse extends BaseResponse {
    shouldUpdate: boolean;
    reason: string;
    suggestion?: Array<JsonObject>;

    constructor(data: {
        message: string;
        shouldUpdate: boolean;
        reason: string;
        suggestion?: Array<JsonObject>;
    }) {
        super(data.message);
        this.shouldUpdate = data.shouldUpdate;
        this.reason = data.reason;
        this.suggestion = data.suggestion;
    }

    static parse(result: any): AdviceComponentResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            typeof result.shouldUpdate !== "boolean" ||
            typeof result.reason !== "string"
        ) {
            throw new Error("Invalid AdviceComponentResponse format");
        }

        return new AdviceComponentResponse({
            message: result.message,
            shouldUpdate: result.shouldUpdate,
            reason: result.reason,
            suggestion: result.suggestion ?? [],
        });
    }
}
