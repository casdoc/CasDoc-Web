import { File } from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { Document } from "@/app/models/entity/Document";

const dropdownItems = ["Rename", "Delete"];

interface DocMenuProps {
    document: Document;
    onDelete: (documentId: string) => void;
}

const DocMenu = ({ document, onDelete }: DocMenuProps) => {
    const { selectedDocumentId, selectDocument } = useProjectContext();

    const isSelected = selectedDocumentId === document.getId();

    const handleMenuClick = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();

        console.log(action);
        if (action === "Delete") {
            onDelete(document.getId());
        } else if (action === "Rename") {
        }
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                className={`hover:bg-gray-200 ${
                    isSelected ? "bg-gray-200" : ""
                }`}
                onClick={() => selectDocument(document.getId())}
            >
                <div>
                    <File />
                    <span className="truncate select-none">
                        {document.getTitle()}
                    </span>
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
