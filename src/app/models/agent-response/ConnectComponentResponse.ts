import { BaseResponse } from "./BaseResponse";

export interface ConnectionData {
    bidirectional: boolean;
    reason: string;
}

export interface ComponentConnection {
    source: string;
    target: string;
    data: ConnectionData;
}

export class ConnectComponentResponse extends BaseResponse {
    connections: ComponentConnection[];

    constructor(data: {
        message: string;
        connections: ComponentConnection[];
    }) {
        super(data.message);
        this.connections = data.connections;
    }

    static parse(result: any): ConnectComponentResponse {
        if (
            typeof result !== "object" ||
            result === null ||
            typeof result.message !== "string" ||
            !Array.isArray(result.connections)
        ) {
            throw new Error("Invalid ConnectComponentResponse format");
        }

        for (const conn of result.connections) {
            if (
                typeof conn !== "object" ||
                typeof conn.source !== "string" ||
                typeof conn.target !== "string" ||
                typeof conn.data !== "object" ||
                typeof conn.data.bidirectional !== "boolean" ||
                typeof conn.data.reason !== "string"
            ) {
                throw new Error("Invalid connection item in ConnectComponentResponse");
            }
        }

        return new ConnectComponentResponse({
            message: result.message,
            connections: result.connections,
        });
    }
}
