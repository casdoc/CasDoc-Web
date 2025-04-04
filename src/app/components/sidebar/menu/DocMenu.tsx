import { File } from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { Document } from "@/app/models/entity/Document";
import EditDialog from "../dialog/DocEditDialog";

const dropdownItems = ["Edit", "Delete"];

interface DocMenuProps {
    doc: Document;
    onDelete: (documentId: string) => void;
}

const DocMenu = ({ doc, onDelete }: DocMenuProps) => {
    const { selectedDocumentId, selectDocument } = useProjectContext();

    const isSelected = selectedDocumentId === doc.getId();

    const handleMenuClick = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();

        console.log(action);
        if (action === "Delete") {
            onDelete(doc.getId());
        } else if (action === "Edit") {
        }
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                className={`hover:bg-gray-200 ${
                    isSelected ? "bg-gray-200" : ""
                }`}
                onClick={() => selectDocument(doc.getId())}
            >
                <div>
                    <File />
                    <span className="truncate select-none">
                        {doc.getTitle()}
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
