import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export class CreateComponentResponse extends BaseResponse {
    createdComponents: Array<JsonObject>;
    reason: string;

    constructor(data: {
        message: string;
        createdComponents: Array<JsonObject>;
        reason: string;
    }) {
        super(data.message);
        this.createdComponents = data.createdComponents;
        this.reason = data.reason;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parse(result: any): CreateComponentResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            !Array.isArray(result.createdComponents) ||
            typeof result.reason !== "string"
        ) {
            throw new Error("Invalid CreateComponentResponse format");
        }

        return new CreateComponentResponse({
            message: result.message,
            createdComponents: result.createdComponents,
            reason: result.reason,
        });
    }
}
