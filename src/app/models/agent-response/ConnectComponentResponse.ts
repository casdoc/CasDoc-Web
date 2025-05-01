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

export interface ConnectComponentResponse extends BaseResponse {
    connections: ComponentConnection[];
}
