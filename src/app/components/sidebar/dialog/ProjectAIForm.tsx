import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DialogDescription,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Flex, TextArea } from "@radix-ui/themes";
import { ArrowLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
    AgentService,
    StreamResponse,
} from "@/app/models/services/AgentService";
import { DocumentType } from "@/app/models/enum/DocumentType";
import { AgentMessageItem } from "./idea2docs/AgentMessageItem";
// import { DocumentBlock } from "./idea2docs/DocumentBlock";
import { useCreateProjectMutation } from "@/app/viewModels/hooks/useCreateProjectMutation";
import { useCreateDocumentMutation } from "@/app/viewModels/hooks/useCreateDocumentMutation";
import { setDocumentContent } from "@/app/models/services/DocumentService";
import { TiptapTransformer } from "@hocuspocus/transformer";
import * as Y from "yjs";

import ExtensionKit from "@/extensions/ExtensionKit";
import { AgentResultConverter } from "@/extensions/utils/AgentResultConverter";
import { MessageContent } from "../../chat/handleMessageByType";
import { Node } from "@tiptap/pm/model";

interface DocumentContent {
    type: "doc";
    content: Node[];
}
interface AgentMessage {
    type: "tool_call" | "tool_result" | "error";
    toolName?: string;
    content: MessageContent;
    timestamp: number;
}
// interface DocumentStatus {
//     [DocumentType.SRD]: "waiting" | "generating" | "completed";
//     [DocumentType.SDD]: "waiting" | "generating" | "completed";
//     [DocumentType.STD]: "waiting" | "generating" | "completed";
// }

