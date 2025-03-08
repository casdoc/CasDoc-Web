import { BaseEntity } from "./BaseEntity";
export interface Connection extends BaseEntity {
    targetId: string;
    label: string;
}
