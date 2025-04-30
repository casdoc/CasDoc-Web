import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Flex, TextArea } from "@radix-ui/themes";
import { ArrowLeft, CheckCircle, Clock, Loader2 } from "lucide-react";

// Document block component
const DocumentBlock = ({
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

    return (
        <Flex
            align="center"
            className="p-3 rounded-md border bg-white shadow-sm mb-3"
        >
            <div className="mr-3">{getIcon()}</div>
            <div className="text-sm font-medium">{name}</div>
        </Flex>
    );
};

export const DraftProjectWithAIForm = ({
    prompt,
    setPrompt,
    onSubmit,
    isGenerating,
    onBack,
    onApply,
    isDraftReady,
}: {
    prompt: string;
    setPrompt: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isGenerating: boolean;
    onBack: () => void;
    onApply: () => void;
    isDraftReady: boolean;
}) => (
    <form onSubmit={onSubmit}>
        <Flex align="center" className="gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack} type="button">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-lg">Draft Project with AI</DialogTitle>
        </Flex>

        <DialogDescription className="mb-6">
            Provide a short prompt to help AI draft your project details.
        </DialogDescription>

        <Flex className="gap-8 py-4 transition-all duration-500">
            <Flex direction="column" className="flex-1 gap-4">
                <Label htmlFor="prompt" className="text-left text-lg">
                    Prompt
                </Label>
                <TextArea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Build a project management app"
                    className="h-40 rounded-md p-3"
                />
                <DialogFooter className="mt-4">
                    <Button
                        type="submit"
                        disabled={!prompt.trim() || isGenerating}
                    >
                        Generate Project
                    </Button>
                </DialogFooter>
            </Flex>

            {(isGenerating || isDraftReady) && (
                <Flex
                    direction="column"
                    justify="between"
                    className="flex-1 border-l pl-8 pr-4 transition-all duration-500"
                >
                    <Flex direction="column" className="pt-4 w-full">
                        <Label className="text-left mb-3">
                            Generated Documents
                        </Label>
                        <DocumentBlock
                            name="Requirements Document"
                            status={
                                isDraftReady
                                    ? "completed"
                                    : isGenerating
                                    ? "generating"
                                    : "waiting"
                            }
                        />
                        <DocumentBlock
                            name="Design Document"
                            status={isDraftReady ? "completed" : "waiting"}
                        />
                        <DocumentBlock
                            name="Test Document"
                            status={isDraftReady ? "completed" : "waiting"}
                        />
                    </Flex>
                    <Flex justify="end">
                        <Button disabled={isGenerating} onClick={onApply}>
                            {isGenerating
                                ? "Generating..."
                                : "Apply to Project"}
                        </Button>
                    </Flex>
                </Flex>
            )}
        </Flex>
    </form>
);