export const ProjectAIForm = ({
    prompt,
    setPrompt,
    onBack,
}: {
    prompt: string;
    setPrompt: (value: string) => void;
    onBack: () => void;
}) => {
    const [projectName, setProjectName] = useState("AI Generated Project");
    const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
    const documentContents = useRef<Record<string, DocumentContent>>({
        [DocumentType.SRD]: { type: "doc", content: [] },
        [DocumentType.SDD]: { type: "doc", content: [] },
        [DocumentType.STD]: { type: "doc", content: [] },
        [DocumentType.OTHER]: { type: "doc", content: [] },
    });
    // const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
    //     [DocumentType.SRD]: "waiting",
    //     [DocumentType.SDD]: "waiting",
    //     [DocumentType.STD]: "waiting",
    // });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const componentsToTopicMap = useRef<Record<string, any>>({});
    const [currentStep, setCurrentStep] = useState<
        "input" | "generating" | "review"
    >("input");
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const createProjectMutation = useCreateProjectMutation();
    const createDocumentMutation = useCreateDocumentMutation();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [agentMessages]);

    useEffect(() => {
        console.debug("Document contents updated:", documentContents.current);
    }, [documentContents]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setCurrentStep("generating");
        setError(null);
        setAgentMessages([]);

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        try {
            const stream = await AgentService.ideas2docs(prompt);
            if (!stream) {
                throw new Error("Failed to get response stream");
            }

            await AgentService.handleStreamResponse(
                stream,
                abortControllerRef.current.signal,
                handleStreamMessage,
                handleStreamError,
                handleStreamComplete
            );
        } catch (err) {
            console.error("Error during AI generation:", err);
            if (err instanceof Error && err.name !== "AbortError") {
                setError(err.message);
                setCurrentStep("input");
            }
        }
    };

    // Handle stream messages
    const handleStreamMessage = (response: StreamResponse) => {
        const { event, data } = response;

        switch (event) {
            case "tool_call":
                setAgentMessages((prev) => [
                    ...prev,
                    {
                        type: "tool_call",
                        toolName: data.tool_name,
                        content: data,
                        timestamp: Date.now(),
                    },
                ]);

                // Update document status based on tool name
                // updateDocumentStatusFromTool(data.tool_name, "generating");
                break;

            case "tool_result":
                setAgentMessages((prev) => [
                    ...prev.filter(
                        (msg) =>
                            !(
                                msg.type === "tool_call" &&
                                msg.toolName === data.tool_name
                            )
                    ),
                    {
                        type: "tool_result",
                        toolName: data.tool_name,
                        content: data.result,
                        timestamp: Date.now(),
                    },
                ]);

                // Process the result and update document content
                processToolResult(data.tool_name, data.result);
                // updateDocumentStatusFromTool(data.tool_name, "completed");
                break;

            case "error":
                setAgentMessages((prev) => [
                    ...prev,
                    {
                        type: "error",
                        content: data,
                        timestamp: Date.now(),
                    },
                ]);
                break;
        }
    };

    // Handle stream errors
    const handleStreamError = (error: Error) => {
        setError(error.message);
        setCurrentStep("input");
    };

    // Handle stream completion
    const handleStreamComplete = () => {
        // Organize content after all components are processed
        organizeDocumentContent();
        setCurrentStep("review");
    };

    // Update document status based on tool name
    // const updateDocumentStatusFromTool = (
    //     toolName: string,
    //     status: "generating" | "completed"
    // ) => {
    //     // Map tool names to document types - this is a simplified mapping
    //     let docType: DocumentType | null = null;

    //     if (toolName?.includes("srd") || toolName?.includes("requirement")) {
    //         docType = DocumentType.SRD;
    //     } else if (toolName?.includes("sdd") || toolName?.includes("design")) {
    //         docType = DocumentType.SDD;
    //     } else if (toolName?.includes("std") || toolName?.includes("test")) {
    //         docType = DocumentType.STD;
    //     }

    //     if (docType) {
    //         setDocumentStatus((prev) => ({
    //             ...prev,
    //             [docType]: status,
    //         }));
    //     }
    // };

    // Process tool results into document content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processToolResult = (toolName: string, result: any) => {
        try {
            // Use AgentResultConverter to convert the result
            const TiptapNode = AgentResultConverter.convertToTipTapAttrs(
                toolName,
                result
            );

            if (!TiptapNode) {
                console.warn(
                    "Failed to convert result to TipTap attrs:",
                    result
                );
                return;
            }

            // Handle topic components - they define document boundaries
            if (TiptapNode.type === "topic") {
                const documentType = TiptapNode.attrs.documentId as string;
                if (!documentType) return;
                if (TiptapNode.attrs.level === 1) {
                    // Add topic to the corresponding document
                    documentContents.current[documentType] = {
                        type: "doc",
                        content: [
                            ...(documentContents.current[documentType]
                                ?.content || []),
                            TiptapNode,
                        ],
                    };
                    console.debug(
                        "Added topic to document:",
                        documentContents.current
                    );
                }
            } else {
                // Handle non-level1-topic components - store by level 1 topicId
                const topicId = result.topicId;
                if (topicId) {
                    // Store component by topicId
                    if (!componentsToTopicMap.current[topicId]) {
                        componentsToTopicMap.current[topicId] = [];
                    }
                    componentsToTopicMap.current[topicId].push(TiptapNode);
                    console.debug(
                        "componentsToTopicMap updated:",
                        componentsToTopicMap.current
                    );
                } else {
                    console.warn("Component without topicId:", result);
                }
            }
        } catch (err) {
            console.warn("Failed to process tool result:", err);
        }
    };

    // Organize document content by inserting components in ComponentsToTopicMap
    const organizeDocumentContent = useCallback(() => {
        const componentsMap = { ...componentsToTopicMap.current };
        const mapKeys = Object.keys(componentsMap);
        console.debug(
            "Organizing document content with components map keys:",
            mapKeys
        );

        console.debug(
            "documentContents before organization:",
            documentContents.current
        );

        // First round: insert components for topics that already exist in document content
        for (const topicId of mapKeys) {
            const components = componentsMap[topicId];
            if (!components || components.length === 0) continue;

            // Search through all document types
            for (const docType of Object.keys(documentContents.current)) {
                const docContent = documentContents.current[docType];
                if (!docContent || !docContent.content) continue;

                console.debug(
                    "docContent for type:",
                    docType,
                    documentContents.current[docType]
                );

                // Find the topic with matching id in the content
                const topicIndex = documentContents.current[
                    docType
                ].content.findIndex(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (node: any) =>
                        node.type === "topic" && node.attrs?.id === topicId
                );

                console.debug("Searching for topic:", topicId, "in", docType);
                console.debug("Found topic index:", topicIndex);

                if (topicIndex !== -1) {
                    console.debug("Inserting components for topic:", topicId);
                    // Insert components after the topic
                    documentContents.current[docType] = {
                        type: "doc",
                        content: [
                            ...documentContents.current[docType].content.slice(
                                0,
                                topicIndex + 1
                            ),
                            ...components,
                            ...documentContents.current[docType].content.slice(
                                topicIndex + 1
                            ),
                        ],
                    };

                    // Remove from map after successful insertion
                    delete componentsMap[topicId];
                    break;
                }
            }
        }

        // Second round: insert remaining components (topics that were in map during first round)
        const remainingKeys = Object.keys(componentsMap);
        for (const topicId of remainingKeys) {
            const components = componentsMap[topicId];
            if (!components || components.length === 0) continue;

            // Search through all document types again
            for (const docType of Object.keys(documentContents.current)) {
                const docContent = documentContents.current[docType];
                if (!docContent || !docContent.content) continue;

                // Find the topic with matching id in the content
                const topicIndex = docContent.content.findIndex(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (node: any) =>
                        node.type === "topic" && node.attrs?.id === topicId
                );

                if (topicIndex !== -1) {
                    console.debug(
                        "Inserting remaining components for topic:",
                        topicId
                    );
                    // Insert components after the topic
                    documentContents.current[docType] = {
                        type: "doc",
                        content: [
                            ...documentContents.current[docType].content.slice(
                                0,
                                topicIndex + 1
                            ),
                            ...components,
                            ...documentContents.current[docType].content.slice(
                                topicIndex + 1
                            ),
                        ],
                    };

                    // Remove from map after successful insertion
                    delete componentsMap[topicId];
                    break;
                }
            }
        }

        // Update the ref to reflect the cleaned map
        componentsToTopicMap.current = componentsMap;

        // Log the final organized content
        console.debug(
            "Document contents after organization:",
            documentContents.current
        );
    }, []);

    // Handle cancel
    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setCurrentStep("input");
        setAgentMessages([]);
        setError(null);
    };

    // Handle apply - create project and documents with content
    const handleApply = useCallback(async () => {
        if (!projectName.trim()) return;

        setIsApplying(true);
        setError(null);

        try {
            // Step 1: Create the project
            const project = await createProjectMutation.mutateAsync({
                name: projectName,
                description: "",
            });

            if (!project) {
                throw new Error("Failed to create project");
            }

            // Step 2: Create documents for each type that has content
            const documentTypes = [
                DocumentType.SRD,
                DocumentType.SDD,
                DocumentType.STD,
            ];

            console.debug("final document contents:", documentContents.current);

            for (const docType of documentTypes) {
                if (documentContents.current[docType]?.content?.length > 0) {
                    // Create document
                    const document = await createDocumentMutation.mutateAsync({
                        projectId: project.id,
                        title: `${projectName} - ${docType}`,
                        description: "",
                        type: docType,
                    });

                    if (document) {
                        // Transform content to Yjs format
                        const ydoc = TiptapTransformer.toYdoc(
                            documentContents.current[docType],
                            "default",
                            [...ExtensionKit()]
                        );

                        // Convert Yjs document to Uint8Array
                        const update = Y.encodeStateAsUpdate(ydoc);

                        // Convert Uint8Array to number array for backend
                        const numberArray = Array.from(update);

                        // Set document content with number array
                        await setDocumentContent(document.id, numberArray);
                    }
                }
            }

            // Success - close dialog and select the first created document
            const firstDocumentType = documentTypes.find(
                (type) => documentContents.current[type]?.content?.length > 0
            );

            if (firstDocumentType) {
                console.debug("Project creation completed successfully");
            }

            // Reset form and go back
            // onBack();
        } catch (error) {
            console.error("Error creating project with documents:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create project"
            );
        } finally {
            setIsApplying(false);
        }
    }, [projectName, createProjectMutation, createDocumentMutation]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Flex align="center" className="gap-2 mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    type="button"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-lg">Draft with AI</DialogTitle>
            </Flex>

            <DialogDescription className="mb-6">
                Describe your project idea and let AI generate a comprehensive
                document structure.
            </DialogDescription>

            {currentStep === "input" && (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                            id="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Enter project name"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="prompt">Project Description</Label>
                        <TextArea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your project idea, features, and requirements..."
                            className="mt-1 min-h-[120px]"
                            rows={6}
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-red-50 border border-red-200">
                            <Flex align="center" className="gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-700">
                                    {error}
                                </span>
                            </Flex>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={!prompt.trim() || !projectName.trim()}
                        >
                            Generate Draft
                        </Button>
                    </DialogFooter>
                </div>
            )}

            {currentStep === "generating" && (
                <div className="space-y-4">
                    <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                        <Flex align="center" className="gap-2 mb-2">
                            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                            <span className="text-sm font-medium">
                                Generating project documents...
                            </span>
                        </Flex>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {agentMessages.map((message, index) => (
                            <AgentMessageItem key={index} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">
                            Document Generation Progress
                        </h4>
                        {/* <DocumentBlock
                            name="Software Requirements Document (SRD)"
                            status={documentStatus[DocumentType.SRD]}
                        />
                        <DocumentBlock
                            name="Software Design Document (SDD)"
                            status={documentStatus[DocumentType.SDD]}
                        />
                        <DocumentBlock
                            name="Software Test Document (STD)"
                            status={documentStatus[DocumentType.STD]}
                        /> */}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </div>
            )}

            {currentStep === "review" && (
                <div className="space-y-4">
                    <div className="p-4 rounded-md bg-green-50 border border-green-200">
                        <Flex align="center" className="gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">
                                Draft generation completed!
                            </span>
                        </Flex>
                    </div>

                    <div>
                        <Label htmlFor="finalProjectName">Project Name</Label>
                        <Input
                            id="finalProjectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">
                            Generated Documents
                        </h4>
                        {/* <DocumentBlock
                            name="Software Requirements Document (SRD)"
                            status={documentStatus[DocumentType.SRD]}
                        />
                        <DocumentBlock
                            name="Software Design Document (SDD)"
                            status={documentStatus[DocumentType.SDD]}
                        />
                        <DocumentBlock
                            name="Software Test Document (STD)"
                            status={documentStatus[DocumentType.STD]}
                        /> */}
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-red-50 border border-red-200">
                            <Flex align="center" className="gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-700">
                                    {error}
                                </span>
                            </Flex>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            // disabled={isApplying}
                        >
                            Start Over
                        </Button>
                        <Button
                            type="button"
                            onClick={handleApply}
                            // disabled={
                            //     !isReadyToApply ||
                            //     !projectName.trim() ||
                            //     isApplying
                            // }
                        >
                            {isApplying ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating Project...
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            )}
        </form>
    );
};
