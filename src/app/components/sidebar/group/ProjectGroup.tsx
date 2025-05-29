import ProjectMenu from "../menu/ProjectMenu";
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@/app/models/entity/Project";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectGroup = () => {
    const queryClient = useQueryClient();
    const projects = queryClient.getQueryData<Project[]>(["projects"]);
    const { isInitialized, openProjectDialog } = useProjectContext();
    const [isOpen, setIsOpen] = useState(true);

    const handleAddProject = (e: React.MouseEvent) => {
        e.stopPropagation();
        openProjectDialog();
        setIsOpen(true);
    };

    if (!isInitialized || !projects) {
        // Loading skeleton
        return (
            <SidebarGroup className="p-2">
                <div className="group/chevron flex w-full items-center justify-between rounded-md px-2 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition">
                    <SidebarGroupLabel className="flex w-full items-center justify-between text-sm font-medium">
                        <div className="flex items-center gap-2">
                            My Projects
                            <ChevronUp className="w-4 h-4 transition-transform group-data-[state=open]/chevron:rotate-180" />
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                            <Plus className="w-6 h-6 p-1 rounded-md hover:bg-muted hover:text-accent-foreground transition" />
                        </div>
                    </SidebarGroupLabel>
                </div>
                <SidebarGroupContent className="pl-2">
                    <SidebarMenu className="space-y-1">
                        {[...Array(3)].map((_, i) => (
                            <SidebarMenuItem key={i} className="space-y-1">
                                {/* Project Skeleton */}
                                <Skeleton className="h-6 w-full rounded bg-muted animate-pulse" />

                                {/* Document Skeleton x 2~3 */}
                                <SidebarMenuSub className="pl-6 space-y-1">
                                    <Skeleton className="h-5 w-36 rounded bg-muted/80 animate-pulse" />
                                    <Skeleton className="h-5 w-28 rounded bg-muted/80 animate-pulse" />
                                    <Skeleton className="h-5 w-32 rounded bg-muted/80 animate-pulse" />
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarGroup>
                <CollapsibleTrigger className="group/chevron flex w-full items-center justify-between rounded-md px-2 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition">
                    <SidebarGroupLabel className="flex w-full items-center justify-between text-sm font-medium">
                        <div className="flex items-center gap-2">
                            My Projects
                            <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/chevron:rotate-180" />
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                            <Plus
                                onClick={handleAddProject}
                                className="w-6 h-6 p-1 rounded-md hover:bg-muted hover:text-accent-foreground transition"
                            />
                        </div>
                    </SidebarGroupLabel>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarGroupContent className="pl-2">
                        <SidebarMenu>
                            {projects.filter(Boolean).map((project, index) => (
                                <ProjectMenu
                                    key={index}
                                    name={project.name}
                                    projectId={project.id}
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
