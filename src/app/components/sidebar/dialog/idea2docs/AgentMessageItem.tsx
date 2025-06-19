import { CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { Flex } from "@radix-ui/themes";
import { AgentMessage } from "@/app/components/chat/handleMessageByType";

// Component for displaying agent messages
export const AgentMessageItem = ({ message }: { message: AgentMessage }) => {
    const getIcon = () => {
        switch (message.type) {
            case "tool_call":
                return (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                );
            case "tool_result":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "error":
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    const getText = () => {
        switch (message.type) {
            case "tool_call":
                return `Calling ${message.toolName || "unknown tool"}...`;
            case "tool_result":
                return `Created ${message.toolName || "component"}`;
            case "error":
                return `Error: ${message.content?.message || "Unknown error"}`;
            default:
                return "Processing...";
        }
    };

    return (
        <div
            className={`p-2 rounded-md border bg-white shadow-sm mb-2`}
            onClick={() => console.debug("Message clicked:", message)}
        >
            <Flex align="center" className="gap-2">
                {getIcon()}
                <span className="text-sm">{getText()}</span>
            </Flex>
        </div>
    );
};
