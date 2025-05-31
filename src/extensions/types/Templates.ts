import { APIinterfaceAgentResult } from "@/extensions/Templates/APIinterface/entity/APIinterfaceEntity";
import { DataSchemaAgentResult } from "@/extensions/Templates/DataSchema/entity/DataSchemaEntity";
import { MermaidAgentResult } from "@/extensions/Templates/Mermaid/entity/MermaidEntity";
import { TestCaseAgentResult } from "@/extensions/Templates/TestCase/entity/TestCaseEntity";
import { TopicAgentResult } from "@/extensions/Templates/Topic/entity/TopicEntity";
import { UserStoryAgentResult } from "@/extensions/Templates/UserStory/entity/UserStoryEntity";

export type Templates =
    | TopicAgentResult
    | UserStoryAgentResult
    | TestCaseAgentResult
    | DataSchemaAgentResult
    | MermaidAgentResult
    | APIinterfaceAgentResult;
