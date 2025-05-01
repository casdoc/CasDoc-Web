import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export interface CreateComponentResponse extends BaseResponse {
    createdComponents: Array<JsonObject>;
    reason: string;
}
