import { BaseEntity } from "./BaseEntity";
export interface Project extends BaseEntity {
    name: string;
    description: string;
}
