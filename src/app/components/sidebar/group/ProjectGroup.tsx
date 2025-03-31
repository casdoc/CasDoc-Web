import ProjectMenu from "../menu/ProjectMenu";
import DropDownMenu from "../menu/DropDownMenu";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar";

const dropdownItems = ["Order"];

const ProjectGroup = () => {
    const [projects, setProjects] = useState<string[]>([]);
    const [projectCount, setProjectCount] = useState(1);

    const handleAddProject = () => {
        const newProject = `Project ${projectCount}`;
        setProjectCount(projectCount + 1);
        setProjects([...projects, newProject]);
    };

    const handleDeleteProject = (projectName: string) => {
        setProjects(projects.filter((project) => project !== projectName));
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-sm">
                My Projects
            </SidebarGroupLabel>
            <SidebarGroupAction>
                <div className="flex flex-row items-center gap-2 pr-7">
                    <Plus onClick={handleAddProject} size={16} />
                    <DropDownMenu dropdownItems={dropdownItems} />
                </div>
            </SidebarGroupAction>
            <SidebarGroupContent>
                <SidebarMenu>
                    {projects.map((project) => (
                        <ProjectMenu
                            key={project}
                            name={project}
                            onDelete={handleDeleteProject}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default ProjectGroup;
