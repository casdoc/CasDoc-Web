import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export interface DeleteComponent extends BaseResponse {
    updatedComponent: Array<JsonObject>;
    reason: string;
}
