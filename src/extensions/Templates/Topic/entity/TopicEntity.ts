import { uuidv4 } from "zod";

export interface TopicInfo {
    name?: string;
    description?: string;
}

export interface TopicAgentResult {
    id: string;
    type: string;
    documentId: string;
    topicId?: string;
    level: number;
    name: string;
    description?: string;
}

export class TopicEntity {
    info: TopicInfo;
    documentId: string;
    level: string;

    constructor(
        name?: string,
        description?: string,
        documentId?: string,
        level?: string
    ) {
        this.info = {
            name: name || "Topic",
            description: description || "This is a topic description",
        };
        this.documentId = documentId || "default-document";
        this.level = level || "1";
    }

    static getDefaultConfig() {
        return {
            info: {
                name: "Topic",
                description: "This is a topic description",
            },
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static serializeToMarkdown = (state: any, node: any) => {
        const { config } = node.attrs;
        const name = config?.info?.name || "Unknown";
        const description = config?.info?.description || "";

        state.write(`## ${name}\n`);
        state.write(`${description}\n`);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static convertAgentResultToTiptapNode(result: TopicAgentResult): any {
        return {
            type: "topic",
            attrs: {
                topicId: result.topicId || "root",
                id: result.id || uuidv4(),
                documentId: result.documentId || "default-document",
                level: result.level || "1",
                config: {
                    info: {
                        name: result.name || "Topic",
                        description: result.description || "Topic description",
                    },
                },
            },
        };
    }

    getLevelStyle(): string {
        switch (this.level) {
            case "1":
                return "text-2xl";
            case "2":
                return "text-xl";
            case "3":
                return "text-lg";
            default:
                return "text-base";
        }
    }

    getBorderColor(): string {
        switch (this.level) {
            case "1":
                return "border-indigo-400";
            case "2":
                return "border-sky-400";
            case "3":
                return "border-teal-400";
            default:
                return "border-gray-400";
        }
    }

    getMarginLeft(): string {
        switch (this.level) {
            case "2":
                return "ml-8";
            case "3":
                return "ml-10";
            default:
                return "ml-0";
        }
    }
}
