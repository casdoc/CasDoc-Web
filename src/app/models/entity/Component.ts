import { BaseEntity } from "./BaseEntity";
import { Connection } from "./Connection";
export interface Component extends BaseEntity {
    documentId: string;
    topicId: string;
    templateType: string;
    Connections: Connection[];
    Data: Record<string, unknown>;
}
