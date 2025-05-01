import { BaseResponse } from "./BaseResponse";

export interface FindComponentResponse extends BaseResponse {
    componentIds: Array<string>;
    details?: { [key: string]: any };
}