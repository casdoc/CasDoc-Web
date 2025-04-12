const defaultContent = [
    {
        type: "heading",
        attrs: {
            textAlign: null,
            level: 1,
        },
        content: [
            {
                type: "text",
                text: "CasDoc Guidelines",
            },
        ],
    },
    {
        type: "paragraph",
        attrs: {
            textAlign: null,
        },
        content: [
            {
                type: "text",
                text: "CasDoc 是一款透過文件結構視覺化提升可追溯性的文件編輯工具。以下是具體操作步驟：",
            },
        ],
    },
    {
        type: "topic",
        attrs: {
            documentId: "default-document",
            id: "6091cb7c-ac87-4111-8830-dbcd813dd626",
            level: "1",
            config: {
                info: {
                    name: " 1. 新增主題（Topic）",
                    description:
                        "在編輯區輸入「/」，會跳出命令選單。 \n選擇「新增 Topic」以建立新的主題元件（Component）。",
                },
            },
        },
    },
    {
        type: "template-dataSchema",
        attrs: {
            topicId: "root",
            id: "2bf47ade-e294-4641-87b1-8068a45b4354",
            config: {
                info: {
                    name: "Topic",
                    type: "Component",
                    description: "建議先新增 Topic 再新增 Template。",
                },
                fields: [
                    {
                        name: "Click me",
                        type: "Edit",
                        description: "點擊以編輯元件內容",
                    },
                ],
                fieldKey: "description",
            },
        },
    },
    {
        type: "topic",
        attrs: {
            documentId: "default-document",
            id: "ce399f02-cb6c-46eb-9f7b-95a78d61af5f",
            level: "1",
            config: {
                info: {
                    name: "2. 選擇模板（Template）",
                    description: "",
                },
            },
        },
    },
    {
        type: "template-dataSchema",
        attrs: {
            topicId: "root",
            id: "9d39986e-c75f-4347-b99d-dd13bf6e042d",
            config: {
                info: {
                    name: "Template",
                    type: "Component",
                    description:
                        "建立主題後，從提供的模板中選擇符合需求的樣式。",
                },
                fields: [
                    {
                        name: "Click me",
                        type: "Edit",
                        description: "點擊以編輯內容",
                    },
                ],
                fieldKey: "description",
            },
        },
    },
    {
        type: "topic",
        attrs: {
            documentId: "default-document",
            id: "2a1eb040-d29e-4e69-8ff8-917667f6638d",
            level: "1",
            config: {
                info: {
                    name: "3. 查看結構視圖",
                    description: "",
                },
            },
        },
    },
    {
        type: "template-apiInterface",
        attrs: {
            topicId: "root",
            id: "42fdf011-644f-426b-9297-9cb538384339",
            config: {
                info: {
                    name: "GetGraphView",
                    method: "GET",
                    description:
                        "完成新增主題與模板選擇後，點擊切換至「結構圖」視窗，即可查看文件專案的視覺化結構。",
                    endPoint: "/api/v1/graph",
                },
                fields: [
                    {
                        name: "視窗",
                        type: "Toggle",
                        required: true,
                        description: "左上方可以選擇不同模式進行切換",
                    },
                ],
                fieldKey: "description",
            },
        },
    },
    {
        type: "topic",
        attrs: {
            documentId: "default-document",
            id: "0781526d-a4aa-43b2-8db9-0f0c0711b8ad",
            level: "1",
            config: {
                info: {
                    name: "4. 建立關聯性",
                    description: "",
                },
            },
        },
    },
    {
        type: "template-apiInterface",
        attrs: {
            topicId: "root",
            id: "ca14682d-6dac-459a-a1b7-a9ebba473d44",
            config: {
                info: {
                    name: "CreateConnection",
                    method: "POST",
                    description:
                        "在「結構圖」視窗內，透過拖拉方式即可將兩個相關節點（Node）建立關聯性。",
                    endPoint: "/api/v1/connection",
                },
                fields: [
                    {
                        name: "關聯性",
                        type: "Drag",
                        required: true,
                        description: "只有 Template 可以建立關聯性！",
                    },
                ],
                fieldKey: "description",
            },
        },
    },
    {
        type: "topic",
        attrs: {
            documentId: "default-document",
            id: "261a0de7-e463-4ad1-95c7-60162c3c0596",
            level: "1",
            config: {
                info: {
                    name: "5. 編輯與查看節點",
                    description:
                        "點擊節點（Node）即可編輯內容。點擊節點同時可查看該節點的內容與其與其他節點之間的關聯性。",
                },
            },
        },
    },
    {
        type: "paragraph",
        attrs: {
            textAlign: null,
        },
        content: [
            {
                type: "text",
                text: "透過以上步驟，你能輕鬆管理文件內容並即時掌握文件結構與相關脈絡。立即開始體驗吧！",
            },
        ],
    },
    {
        type: "paragraph",
        attrs: {
            textAlign: null,
        },
    },
];

export default defaultContent;
