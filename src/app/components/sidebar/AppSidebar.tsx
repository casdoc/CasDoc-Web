import {
    Sidebar,
    // SidebarHeader,
    SidebarContent,
    // SidebarFooter,
} from "@/components/ui/sidebar";
import ProjectGroup from "./group/ProjectGroup";
import ProjectEditDialog from "./dialog/ProjectEditDialog";
import DocEditDialog from "./dialog/DocEditDialog";

const AppSidebar = () => (
    <Sidebar>
        {/* <SidebarHeader /> */}
        <SidebarContent className="bg-neutral-50">
            <ProjectGroup />
            <ProjectEditDialog />
            <DocEditDialog />
        </SidebarContent>
        {/* <SidebarFooter /> */}
    </Sidebar>
);

export default AppSidebar;
