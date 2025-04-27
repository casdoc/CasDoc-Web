import DocMenu from "./DocMenu";
import DropDownMenu from "./DropDownMenu";
import { useState } from "react";
import { ChevronDown, Folder, Plus } from "lucide-react";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useDocumentsQuery } from "@/app/viewModels/hooks/useDocumentsQuery";
import { useDeleteProjectMutation } from "@/app/viewModels/hooks/useDeleteProjectMutation";
import { useProjectsQuery } from "@/app/viewModels/hooks/useProjectsQuery";

import z from "zod";

const dropdownItems = ["Edit", "Delete"];

interface ProjectMenuProps {
    name: string;
    projectId: string;
    isSelected?: boolean;
}

const ProjectMenu = ({ name, projectId }: ProjectMenuProps) => {
    const { mutateAsync: deleteProjectMutation } = useDeleteProjectMutation();
    const { selectProject, openProjectDialog, openDocumentDialog } =
        useProjectContext();
    const { isSuccess: isProjectsSuccess, isLoading } = useProjectsQuery();
    const uuidSchema = z.uuid({ version: "v4" });
    const { data: documents } = useDocumentsQuery(
        projectId,
        //prevent create project from being called when projectId is not valid
        isProjectsSuccess && !uuidSchema.safeParse(projectId).success
    );

    const [isOpen, setIsOpen] = useState(true);

    const handleAddDocument = (e: React.MouseEvent) => {
        e.stopPropagation();
        openDocumentDialog(projectId);
        setIsOpen(true);
    };

    const handleMenuClick = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (action === "Delete") {
            deleteProjectMutation(projectId);
        } else if (action === "Edit") {
            openProjectDialog(projectId);
        }
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
                        {documents?.filter(Boolean).map((doc, index) => (
                            <DocMenu
                                key={index}
                                projectId={projectId}
                                documentId={doc.id}
                                title={doc.title}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default ProjectMenu;
