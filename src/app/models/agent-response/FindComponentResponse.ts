import { BaseResponse } from "./BaseResponse";

export class FindComponentResponse extends BaseResponse {
    componentIds: Array<string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: { [key: string]: any };

    constructor(data: {
        message: string;
        componentIds: Array<string>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        details?: { [key: string]: any };
    }) {
        super(data.message);
        this.componentIds = data.componentIds;
        this.details = data.details;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parse(result: any): FindComponentResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            !Array.isArray(result.componentIds)
        ) {
            throw new Error("Invalid FindComponentResponse format");
        }

        return new FindComponentResponse({
            message: result.message,
            componentIds: result.componentIds,
            details: result.details ?? undefined,
        });
    }
}
