export interface DataSchemaField {
    name: string;
    type: string;
    description: string;
}

export interface DataSchemaInfo {
    name?: string;
    type?: string;
    description?: string;
}

export class DataSchemaEntity {
    public info: DataSchemaInfo;
    public fields: DataSchemaField[];
    public fieldKey: string;

    constructor(
        name?: string,
        type?: string,
        description?: string,
        fields?: DataSchemaField[],
        fieldKey?: string
    ) {
        this.info = {
            name: name || "Schema",
            type: type || "Object",
            description: description || "This is a data schema description",
        };
        this.fields = fields || DataSchemaEntity.getDefaultFields();
        this.fieldKey = fieldKey || "description";
    }

    static getDefaultInfo(): DataSchemaInfo {
        return {
            name: "Schema",
            type: "Object",
            description: "This is a data schema description",
        };
    }

    static getDefaultFields(): DataSchemaField[] {
        return [
            {
                name: "field",
                type: "default",
                description: "default field",
            },
        ];
    }

    static getDefaultConfig() {
        return {
            info: DataSchemaEntity.getDefaultInfo(),
            fields: DataSchemaEntity.getDefaultFields(),
            fieldKey: "description",
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static serializeToMarkdown(state: any, node: any) {
        const { config } = node.attrs;
        const info = config?.info || {};
        const fields = config?.fields || [];

        // Write schema info header
        state.write(`### ${info.name || "Data Schema"}`);

        // Add type as a label if present
        if (info.type) {
            state.write(` *${info.type}*`);
        }

        state.write(`\n\n`);

        // Write description
        if (info.description) {
            state.write(`${info.description}\n\n`);
        }

        // Write fields table
        if (fields && fields.length > 0) {
            // Check if there are non-empty fields
            const hasValidFields = fields.some(
                (field: DataSchemaField) =>
                    field.name.trim() !== "" ||
                    field.type.trim() !== "" ||
                    field.description.trim() !== ""
            );

            if (hasValidFields) {
                state.write(`#### Fields\n\n`);
                state.write(`| Field | Type | Description |\n`);
                state.write(`| ----- | ---- | ----------- |\n`);

                // Write each field as a table row
                fields.forEach((field: DataSchemaField) => {
                    // Skip completely empty fields
                    if (
                        field.name.trim() === "" &&
                        field.type.trim() === "" &&
                        field.description.trim() === ""
                    ) {
                        return;
                    }

                    // Escape pipe characters in markdown tables
                    const name = (field.name || "").replace(/\|/g, "\\|");
                    const type = (field.type || "").replace(/\|/g, "\\|");
                    const description = (field.description || "")
                        .replace(/\|/g, "\\|")
                        .replace(/\n/g, "<br>");

                    state.write(`| ${name} | ${type} | ${description} |\n`);
                });

                state.write(`\n`);
            }
        }

        // Add a separator
        state.write(`---\n\n`);
    }
}
