import { BaseResponse } from "./BaseResponse";

export class SummaryResponse extends BaseResponse {
    component_ids: string[];
    summary: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: { [key: string]: any };

    constructor(data: {
        message: string;
        component_ids: string[];
        summary: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        details?: { [key: string]: any };
    }) {
        super(data.message);
        this.component_ids = data.component_ids;
        this.summary = data.summary;
        this.details = data.details;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parse(result: any): SummaryResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            !Array.isArray(result.component_ids) ||
            typeof result.summary !== "string"
        ) {
            throw new Error("Invalid SummaryResponse format");
        }

        return new SummaryResponse({
            message: result.message,
            component_ids: result.component_ids,
            summary: result.summary,
            details: result.details ?? undefined,
        });
    }
}
