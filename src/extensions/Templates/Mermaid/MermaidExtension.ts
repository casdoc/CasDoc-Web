import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v4 as uuidv4 } from "uuid";
import {
    createConfigAttribute,
    createPasteHandlerPlugin,
    createNodeTransformer,
} from "../../ExtensionUtils";
import { NodeSelection } from "@tiptap/pm/state";
import MermaidComponent from "./MermaidComponent";
export const mermaidDefaultConfig = {
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
export const MermaidExtension = Node.create({
    name: "mermaid",

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

    addKeyboardShortcuts() {
        return {
            "Mod-Enter": () => {
                // Handle node selection directly instead of using the command
                const { state } = this.editor;
                const { selection } = state;

                // Import needed at the top of the file
                if (
                    selection instanceof NodeSelection &&
                    selection.node.attrs.id
                ) {
                    // Dispatch custom event that useBlockEditor can listen for
                    const event = new CustomEvent("node-selection", {
                        detail: { id: selection.node.attrs.id },
                    });
                    window.dispatchEvent(event);
                }
                return true;
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidComponent);
    },

    addProseMirrorPlugins() {
        const pasteDefaultConfig = mermaidDefaultConfig;
        // Use the generic node transformer with your specific config
        const topicTransformer = createNodeTransformer(pasteDefaultConfig);

        // Use the reusable paste handler plugin
        return [
            createPasteHandlerPlugin("mermaid", (node) => {
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
