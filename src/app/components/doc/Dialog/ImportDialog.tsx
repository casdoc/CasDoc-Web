import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";
import { Editor } from "@tiptap/react";
import { FileText, FileUp } from "lucide-react";

interface ImportDialogProps {
    editor: Editor;
}

const ImportDialog = ({ editor }: ImportDialogProps) => {
    const { toast } = useToast();
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const extension = file.name.split(".").pop()?.toLowerCase();
        if (extension !== "md" && extension !== "txt") {
            toast({
                title: "Invalid File Format",
                description: "Please choose Markdown (.md) or Text (.txt) file",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setIsLoading(false);
            setImportDialogOpen(false); // Close the dialog after file is loaded
            showImportToast(content);
        };
        reader.readAsText(file);
    };
    const handleInsert = (markdownContent: string) => {
        console.debug("Inserting Markdown content:", markdownContent);
        if (editor) {
            const htmlContent = marked(markdownContent);
            console.debug("HTML Content:", htmlContent);
            editor
                .chain()
                .focus()
                .insertContentAt(editor.state.doc.content.size, htmlContent)
                .run();
            toast({
                title: "Inserted",
                description: "Markdown content inserted",
            });
        }
    };
    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        console.debug("Copied Markdown content:", content);
        toast({
            title: "Copied",
            description: "Markdown content copied to clipboard",
        });
    };
    const showImportToast = (content: string) => {
        toast({
            title: "Markdown imported",
            description: "Do you want to copy or insert the content?",
            action: (
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleCopy(content)}>
                        Copy
                    </Button>
                    <Button size="sm" onClick={() => handleInsert(content)}>
                        Insert to Bottom
                    </Button>
                </div>
            ),
        });
    };

    return (
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="default">
                    <FileUp />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Content</DialogTitle>
                    <DialogDescription>
                        Select an import method to add content to your document.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-2 pt-2">
                    <Button
                        className="justify-start"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FileText className="mr-2" />
                        Import from Markdown
                    </Button>
                    <input
                        type="file"
                        accept=".md,.txt"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    {isLoading && (
                        <div className="flex justify-center">
                            <div className="animate-pulse h-4 w-full bg-gray-200 rounded"></div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImportDialog;
