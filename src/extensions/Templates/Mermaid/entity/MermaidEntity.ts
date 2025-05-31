export interface MermaidInfo {
    name?: string;
}

const defaultMermaidContent = `%% Mermaid Template - Delete or modify this template to create your own diagram
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
`;

export class MermaidEntity {
    info: MermaidInfo;
    content: string;

    constructor(name?: string, content?: string) {
        this.info = {
            name: name || "Mermaid",
        };
        this.content = content || defaultMermaidContent;
    }

    static getDefaultConfig() {
        return {
            info: {
                name: "Mermaid",
            },
            content: defaultMermaidContent,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static serializeToMarkdown = (state: any, node: any) => {
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
}
