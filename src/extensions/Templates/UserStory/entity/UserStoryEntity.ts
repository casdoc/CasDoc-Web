export interface AcceptanceCriteria {
    acceptance: string;
    done: string;
}

export interface UserStoryInfo {
    serial?: string;
    name?: string;
    tag?: string;
    priority?: string;
    role?: string;
    feature?: string;
}

export class UserStoryEntity {
    info: UserStoryInfo;
    fields: AcceptanceCriteria[];
    fieldKey: string;

    constructor(
        name?: string,
        serial?: string,
        tag?: string,
        priority?: string,
        role?: string,
        feature?: string,
        fields?: AcceptanceCriteria[],
        fieldKey?: string
    ) {
        this.info = {
            name: name || "User Login",
            serial: serial || "story-01",
            tag: tag || "login",
            priority: priority || "2",
            role:
                role ||
                "As a registered user, I would like to log in to the system.",
            feature:
                feature ||
                "Log in by entering your username and password to access my personal information and services.",
        };
        this.fields = fields || [
            {
                acceptance:
                    "The user can successfully log in after entering the correct account and password",
                done: "false",
            },
        ];
        this.fieldKey = fieldKey || "acceptance";
    }

    static getDefaultConfig() {
        return {
            config: {
                info: {
                    name: "User Login",
                    serial: "story-01",
                    priority: "2",
                    tag: "login",
                    role: "As a registered user, I would like to log in to the system.",
                    feature:
                        "Log in by entering your username and password to access my personal information and services.",
                },
                fields: [
                    {
                        acceptance:
                            "The user can successfully log in after entering the correct account and password",
                        done: false,
                    },
                ],
                fieldKey: "acceptance",
            },
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static serializeToMarkdown = (state: any, node: any) => {
        const { config } = node.attrs;
        const info = config?.info || {};
        const fields = config?.fields || [];

        state.write(`### ${info.name || "User Story"}\n`);

        if (info.role) {
            state.write(`- **Role** : ${info.role}\n`);
        }
        if (info.feature) {
            state.write(`- **Feature** : ${info.feature}\n`);
        }
        if (info.tag) {
            state.write(`- **Tag** : ${info.tag}\n`);
        }
        if (info.priority) {
            state.write(`- **Priority** : ${info.priority}\n`);
        }

        const hasValidAcceptances = fields.some(
            (field: { acceptance?: string }) =>
                (field.acceptance || "").trim() !== ""
        );

        if (hasValidAcceptances) {
            state.write(`#### Acceptance Criteria\n\n`);
            fields.forEach((field: { acceptance?: string; done?: boolean }) => {
                const acceptance = (field.acceptance || "").trim();
                if (acceptance !== "") {
                    const checked = field.done ? "x" : " ";
                    state.write(`- [${checked}] ${acceptance}\n`);
                }
            });
            state.write(`\n`);
        }
        state.write(`---\n\n`);
    };

    isTaskDone(status: string): boolean {
        if (!status) return false;
        const str = status.trim().toLowerCase();
        return str === "true" || str === "yes" || str === "ok";
    }

    calculatePriorityStyle(priority: number) {
        switch (priority) {
            case 1:
                return "bg-green-100 text-green-800 border-green-300";
            case 2:
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case 3:
                return "bg-orange-100 text-orange-800 border-orange-300";
            case 4:
                return "bg-red-100 text-red-800 border-red-300";
            case 5:
                return "bg-purple-100 text-purple-800 border-purple-300";
        }
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
}
