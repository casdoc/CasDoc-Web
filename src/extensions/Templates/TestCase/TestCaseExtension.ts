import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TestCaseComponent from "./TestCaseComponent";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "../../ExtensionUtils";

const topicDefaultConfig = {
    config: {
        info: {
            name: "Test Login Functionality",
            serial: "test-01",
            description: "Ensure user can log in with correct credentials",
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeTestCaseToMarkdown = (state: any, node: any) => {
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

export const TestCaseExtension = Node.create({
    name: "template-testCase",

    group: "block",

    atom: false,
    isolating: true,
    selectable: true,

    addAttributes() {
        return {
            topicId: {
                default: "test-topic-1",
            },
            id: {
                default: uuidv4(),
            },

            config: createConfigAttribute(topicDefaultConfig),
        };
    },

    parseHTML() {
        return [
            {
                tag: "test-case",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["test-case", mergeAttributes(HTMLAttributes)];
    },

    onCreate() {
        setupNodeEventHandlers(this.editor, this.name, this.storage);
    },

    onDestroy() {
        cleanupNodeEventHandlers(this.storage);
    },

    addNodeView() {
        return ReactNodeViewRenderer(TestCaseComponent);
    },

    addProseMirrorPlugins() {
        const pasteDefaultConfig = topicDefaultConfig;
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        return [
            createPasteHandlerPlugin("template-testCase", (node) => {
                const transformedNode = topicTransformer(node);
                return transformedNode;
            }),
        ];
    },
});
