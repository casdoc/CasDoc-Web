import ProjectMenu from "../menu/ProjectMenu";
import DropDownMenu from "../menu/DropDownMenu";
import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

const dropdownItems = ["Order"];

const ProjectGroup = () => {
    const {
        projects,
        createProject,
        selectedProjectId,
        openEditProjectDialog,
    } = useProjectContext();
    const [isOpen, setIsOpen] = useState(true);
    const handleAddProject = (e: React.MouseEvent) => {
        e.stopPropagation();
        const projectId = createProject("Untitled Project");
        openEditProjectDialog(projectId);
        setIsOpen(true);
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarGroup>
                <CollapsibleTrigger className="hover:bg-gray-200 rounded-md group/chevron">
                    <SidebarGroupLabel className=" text-gray-400 hover:text-black text-sm border-b border-gray-200 rounded-none py-5 my-1">
                        <div className="flex items-center gap-1">
                            My Projects
                            <ChevronDown className="w-4 h-4 opacity-0 group-hover/chevron:opacity-100 transition-all duration-200 group-data-[state=open]/chevron:rotate-180" />
                        </div>
                        <div className="ml-auto flex items-center gap-1 text-black">
                            <Plus
                                onClick={handleAddProject}
                                className="hover:bg-gray-300 rounded-md w-6 h-6 p-1"
                            />
                            <DropDownMenu dropdownItems={dropdownItems} />
                        </div>
                    </SidebarGroupLabel>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects.filter(Boolean).map((project, index) => (
                                <ProjectMenu
                                    key={index}
                                    name={project.name}
                                    projectId={project.id}
                                    isSelected={
                                        project.id === selectedProjectId
                                    }
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
};

export default ProjectGroup;
