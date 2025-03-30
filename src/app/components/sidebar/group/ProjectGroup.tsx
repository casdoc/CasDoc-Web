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

const ProjectGroup = () => {
    const [projects, setProjects] = useState<string[]>([]);

    const handleAddProject = () => {
        const newProject = `Project ${projects.length + 1}`;
        setProjects([...projects, newProject]);
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-sm">
                My Projects
            </SidebarGroupLabel>
            <SidebarGroupAction>
                <DropDownMenu dropdownItems={["Order"]} />
                <Plus onClick={handleAddProject} />
            </SidebarGroupAction>
            <SidebarGroupContent>
                <SidebarMenu>
                    {projects.map((project) => (
                        <ProjectMenu key={project} name={project} />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default ProjectGroup;
