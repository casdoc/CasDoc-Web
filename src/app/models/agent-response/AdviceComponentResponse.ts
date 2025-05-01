import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export interface AdviceComponentResponse extends BaseResponse {
    shouldUpdate: boolean;
    reason: string;
    suggestion: Array<JsonObject>;
}
