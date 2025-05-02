export const defaultSTD = [
    {
        type: "heading",
        attrs: {
            textAlign: null,
            level: 1,
        },
        content: [
            {
                type: "text",
                text: "Order Now 馬上點 測試文件",
            },
        ],
    },
    {
        type: "heading",
        attrs: {
            textAlign: null,
            level: 3,
        },
        content: [
            {
                type: "text",
                text: "測試案例",
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
                text: "Auth Controller Integration Test ",
            },
        ],
    },
    {
        type: "template-testCase",
        attrs: {
            topicId: "root",
            id: "f7880241-a423-4180-b9cc-38fdf0ea8a57",
            config: {
                info: {
                    name: "顧客註冊\n\n",
                    serial: "Test 3",
                    description: "確保顧客可以註冊",
                    expectedResult: "200",
                },
                fields: [
                    {
                        step: ".使用mockMVC發POST /api/v2/auth/register API request註冊顧客帳號\n",
                        done: "true\n",
                    },
                ],
                fieldKey: "step",
            },
        },
    },
    {
        type: "template-testCase",
        attrs: {
            topicId: "root",
            id: "7563f491-f9f4-4c34-8b5c-b780794f6a96",
            config: {
                info: {
                    name: "顧客註冊\n\n",
                    serial: "Test 3",
                    description: "確保顧客可以註冊",
                    expectedResult: "200",
                },
                fields: [
                    {
                        step: ".使用mockMVC發POST /api/v2/auth/register API request註冊顧客帳號\n",
                        done: "true\n",
                    },
                ],
                fieldKey: "step",
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
                type: "hardBreak",
            },
        ],
    },
];
