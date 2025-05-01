import { BaseResponse } from "./BaseResponse";

export interface DeleteComponentResponse extends BaseResponse {
    deletedComponentIds: Array<string>;
    reason: string;
}
