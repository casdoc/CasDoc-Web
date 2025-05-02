export const defaultSRD = [
    {
        type: "heading",
        attrs: {
            textAlign: null,
            level: 1,
        },
        content: [
            {
                type: "text",
                text: "Order Now 馬上點 需求文件",
            },
        ],
    },
    {
        type: "heading",
        attrs: {
            textAlign: null,
            level: 3,
        },
    },
    {
        type: "template-userStory",
        attrs: {
            topicId: "root",
            id: "e01d75c8-61e6-459a-9865-dd32869b9e6a",
            config: {
                info: {
                    name: "作為未登入之顧客，使用者根據註冊的郵件與密碼登入系統1\n",
                    serial: "story-01",
                    priority: "2",
                    tag: "login",
                    role: "未登入之顧客登入帳號",
                    feature: "需要有對應的錯誤提示，如帳號不存在或是密碼錯誤",
                },
                fields: [
                    {
                        acceptance: "測試對應的錯誤提示是否正確顯示",
                        done: "true",
                    },
                    {
                        acceptance: "測試是否可以成功登入",
                        done: "true",
                    },
                ],
                fieldKey: "acceptance",
            },
        },
    },
    {
        type: "template-userStory",
        attrs: {
            topicId: "root",
            id: "03e3a346-0916-4e87-be51-a6a78a37933f",
            config: {
                info: {
                    name: "作為未登入之顧客，使用者根據註冊的郵件與密碼登入系統\n",
                    serial: "story-01",
                    priority: "2",
                    tag: "login",
                    role: "未登入之顧客登入帳號",
                    feature: "需要有對應的錯誤提示，如帳號不存在或是密碼錯誤",
                },
                fields: [
                    {
                        acceptance: "測試對應的錯誤提示是否正確顯示",
                        done: "true",
                    },
                    {
                        acceptance: "測試是否可以成功登入",
                        done: "true",
                    },
                ],
                fieldKey: "acceptance",
            },
        },
    },
    {
        type: "template-whiteBoard",
        attrs: {
            id: "8b2f85a5-b216-4a56-ac0a-e766505b9326",
            config: {
                info: {
                    name: "接受準則",
                    description: "(Acceptance Criteria of this document)",
                },
                fieldKey: "description",
            },
        },
    },
];
