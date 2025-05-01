import { JsonObject } from "../types/JsonObject";

export interface AdviceComponent {
    shouldUpdate: boolean;
    reason: string;
    suggestion: Array<JsonObject>;
}
