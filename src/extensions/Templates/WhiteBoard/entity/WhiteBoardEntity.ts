export interface WhiteBoardInfo {
    name?: string;
    description?: string;
}

export class WhiteBoardEntity {
    info: WhiteBoardInfo;

    constructor(name?: string, description?: string) {
        this.info = {
            name: name || "System Overview",
            description: description || "A whiteboard for planning and notes.",
        };
    }

    static getDefaultConfig() {
        return {
            config: {
                info: {
                    name: "System Overview",
                    description: "A whiteboard for planning and notes.",
                },
            },
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static serializeToMarkdown = (state: any, node: any) => {
        const { config } = node.attrs;
        const info = config?.info || {};

        state.write(`### ${info.name || "Whiteboard"}\n`);

        if (info.description) {
            state.write(`- **Description** : ${info.description}\n`);
        }

        state.write(`---\n\n`);
    };

    // static convertAgentResultToEntity(result: any): any {
    //     return {
    //         type: "template-whiteBoard",
    //         attrs: {
    //             topicId: result.topicId || "root",
    //             id: result.id || Date.now().toString(),
    //             config: {
    //                 info: {
    //                     name: result.name || "White Board",
    //                     description:
    //                         result.description || "White board description",
    //                 },
    //             },
    //         },
    //     };
    // }
}
