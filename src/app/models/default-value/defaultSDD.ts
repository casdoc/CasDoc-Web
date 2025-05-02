export const defaultSDD = [
    {
        type: "heading",
        attrs: {
            textAlign: null,
            level: 1,
        },
        content: [
            {
                type: "text",
                text: "Order Now 馬上點 設計文件",
            },
        ],
    },
    {
        type: "topic",
        attrs: {
            documentId: "default-document",
            id: "20bd13b6-ef8f-422f-af6e-3c0de03a9c82",
            config: {
                info: {
                    name: "系統模型與架構",
                    description: "(System Model/System Architecture) ",
                },
            },
            level: "1",
        },
    },
    {
        type: "template-mermaid",
        attrs: {
            topicId: "root",
            id: "13d9746f-426c-4a3f-a283-1ae3bc6e69a9",
            config: {
                info: {
                    name: "Mermaid",
                },
                content:
                    'graph TD\n    UnauthenticatedCustomer["未登入之顧客<br>[Person]<br>要進行瀏覽商家菜單的顧客，但未登入帳號"]\n    AuthenticatedCustomer["登入之顧客<br>[Person]<br>要進行瀏覽商家菜單並點餐、收藏店家的顧客，且已登入帳號"]\n    Merchant["商家<br>[Person]<br>要進行接收顧客訂單、管理菜單、觀察銷量統計的商家"]\n    System["Ordering meal manage System<br>[Software System]<br>允許對應權限的使用者進行對應操作..."]\n\n    UnauthenticatedCustomer -->|瀏覽所有商家、商家菜單| System\n    AuthenticatedCustomer -->|瀏覽所有商家、商家菜單，並對指定商家下單...| System\n    Merchant -->|接單、管理訂單和菜單、統計銷量數據| System\n',
            },
        },
    },
    {
        type: "template-mermaid",
        attrs: {
            topicId: "root",
            id: "972aa1c4-cf9b-4f3e-9b0e-39aa1b38cdec",
            config: {
                info: {
                    name: "Mermaid",
                },
                content:
                    'graph TD\n    WebApp["Web Application<br>[Container]<br>React, Vite, TailwindCSS, TanStack Query, Zustand"]\n    API["API Application<br>[Container]<br>Spring MVC and Java"]\n    DB["MongoDB<br>[Container]"]\n    EmailService["Email validation sender<br>[Container]<br>Java"]\n    FakeData["Fake data loader<br>[Container]<br>Python, Playwright"]\n\n    WebApp -->|HTTPS<br>Makes API calls to| API\n    API -->|HTTPS<br>Write and Reads data by API call| DB\n    API -->|HTTPS<br>Makes API calls to| EmailService\n    API -->|HTTPS<br>Write Fake data| FakeData\n',
            },
        },
    },
    {
        type: "topic",
        attrs: {
            documentId: "default-document",
            id: "d80cfa24-250a-43b6-8d32-d8806a7fdf1a",
            config: {
                info: {
                    name: "介面需求與設計\n",
                    description: "(Interface Requirement and Design)",
                },
            },
            level: "1",
        },
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
                text: "Auth API",
            },
        ],
    },
    {
        type: "template-apiInterface",
        attrs: {
            topicId: "root",
            id: "c0438c4d-0056-4b9e-ab92-bd228816b150",
            config: {
                info: {
                    name: "Register",
                    method: "POST",
                    description: "使用者輸入個人資料，建立帳戶",
                    endPoint: "/api/v2/auth/register",
                },
                fields: [
                    {
                        name: "name",
                        type: "string",
                        required: true,
                        description: "UserName",
                    },
                    {
                        name: "email",
                        type: "string",
                        required: "true",
                        description: "useremail",
                    },
                    {
                        name: "Role",
                        type: "number",
                        required: "false",
                        description: "role",
                    },
                ],
                fieldKey: "description",
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
                text: "/",
            },
        ],
    },
];
