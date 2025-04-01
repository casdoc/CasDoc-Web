import DocMenu from "./DocMenu";
import DropDownMenu from "./DropDownMenu";
import { useEffect, useState } from "react";
import { ChevronDown, Folder, Plus } from "lucide-react";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { Document } from "@/app/models/entity/Document";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";

const dropdownItems = ["Rename", "Delete"];

interface ProjectMenuProps {
    name: string;
    projectId: string;
    isSelected?: boolean;
}

const ProjectMenu = ({
    name,
    projectId,
    isSelected = false,
}: ProjectMenuProps) => {
    const {
        createDocument,
        deleteProject,
        renameProject,
        // selectProject,
        currentProjectDocuments,
    } = useProjectContext();

    // Use the documents directly from the context when this project is selected
    const [isOpen, setIsOpen] = useState(true);
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        if (isSelected) {
            setDocuments(currentProjectDocuments);
        }
    }, [isSelected, currentProjectDocuments]);

    const handleAddDocument = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newDocName = `Document ${documents.length + 1}`;
        createDocument(projectId, newDocName);
    };

    const handleMenuClick = (action: string) => {
        if (action === "Delete") {
            deleteProject(projectId);
        } else if (action === "Rename") {
            const newName = prompt("Enter new project name:", name);
            if (newName && newName.trim() !== "") {
                renameProject(projectId, newName);
            }
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem key={name}>
                <CollapsibleTrigger asChild className="w-full group/chevron">
                    <SidebarMenuButton
                        asChild
                        className=" hover:bg-gray-200 hover:cursor-pointer"
                    >
                        <div>
                            <Folder />
                            <span className="flex items-center gap-1 truncate">
                                {name}
                                <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                            </span>

                            <div className="ml-auto flex items-center gap-1">
                                <Plus
                                    onClick={handleAddDocument}
                                    className="hover:bg-gray-300 rounded-md w-6 h-6 p-1"
                                />
                                <DropDownMenu
                                    dropdownItems={dropdownItems}
                                    onClick={handleMenuClick}
                                />
                            </div>
                        </div>
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {documents.map((doc) => (
                            <DocMenu
                                key={doc.id}
                                name={doc.getTitle()}
                                documentId={doc.id}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default ProjectMenu;
