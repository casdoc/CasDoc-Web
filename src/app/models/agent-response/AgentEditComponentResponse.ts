import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export class AgentEditComponentResponse extends BaseResponse {
    editedComponent: JsonObject;
    reason: string;

    constructor(data: {
        message: string;
        editedComponent: JsonObject;
        reason: string;
    }) {
        super(data.message);
        this.editedComponent = data.editedComponent;
        this.reason = data.reason;
    }

    static parse(result: any): AgentEditComponentResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            typeof result.editedComponent !== "object" ||
            typeof result.reason !== "string"
        ) {
            throw new Error("Invalid AgentEditComponentResponse format");
        }

        return new AgentEditComponentResponse({
            message: result.message,
            editedComponent: result.editedComponent,
            reason: result.reason,
        });
    }
}
