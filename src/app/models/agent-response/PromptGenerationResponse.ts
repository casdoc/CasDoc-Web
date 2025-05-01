import { BaseResponse } from "./BaseResponse";

export class PromptGenerationResponse extends BaseResponse {
    prompt: string;

    constructor(data: {
        message: string;
        prompt: string;
    }) {
        super(data.message);
        this.prompt = data.prompt;
    }

    static parse(result: any): PromptGenerationResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            typeof result.prompt !== "string"
        ) {
            throw new Error("Invalid PromptGenerationResponse format");
        }

        return new PromptGenerationResponse({
            message: result.message,
            prompt: result.prompt,
        });
    }
}
