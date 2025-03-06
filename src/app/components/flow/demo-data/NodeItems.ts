export interface NodeItems {
    id: number;
    content: string;
    topic: string;
    parentId: number;
}

export const dataItems: NodeItems[] = [
    { id: 1, content: "SDD", topic: "SDD", parentId: 1 },

    { id: 2, content: "引言與範圍", topic: "SDD", parentId: 1 },
    { id: 3, content: "目的", topic: "SDD", parentId: 2 },
    { id: 4, content: "文件範圍", topic: "SDD", parentId: 2 },

    { id: 5, content: "系統概述", topic: "SDD", parentId: 1 },
    { id: 6, content: "系統架構", topic: "SDD", parentId: 5 },
    { id: 7, content: "系統需求概述", topic: "SDD", parentId: 5 },

    { id: 8, content: "詳細設計", topic: "SDD", parentId: 1 },
    { id: 9, content: "模組設計", topic: "SDD", parentId: 8 },
    { id: 10, content: "API 設計", topic: "SDD", parentId: 8 },
    { id: 11, content: "演算法設計", topic: "SDD", parentId: 8 },

    { id: 12, content: "資料庫設計", topic: "SDD", parentId: 1 },
    { id: 13, content: "資料模型", topic: "SDD", parentId: 12 },
    { id: 14, content: "表格設計", topic: "SDD", parentId: 12 },
    { id: 15, content: "索引與效能優化", topic: "SDD", parentId: 12 },

    { id: 16, content: "介面設計", topic: "SDD", parentId: 1 },
    { id: 17, content: "前端 UI 設計", topic: "SDD", parentId: 16 },
    { id: 18, content: "後端 API 介面", topic: "SDD", parentId: 16 },

    { id: 19, content: "安全性與效能考量", topic: "SDD", parentId: 1 },
    { id: 20, content: "身份驗證與授權", topic: "SDD", parentId: 19 },
    { id: 21, content: "效能最佳化", topic: "SDD", parentId: 19 },

    { id: 22, content: "測試計劃與驗收策略", topic: "SDD", parentId: 1 },
    { id: 23, content: "單元測試", topic: "SDD", parentId: 22 },
    { id: 24, content: "整合測試", topic: "SDD", parentId: 22 },
    { id: 25, content: "驗收測試", topic: "SDD", parentId: 22 },

    { id: 26, content: "附錄", topic: "SDD", parentId: 1 },
    { id: 27, content: "術語表", topic: "SDD", parentId: 26 },
    { id: 28, content: "參考文件", topic: "SDD", parentId: 26 },
];
