import { BaseResponse } from "./BaseResponse";

export interface PromptGenerationResponse extends BaseResponse {
    prompt: string;
}
