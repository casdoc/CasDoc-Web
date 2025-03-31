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
                <Plus onClick={handleAddProject} />
                <DropDownMenu dropdownItems={dropdownItems} />
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
