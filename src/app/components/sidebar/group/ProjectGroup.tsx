import ProjectMenu from "../menu/ProjectMenu";
import DropDownMenu from "../menu/DropDownMenu";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
    SidebarGroup,
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
            <SidebarGroupLabel className="text-gray-400 text-sm border-b border-gray-200 rounded-none">
                My Projects
                <div className="ml-auto flex items-center gap-1 text-black">
                    <Plus
                        onClick={handleAddProject}
                        className="hover:bg-gray-300 rounded-md w-6 h-6 p-1"
                    />
                    <DropDownMenu dropdownItems={dropdownItems} />
                </div>
            </SidebarGroupLabel>

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
