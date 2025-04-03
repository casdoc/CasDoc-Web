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
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";

const dropdownItems = ["Rename", "Delete"];

interface ProjectMenuProps {
    name: string;
    projectId: string;
    isSelected?: boolean;
}

const ProjectMenu = ({ name, projectId }: ProjectMenuProps) => {
    const {
        deleteProject,
        renameProject,
        selectProject,
        getDocumentsByProjectId,
        createDocument,
        deleteDocument,
    } = useProjectContext();

    const [documents, setDocuments] = useState(
        getDocumentsByProjectId(projectId)
    );
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        setDocuments(getDocumentsByProjectId(projectId));
    }, [projectId, getDocumentsByProjectId]);

    const handleAddDocument = (e: React.MouseEvent) => {
        e.stopPropagation();
        createDocument(projectId, "Untitled Document");
        setIsOpen(true);
        setDocuments(getDocumentsByProjectId(projectId));
    };

    const handleMenuClick = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (action === "Delete") {
            deleteProject(projectId);
        } else if (action === "Rename") {
            const newName = prompt("Enter new project name:", name);
            if (newName && newName.trim() !== "") {
                renameProject(projectId, newName);
            }
        }
    };

    const handleDeleteDocument = (documentId: string) => {
        deleteDocument(documentId);
        setDocuments(getDocumentsByProjectId(projectId));
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild className="w-full group/chevron">
                    <SidebarMenuButton
                        asChild
                        className=" hover:bg-gray-200 hover:cursor-pointer"
                        onClick={() => selectProject(projectId)}
                    >
                        <div>
                            <Folder />
                            <span className="flex items-center gap-1 truncate select-none">
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
                    <SidebarMenuSub className="w-11/12">
                        {documents.map((doc) => (
                            <DocMenu
                                key={doc.id}
                                name={doc.getTitle()}
                                documentId={doc.id}
                                onDelete={handleDeleteDocument}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default ProjectMenu;
