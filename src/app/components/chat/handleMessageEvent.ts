import { AgentMessage } from "./handleMessageByType";
import { Dispatch, SetStateAction } from "react";

// Handle different message event types with conversation ID
export const handleMessageEvent = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any,
    conversationId: string,
    setMessages: Dispatch<SetStateAction<AgentMessage[]>>
) => {
    const { event, data } = payload;

    // Update messages based on event type
    setMessages((prev) => {
        // Remove thinking indicator if we're getting a real response
        const filteredMessages = prev.filter((msg) =>
            event !== "thinking" ? msg.type !== "thinking" : true
        );

        // Process message by event type
        switch (event) {
            case "user_prompt":
                // Skip adding user message from server since we already added it in handleOnClick
                return filteredMessages;

            case "thinking":
                // Update existing thinking message if it exists
                const thinkingExists = filteredMessages.some(
                    (msg) => msg.type === "thinking"
                );
                if (thinkingExists) {
                    return filteredMessages.map((msg) =>
                        msg.type === "thinking"
                            ? { ...msg, content: { text: data.text } }
                            : msg
                    );
                } else {
                    return [
                        ...filteredMessages,
                        {
                            type: "thinking",
                            content: { text: data.text },
                            conversationId,
                        },
                    ];
                }

            case "text_delta":
                // Check if this is part of an existing text segment or a new one
                // If there's a tool_call or tool_result after the last text_delta, create a new segment
                let isNewSegment = true;
                let messageSegmentId = Date.now().toString();

                // Find the last text_delta message for this conversation
                const textDeltaMessages = filteredMessages.filter(
                    (msg) =>
                        msg.type === "text_delta" &&
                        msg.conversationId === conversationId
                );

                if (textDeltaMessages.length > 0) {
                    const lastTextDeltaIndex = filteredMessages.findIndex(
                        (msg) =>
                            msg.type === "text_delta" &&
                            msg.conversationId === conversationId &&
                            msg.messageSegmentId ===
                                textDeltaMessages[textDeltaMessages.length - 1]
                                    .messageSegmentId
                    );

                    // Check if there's any tool_call or tool_result between the last text_delta and current position
                    const hasToolBetween =
                        lastTextDeltaIndex !== -1 &&
                        filteredMessages
                            .slice(lastTextDeltaIndex + 1)
                            .some(
                                (msg) =>
                                    (msg.type === "tool_call" ||
                                        msg.type === "tool_result") &&
                                    msg.conversationId === conversationId
                            );

                    if (!hasToolBetween && textDeltaMessages.length > 0) {
                        // Use the existing segment ID if no tool messages in between
                        isNewSegment = false;
                        messageSegmentId =
                            textDeltaMessages[textDeltaMessages.length - 1]
                                .messageSegmentId || messageSegmentId;
                    }
                }

                if (isNewSegment) {
                    // Create a new text_delta message with a new segment ID
                    return [
                        ...filteredMessages,
                        {
                            type: "text_delta",
                            content: { full_text: data.full_text },
                            conversationId,
                            messageSegmentId,
                        },
                    ];
                } else {
                    // Update the existing text_delta message with the same segment ID
                    return filteredMessages.map((msg) =>
                        msg.type === "text_delta" &&
                        msg.conversationId === conversationId &&
                        msg.messageSegmentId === messageSegmentId
                            ? {
                                  type: "text_delta",
                                  content: { full_text: data.full_text },
                                  conversationId,
                                  messageSegmentId,
                              }
                            : msg
                    );
                }

            case "tool_call":
                return [
                    ...filteredMessages,
                    {
                        type: "tool_call",
                        content: {
                            tool_name: data.tool_name,
                            args: data.args,
                        },
                        conversationId,
                    },
                ];

            case "tool_call_delta":
                // Find the last tool_call message from this conversation
                const lastToolCallIndex = filteredMessages.findIndex(
                    (msg) =>
                        msg.type === "tool_call" &&
                        msg.conversationId === conversationId
                );

                // If there's a tool_call, update its content
                if (lastToolCallIndex !== -1) {
                    return filteredMessages.map((msg, idx) =>
                        idx === lastToolCallIndex
                            ? {
                                  ...msg,
                                  content: {
                                      ...msg.content,
                                      tool_name:
                                          data.tool_name ||
                                          msg.content.tool_name,
                                      args: data.args || msg.content.args,
                                  },
                              }
                            : msg
                    );
                }

                // If no existing tool_call, create a new one
                return [
                    ...filteredMessages,
                    {
                        type: "tool_call",
                        content: {
                            tool_name: data.tool_name || "Running Tool",
                            args: data.args,
                        },
                        conversationId,
                    },
                ];

            case "tool_result":
                // Remove any tool_call for this conversation when we get the result
                return [
                    ...filteredMessages.filter(
                        (msg) =>
                            !(
                                msg.type === "tool_call" &&
                                msg.conversationId === conversationId
                            )
                    ),
                    {
                        type: "tool_result",
                        content: {
                            tool_name: data.tool_name || "Tool Result",
                            result: data.result,
                        },
                        conversationId,
                    },
                ];

            case "final_answer":
                // Replace text_delta messages only from the current conversation
                return [
                    ...filteredMessages.filter(
                        (msg) =>
                            !(
                                msg.type === "text_delta" &&
                                msg.conversationId === conversationId
                            )
                    ),
                    {
                        type: "final_answer",
                        content: { text: data.text },
                        conversationId,
                    },
                ];

            case "error":
                return [
                    ...filteredMessages,
                    {
                        type: "error",
                        content: { message: data.message },
                        conversationId,
                    },
                ];

            default:
                return filteredMessages;
        }
    });
};
