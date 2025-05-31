export interface APIinterfaceParameter {
    name: string;
    type?: string;
    required: boolean;
    description?: string;
}

export interface APIinterfaceInfo {
    method: string;
    name: string;
    description?: string;
    endPoint?: string;
}

export interface APIinterfaceAgentResult {
    id: string;
    type: string;
    topicId?: string;
    name: string;
    description?: string;
    method: string;
    endPoint: string;
    fields?: APIinterfaceParameter[];
}

export class APIinterfaceEntity {
    public info: APIinterfaceInfo;
    public fields: APIinterfaceParameter[];
    public fieldKey: string;

    constructor(
        method?: string,
        name?: string,
        description?: string,
        endPoint?: string,
        fields?: APIinterfaceParameter[],
        fieldKey?: string
    ) {
        this.info = {
            method: method || "UNKOWN",
            name: name || "API Name",
            description: description || "This is a api interface description",
            endPoint: endPoint || "/api/v1/demo",
        };
        this.fields = fields || APIinterfaceEntity.getDefaultFields();
        this.fieldKey = fieldKey || "description";
    }

    static getDefaultInfo(): APIinterfaceInfo {
        return {
            name: "API name",
            method: "GET",
            description: "This is a api interface description",
            endPoint: "/api/v1/demo",
        };
    }

    static getDefaultFields(): APIinterfaceParameter[] {
        return [
            {
                name: "id",
                type: "string",
                required: true,
                description: "Unique identifier for the resource",
            },
        ];
    }

    static getDefaultConfig() {
        return {
            info: APIinterfaceEntity.getDefaultInfo(),
            fields: APIinterfaceEntity.getDefaultFields(),
            fieldKey: "description",
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static serializeToMarkdown(state: any, node: any) {
        const { config } = node.attrs;
        const info = config?.info || {};
        const fields = config?.fields || [];

        // Write API info header
        state.write(
            `### ${info.method?.toUpperCase() || "METHOD"} ${
                info.name || "API Name"
            }\n\n`
        );

        // Write endpoint
        state.write(`**Endpoint:** \`${info.endPoint || ""}\`\n\n`);

        // Write description
        if (info.description) {
            state.write(`${info.description}\n\n`);
        }

        // Write parameters table header
        if (fields && fields.length > 0) {
            // Check if there are non-empty fields
            const hasValidFields = fields.some(
                (field: APIinterfaceParameter) =>
                    field.name.trim() !== "" ||
                    field.type?.trim() !== "" ||
                    field.description?.trim() !== ""
            );

            if (hasValidFields) {
                state.write(`#### Parameters\n\n`);
                state.write(`| Name | Type | Required | Description |\n`);
                state.write(`| ---- | ---- | -------- | ----------- |\n`);

                // Write each field as a table row
                fields.forEach((field: APIinterfaceParameter) => {
                    // Skip completely empty fields
                    if (
                        field.name.trim() === "" &&
                        field.type?.trim() === "" &&
                        field.description?.trim() === ""
                    ) {
                        return;
                    }

                    // Escape pipe characters in markdown tables
                    const name = (field.name || "").replace(/\|/g, "\\|");
                    const type = (field.type || "").replace(/\|/g, "\\|");
                    const required = field.required ? "Yes" : "No";
                    const description = (field.description || "")
                        .replace(/\|/g, "\\|")
                        .replace(/\n/g, "<br>");

                    state.write(
                        `| ${name} | ${type} | ${required} | ${description} |\n`
                    );
                });

                state.write(`\n`);
            }
        }

        // Add a separator
        state.write(`---\n\n`);
    }

    static convertAgentResultToTiptapNode(
        result: APIinterfaceAgentResult
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        return {
            type: "template-apiinterface",
            attrs: {
                topicId: result.topicId || "root",
                id: result.id || "api-interface-1",
                config: {
                    info: {
                        name: result.name || "API Name",
                        method: result.method || "UNKOWN",
                        description: result.description || "",
                        endPoint: result.endPoint || "",
                    },
                    fields:
                        result.fields || APIinterfaceEntity.getDefaultFields(),
                    fieldKey: "description",
                },
            },
        };
    }
}
