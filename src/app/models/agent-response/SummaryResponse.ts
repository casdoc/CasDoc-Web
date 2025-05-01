import { BaseResponse } from "./BaseResponse";

export interface SummaryResponse extends BaseResponse {
    component_ids: string[];
    summary: string;
    details?: { [key: string]: any };
}
