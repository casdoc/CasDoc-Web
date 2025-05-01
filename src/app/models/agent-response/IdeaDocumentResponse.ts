import { BaseResponse } from "./BaseResponse";
import { JsonObject } from "../types/JsonObject";

export interface IdeaDocumentResponse extends BaseResponse {
    components: Array<JsonObject>;
}
