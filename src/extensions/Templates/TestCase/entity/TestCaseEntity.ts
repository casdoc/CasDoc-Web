import { uuidv4 } from "zod";

export interface TestCaseStep {
    step: string;
    done: string;
}

export interface TestCaseInfo {
    serial?: string;
    name?: string;
    description?: string;
    expectedResult?: string;
}

export interface TestCaseAgentResult {
    id: string;
    type: string;
    topicId?: string;
    name: string;
    description?: string;
    serial?: string;
    expectedResult: string;
    fields: TestCaseStep[];
}

export class TestCaseEntity {
    info: TestCaseInfo;
    fields: TestCaseStep[];
    fieldKey: string;

    constructor(
        name?: string,
        serial?: string,
        description?: string,
        expectedResult?: string,
        fields?: TestCaseStep[],
        fieldKey?: string
    ) {
        this.info = {
            name: name || "Test Login Functionality",
            serial: serial || "test-01",
            description:
                description ||
                "Ensure user can log in with correct credentials",
            expectedResult:
                expectedResult ||
                "User is successfully redirected to dashboard after login",
        };
        this.fields = fields || [
            {
                step: "Enter valid username and password",
                done: "false",
            },
        ];
        this.fieldKey = fieldKey || "step";
    }

    static getDefaultConfig() {
        return {
            config: {
                info: {
                    name: "Test Login Functionality",
                    serial: "test-01",
                    description:
                        "Ensure user can log in with correct credentials",
                    expectedResult:
                        "User is successfully redirected to dashboard after login",
                },
                fields: [
                    {
                        step: "Enter valid username and password",
                        done: false,
                    },
                ],
                fieldKey: "step",
            },
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static serializeToMarkdown = (state: any, node: any) => {
        const { config } = node.attrs;
        const info = config?.info || {};
        const fields = config?.fields || [];

        // Header
        state.write(`### ${info.name || "Test Case"}\n\n`);

        // Description
        if (info.description) {
            state.write(`${info.description}\n\n`);
        }

        // Expected Result
        if (info.expectedResult) {
            state.write(`- **Expected Result** : ${info.expectedResult}\n\n`);
        }

        // Checklist
        if (fields && fields.length > 0) {
            const hasValidSteps = fields.some(
                (field: { step?: string }) => (field.step || "").trim() !== ""
            );
            if (hasValidSteps) {
                state.write(`#### Steps\n\n`);
                fields.forEach((field: { step?: string; done?: boolean }) => {
                    const step = (field.step || "").trim();
                    if (step !== "") {
                        const checked = field.done ? "x" : " ";
                        state.write(`- [${checked}] ${step}\n`);
                    }
                });
                state.write(`\n`);
            }
        }

        state.write(`---\n\n`);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static convertAgentResultToTiptapNode(result: TestCaseAgentResult): any {
        return {
            type: "template-testCase",
            attrs: {
                topicId: result.topicId || "root",
                id: result.id || uuidv4(),
                config: {
                    info: {
                        name: result.name || "Test Case",
                        serial: result.serial || "test-01",
                        description: result.description || "Test description",
                        expectedResult:
                            result.expectedResult || "Expected result",
                    },
                    fields: result.fields || [],
                    fieldKey: "step",
                },
            },
        };
    }

    isTaskDone(status: string): boolean {
        if (!status) return false;
        const str = status.trim().toLowerCase();
        return str === "true" || str === "yes" || str === "ok";
    }
}
