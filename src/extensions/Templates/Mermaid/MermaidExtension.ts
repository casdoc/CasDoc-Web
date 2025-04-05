import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
    setupNodeEventHandlers,
    cleanupNodeEventHandlers,
} from "../../ExtensionUtils";
import MermaidComponent from "./MermaidComponent";
export const mermaidDefaultConfig = {
    info: {
        name: "Mermaid",
    },
    content: `%% Mermaid Template - Delete or modify this template to create your own diagram
%% This template demonstrates the most common Mermaid diagram types.
%% Uncomment the section you want to use and delete the rest.

%% FLOWCHART - Visualize processes, decisions and workflows
%% flowchart TD
%%    Start --> Process
%%    Process --> Decision{Condition?}
%%    Decision -->|Yes| Success
%%    Decision -->|No| Failure
%%    Success --> End
%%    Failure --> Process

%% SEQUENCE DIAGRAM - Show interactions between systems over time
sequenceDiagram
    participant User
    participant System
    User->>System: Request data
    activate System
    System-->>User: Return response
    deactivate System
    Note over User,System: Simple interaction flow

%% STATE DIAGRAM - Display state transitions within a system
%% stateDiagram-v2
%%    [*] --> Idle
%%    Idle --> Processing: Start
%%    Processing --> Success: Complete
%%    Processing --> Error: Fail
%%    Success --> [*]
%%    Error --> Idle: Retry

%% CLASS DIAGRAM - Illustrate object-oriented structures
%% classDiagram
%%    class Entity {
%%        +String id
%%        +DateTime created
%%        +update()
%%    }
%%    class User {
%%        +String name
%%        +String email
%%        +login()
%%    }
%%    Entity <|-- User

%% GANTT CHART - Project scheduling and timeline visualization
%% gantt
%%    title Project Timeline
%%    dateFormat YYYY-MM-DD
%%    section Planning
%%    Requirements: 2023-01-01, 7d
%%    Design: after Requirements, 10d
%%    section Implementation
%%    Development: after Design, 14d
%%    Testing: after Development, 7d

%% PIE CHART - Simple proportional data visualization
%% pie title Distribution
%%    "Category A" : 45
%%    "Category B" : 30
%%    "Category C" : 25

%% For more diagram types and syntax, visit: https://mermaid.js.org/
`,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeMermaidToMarkdown = (state: any, node: any) => {
    const { config } = node.attrs;
    const name = config?.info?.name || "Mermaid Diagram";
    const mermaidCode = config?.content || "";

    // Write diagram name as a heading
    state.write(`### ${name}\n\n`);

    // Write mermaid code in a fenced code block
    state.write("```mermaid\n");
    state.write(`${mermaidCode}\n`);
    state.write("```\n\n");

    // Add a separator
    state.write(`---\n\n`);
};

export const MermaidExtension = Node.create({
    name: "template-mermaid",

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
            config: createConfigAttribute(mermaidDefaultConfig),
        };
    },

    parseHTML() {
        return [
            {
                tag: "mermaid",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["mermaid", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidComponent);
    },
    onCreate() {
        setupNodeEventHandlers(this.editor, this.name, this.storage);
    },

    onDestroy() {
        cleanupNodeEventHandlers(this.storage);
    },
    addProseMirrorPlugins() {
        const pasteDefaultConfig = mermaidDefaultConfig;
        // Use the generic node transformer with your specific config
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        // Use the reusable paste handler plugin
        return [
            createPasteHandlerPlugin("template-mermaid", (node) => {
                const transformedNode = topicTransformer(node);
                // console.debug(
                //     "Processing topic node during paste:",
                //     transformedNode.attrs.config
                // );
                return transformedNode;
            }),
        ];
    },
});
