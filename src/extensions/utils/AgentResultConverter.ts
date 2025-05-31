import { TestCaseEntity } from "@/extensions/Templates/TestCase/entity/TestCaseEntity";
import { UserStoryEntity } from "@/extensions/Templates/UserStory/entity/UserStoryEntity";
import { DataSchemaEntity } from "@/extensions/Templates/DataSchema/entity/DataSchemaEntity";
import { MermaidEntity } from "@/extensions/Templates/Mermaid/entity/MermaidEntity";
import { APIinterfaceEntity } from "../Templates/APIinterface/entity/APIinterfaceEntity";
import { TopicEntity } from "../Templates/Topic/entity/TopicEntity";

export class AgentResultConverter {
    // Tool name to entity converter mapping
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static readonly converterMap: Record<string, (result: any) => any> =
        {
            create_test_case: TestCaseEntity.convertAgentResultToTiptapNode,
            create_user_story: UserStoryEntity.convertAgentResultToTiptapNode,
            create_data_schema: DataSchemaEntity.convertAgentResultToTiptapNode,
            create_mermaid_diagram:
                MermaidEntity.convertAgentResultToTiptapNode,
            create_api_interface:
                APIinterfaceEntity.convertAgentResultToTiptapNode,
            create_topic: TopicEntity.convertAgentResultToTiptapNode,
        };

    /**
     * Convert agent result to TipTap component attributes based on tool name
     * @param toolName The tool name from the agent response
     * @param result The result data from the agent
     * @returns Converted TipTap component attributes or null if unsupported
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static convertToTipTapAttrs(toolName: string, result: any): any | null {
        // Use entity converter for supported tools
        const converter = this.converterMap[toolName];
        if (converter) {
            return converter(result);
        }
        console.warn("Unknown tool name for conversion:", toolName);
        return null;
    }

    /**
     * Check if a tool name is supported
     * @param toolName The tool name to check
     * @returns True if supported, false otherwise
     */
    static isSupported(toolName: string): boolean {
        return (
            toolName === "create_topic" ||
            toolName === "create_api_interface" ||
            toolName in this.converterMap
        );
    }

    /**
     * Get all supported tool names
     * @returns Array of supported tool names
     */
    static getSupportedToolNames(): string[] {
        return [
            "create_topic",
            "create_api_interface",
            ...Object.keys(this.converterMap),
        ];
    }
}
