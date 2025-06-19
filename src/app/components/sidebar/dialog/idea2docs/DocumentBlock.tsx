import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { Flex } from "@radix-ui/themes";

export const DocumentBlock = ({
    name,
    status,
}: {
    name: string;
    status: "completed" | "generating" | "waiting";
}) => {
    const getIcon = () => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "generating":
                return (
                    <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                );
            case "waiting":
                return <Clock className="h-5 w-5 text-gray-400" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "completed":
                return "Ready";
            case "generating":
                return "Generating...";
            case "waiting":
                return "Waiting";
        }
    };

    return (
        <Flex
            align="center"
            justify="between"
            className="p-3 rounded-md border bg-white shadow-sm mb-3"
        >
            <Flex align="center" className="gap-3">
                {getIcon()}
                <div className="text-sm font-medium">{name}</div>
            </Flex>
            <div className="text-xs text-gray-500">{getStatusText()}</div>
        </Flex>
    );
};
