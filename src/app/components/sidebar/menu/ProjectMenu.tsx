import DocMenu from "./DocMenu";
import DropDownMenu from "./DropDownMenu";
import { useEffect, useState } from "react";
import { Folder, Plus } from "lucide-react";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
    SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { Document } from "@/app/models/entity/Document";

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
        selectProject,
        currentProjectDocuments,
    } = useProjectContext();

    // Use the documents directly from the context when this project is selected
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

    const handleProjectClick = () => {
        // selectProject(projectId);
    };

    return (
        <SidebarMenuItem key={projectId}>
            <SidebarMenuButton
                asChild
                // className={`hover:bg-neutral-200`}
                onClick={handleProjectClick}
            >
                <div>
                    <Folder />
                    <span>{name}</span>
                    <SidebarMenuAction>
                        <div className="flex flex-row items-center gap-2 mr-7">
                            <Plus onClick={handleAddDocument} size={16} />
                            <DropDownMenu
                                dropdownItems={dropdownItems}
                                onClick={handleMenuClick}
                            />
                        </div>
                    </SidebarMenuAction>
                </div>
            </SidebarMenuButton>

            <SidebarMenuSub>
                {documents.map((doc) => (
                    <DocMenu
                        key={doc.id}
                        name={doc.getTitle()}
                        documentId={doc.id}
                    />
                ))}
            </SidebarMenuSub>
        </SidebarMenuItem>
    );
};

export default ProjectMenu;
