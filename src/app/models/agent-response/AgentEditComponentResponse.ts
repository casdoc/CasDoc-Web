import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export interface AdviceEditComponentResponse extends BaseResponse {
    editedComponent: JsonObject;
    reason: string;
}
