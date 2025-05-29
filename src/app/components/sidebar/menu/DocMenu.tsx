import { File } from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { useDeleteDocumentMutation } from "@/app/viewModels/hooks/useDeleteDocumentMutation";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const dropdownItems = ["Edit", "Delete"];

interface DocMenuProps {
    projectId: string;
    documentId: string;
    title: string;
}

const DocMenu = ({ projectId, documentId, title }: DocMenuProps) => {
    const { mutateAsync: deleteDocumentMutation } = useDeleteDocumentMutation();
    const { selectedDocumentId, openDocumentDialog } = useProjectContext();
    const router = useRouter();
    const isSelected = selectedDocumentId === documentId;

    const handleMenuClick = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (action === "Delete") {
            deleteDocumentMutation(documentId);
        } else if (action === "Edit") {
            openDocumentDialog(projectId, documentId);
        }
    };

    const handleDocumentSelect = () => {
        if (isSelected) return;
        router.push(`/documents/${documentId}`);
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                onClick={handleDocumentSelect}
                className={cn(
                    "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted transition",
                    isSelected && "bg-muted"
                )}
            >
                <div className="flex items-center gap-2 w-full">
                    <File className="w-4 h-4" />
                    <span className="truncate select-none">{title}</span>
                    <div className="ml-auto flex items-center gap-1">
                        <DropDownMenu
                            dropdownItems={dropdownItems}
                            onClick={handleMenuClick}
                        />
                    </div>
                </div>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};

export default DocMenu;
