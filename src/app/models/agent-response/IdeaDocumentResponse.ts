import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export class IdeaDocumentResponse extends BaseResponse {
    components: Array<JsonObject>;

    constructor(data: { message: string; components: Array<JsonObject> }) {
        super(data.message);
        this.components = data.components;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parse(result: any): IdeaDocumentResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            !Array.isArray(result.components)
        ) {
            throw new Error("Invalid IdeaDocumentResponse format");
        }

        return new IdeaDocumentResponse({
            message: result.message,
            components: result.components,
        });
    }
}
