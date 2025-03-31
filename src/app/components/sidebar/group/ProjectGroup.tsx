import ProjectMenu from "../menu/ProjectMenu";
import DropDownMenu from "../menu/DropDownMenu";
import { Plus } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";

const dropdownItems = ["Order"];

const ProjectGroup = () => {
    const { projects, createProject, selectedProjectId } = useProjectContext();

    const handleAddProject = () => {
        const projectName = `Project ${projects.length + 1}`;
        createProject(projectName);
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-sm ">
                My Projects
            </SidebarGroupLabel>
            <SidebarGroupAction>
                <div className="flex flex-row items-center gap-2 mr-7">
                    <Plus onClick={handleAddProject} size={16} />
                    <DropDownMenu dropdownItems={dropdownItems} />
                </div>
            </SidebarGroupAction>
            <SidebarGroupContent>
                <SidebarMenu>
                    {projects.map((project) => (
                        <ProjectMenu
                            key={project.id}
                            name={project.name}
                            projectId={project.id}
                            isSelected={project.id === selectedProjectId}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default ProjectGroup;
